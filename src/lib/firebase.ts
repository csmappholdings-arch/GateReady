import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getAdditionalUserInfo,
  sendEmailVerification
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection, 
  onSnapshot, 
  deleteDoc, 
  getDocFromServer,
  writeBatch,
  addDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { Trip } from '../types/travel';

export const firebaseConfig = {
  projectId: "gate-ready-prod",
  appId: "1:552388040767:web:949defa48893b1f734808a",
  apiKey: "AIzaSyBb4IgPnw9iHN7bMb16ZT9-E4zGf3ZZOuY",
  authDomain: "gate-ready-prod.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "gate-ready-prod.firebasestorage.app",
  messagingSenderId: "552388040767",
  measurementId: "G-YXZC4N8L1T",
  oAuthClientId: "",
  recaptchaSiteKey: ""
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const githubProvider = new GithubAuthProvider();

// Initialize Cloud Firestore (using default database for gate-ready-prod)
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Skill Requirement: Validate connection to Firestore on startup
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline. Operating in offline/cached mode.");
    }
    // Expected on initial boot if doc doesn't exist
    return false;
  }
}
testConnection();

// Auth Helpers
export async function signInWithGoogle(): Promise<{ user: User; isNewUser: boolean }> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const isNew = Boolean(getAdditionalUserInfo(result)?.isNewUser);
  await syncUserProfile(user);
  if (isNew) {
    await attributeReferralOnSignup(user.uid, user.email || undefined);
    await getOrCreateAccountReferralCode(user.uid);
  }
  return { user, isNewUser: isNew };
}

export async function signInWithGithub(): Promise<User> {
  const result = await signInWithPopup(auth, githubProvider);
  const user = result.user;
  const isNew = Boolean(getAdditionalUserInfo(result)?.isNewUser);
  await syncUserProfile(user);
  if (isNew) {
    await attributeReferralOnSignup(user.uid, user.email || undefined);
    await getOrCreateAccountReferralCode(user.uid);
  }
  return user;
}

export async function signUpWithEmail(email: string, pass: string, name?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  if (name && name.trim()) {
    try {
      await updateProfile(user, { displayName: name.trim() });
    } catch (e) {
      console.warn('Could not set displayName on signup:', e);
    }
  }
  try {
    await sendEmailVerification(user);
  } catch (evErr) {
    console.warn('sendEmailVerification failed to send:', evErr);
  }
  await syncUserProfile(user);
  await attributeReferralOnSignup(user.uid, user.email || undefined);
  await getOrCreateAccountReferralCode(user.uid);
  return user;
}

export async function resendVerificationEmail(user: User): Promise<void> {
  if (!user) throw new Error('No user is currently signed in.');
  await sendEmailVerification(user);
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  await syncUserProfile(user);
  return user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function syncUserProfile(user: User): Promise<void> {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : null;

    const updatePayload: Record<string, any> = {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Traveler',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    };

    // Free 7-day trial is linked strictly to when an account is created
    if (!data?.trialStartedAt) {
      const now = Date.now();
      updatePayload.trialStartedAt = new Date(now).toISOString();
      updatePayload.trialExpiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
      updatePayload.trialUsed = true;
    }

    await setDoc(userRef, updatePayload, { merge: true });
  } catch (err) {
    console.error('Error saving user profile to cloud:', err);
  }
}

// Analytics initialization and event helper
let analyticsInstance: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => null);
}

export function trackAccountCreated(method: 'google' | 'email', origin: 'save_gate' | 'header' | 'referral' | 'workspace_banner') {
  try {
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'account_created', {
        method,
        origin,
        timestamp: new Date().toISOString()
      });
    }
    console.log(`[Analytics] account_created event logged: method=${method}, origin=${origin}`);
  } catch (e) {
    console.warn('Analytics log failed:', e);
  }
}

// Email Capture Helper for Feature 2 ("Email me my list")
export async function recordCapturedEmail(data: {
  email: string;
  tripName?: string;
  totalItems?: number;
  source?: string;
}): Promise<void> {
  try {
    const capturedRef = collection(db, 'captured_emails');
    await addDoc(capturedRef, {
      email: data.email.trim().toLowerCase(),
      tripName: data.tripName || 'Upcoming Trip',
      totalItems: data.totalItems || 0,
      source: data.source || 'print_manifest',
      capturedAt: new Date().toISOString(),
      consentNote: 'User opted into receiving packing list and occasional product updates with 1-click unsubscribe.'
    });
    console.log(`[CapturedEmail] Saved email lead: ${data.email}`);
  } catch (err) {
    console.warn('Failed to record captured email in Firestore:', err);
  }
}

// Persistent Account Referral Helper for Feature 3
export async function getOrCreateAccountReferralCode(userId: string): Promise<{
  code: string;
  referralsCount: number;
  referralCreditsMonths: number;
}> {
  if (!userId) {
    return { code: 'GR-START', referralsCount: 0, referralCreditsMonths: 0 };
  }

  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : null;

    if (data?.referralCode) {
      return {
        code: data.referralCode,
        referralsCount: typeof data.referralsCount === 'number' ? data.referralsCount : 0,
        referralCreditsMonths: typeof data.referralCreditsMonths === 'number' ? data.referralCreditsMonths : 0
      };
    }

    // Grandfather existing anonymous-issued code from localStorage if available
    let chosenCode = '';
    try {
      const existing = localStorage.getItem('gateready_referral_code');
      if (existing && existing.startsWith('GR-')) {
        chosenCode = existing.trim();
      }
    } catch {}

    if (!chosenCode) {
      // Generate clean new 6-char alphanumeric code e.g. GR-8K2N9P
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let rand = '';
      for (let i = 0; i < 6; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      chosenCode = `GR-${rand}`;
    }

    // Register code in referral_codes collection
    try {
      const codeRef = doc(db, 'referral_codes', chosenCode);
      await setDoc(codeRef, {
        code: chosenCode,
        ownerUid: userId,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Error saving code registry:', e);
    }

    // Update user profile with persistent code
    await setDoc(userRef, {
      referralCode: chosenCode,
      referralsCount: 0,
      referralCreditsMonths: 0,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Store in localStorage as sync cache
    try {
      localStorage.setItem('gateready_referral_code', chosenCode);
    } catch {}

    return {
      code: chosenCode,
      referralsCount: 0,
      referralCreditsMonths: 0
    };
  } catch (err) {
    console.error('Error in getOrCreateAccountReferralCode:', err);
    return { code: 'GR-START', referralsCount: 0, referralCreditsMonths: 0 };
  }
}

// Attribute referral at signup time
// Grants 1 FREE MONTH of Platinum to the new user AND extends 1 month of Platinum to the referrer
export async function attributeReferralOnSignup(newUserId: string, newUserEmail?: string): Promise<{
  attributed: boolean;
  referrerCode?: string;
  expiresAt?: string;
}> {
  try {
    let refCode = '';
    try {
      refCode = localStorage.getItem('gateready_referred_by_code') || '';
    } catch {}

    if (!refCode || !refCode.trim()) return { attributed: false };
    const cleanCode = refCode.trim().toUpperCase();

    // Look up code owner in referral_codes registry
    const codeRef = doc(db, 'referral_codes', cleanCode);
    const codeSnap = await getDoc(codeRef);
    let ownerUid = codeSnap.exists() ? codeSnap.data()?.ownerUid : null;

    // Do not attribute if self-referral
    if (ownerUid === newUserId) {
      try { localStorage.removeItem('gateready_referred_by_code'); } catch {}
      return { attributed: false };
    }

    const now = Date.now();
    const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
    const newUserExpiresAt = new Date(now + oneMonthMs).toISOString();

    // Mandatory: Apply 1 FREE MONTH of Platinum to the NEW user who created an account
    const newUserRef = doc(db, 'users', newUserId);
    await setDoc(newUserRef, {
      hasClaimedReferralMonth: true,
      referralFreeMonthStartedAt: new Date(now).toISOString(),
      referralFreeMonthExpiresAt: newUserExpiresAt,
      referredByCode: cleanCode,
      subscriptionTier: 'PLATINUM',
      updatedAt: new Date(now).toISOString()
    }, { merge: true });

    try {
      localStorage.setItem('gateready_referral_free_month_expires_at', newUserExpiresAt);
      localStorage.setItem('gateready_subscription_tier_v1', 'PLATINUM');
    } catch {}

    // Record attribution event in referrals collection
    const refEventDoc = doc(collection(db, 'referrals'));
    await setDoc(refEventDoc, {
      referrerCode: cleanCode,
      referrerUid: ownerUid || 'unknown',
      newUserId,
      newUserEmail: newUserEmail || '',
      freeMonthExpiresAt: newUserExpiresAt,
      createdAt: new Date().toISOString()
    });

    // Credit the referrer: Each one provides 1 month of free platinum account
    if (ownerUid) {
      const referrerUserRef = doc(db, 'users', ownerUid);
      try {
        const referrerSnap = await getDoc(referrerUserRef);
        let refExpires = now + oneMonthMs;
        if (referrerSnap.exists()) {
          const refData = referrerSnap.data();
          if (refData?.referralFreeMonthExpiresAt) {
            const existingTime = new Date(refData.referralFreeMonthExpiresAt).getTime();
            if (Number.isFinite(existingTime) && existingTime > now) {
              refExpires = existingTime + oneMonthMs;
            }
          }
        }
        const refExpiresStr = new Date(refExpires).toISOString();
        await updateDoc(referrerUserRef, {
          referralsCount: increment(1),
          referralCreditsMonths: increment(1),
          referralFreeMonthExpiresAt: refExpiresStr,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Could not update referrer count:', e);
      }
    }

    console.log(`[Referral] Attributed signup for ${newUserId} to referrer ${cleanCode} with 1 month Platinum valid until ${newUserExpiresAt}`);

    // Clean up stored referral code
    try {
      localStorage.removeItem('gateready_referred_by_code');
    } catch {}

    return {
      attributed: true,
      referrerCode: cleanCode,
      expiresAt: newUserExpiresAt
    };
  } catch (err) {
    console.warn('Failed to attribute referral:', err);
    return { attributed: false };
  }
}

// Cloud Data Sync Helpers for Trips
export function subscribeToUserTrips(
  userId: string, 
  onSuccess: (trips: Trip[]) => void,
  onError?: (error: Error) => void
) {
  const tripsRef = collection(db, 'users', userId, 'trips');
  return onSnapshot(tripsRef, (snapshot) => {
    const cloudTrips: Trip[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      const tripId = data.id || d.id;
      // Filter out any legacy preset demo trips
      if (tripId === 'trip-nyc-delta' || tripId === 'trip-1' || tripId === 'trip-orlando' || data.name === 'New York Fall Flight') {
        return;
      }
      cloudTrips.push({
        id: tripId,
        name: data.name,
        travelType: data.travelType,
        companyName: data.companyName || '',
        seatClassOrCarSize: data.seatClassOrCarSize || '',
        fareFamily: data.fareFamily || '',
        originCity: data.originCity || '',
        destinationCity: data.destinationCity || '',
        destinationCountry: data.destinationCountry || '',
        departureDate: data.departureDate || '',
        departureTime: data.departureTime || '',
        departureCountdownEnabled: data.departureCountdownEnabled ?? false,
        departureReminders: data.departureReminders || [],
        familyMembers: data.familyMembers || [],
        bags: data.bags || [],
        aircraftType: data.aircraftType || '',
        isReturnRepackMode: data.isReturnRepackMode ?? false,
        returnTripDate: data.returnTripDate || '',
        returnTripTime: data.returnTripTime || '',
        souvenirBufferEnabled: data.souvenirBufferEnabled ?? true,
        gateChecklist: data.gateChecklist || [],
        luggageTags: data.luggageTags || {},
        modeProfiles: data.modeProfiles || {}
      });
    });
    onSuccess(cloudTrips);
  }, (err) => {
    console.error('Error listening to user trips:', err);
    if (onError) onError(err);
  });
}

export async function saveTripToCloud(userId: string, trip: Trip): Promise<void> {
  if (!userId || !trip.id) return;
  try {
    const tripRef = doc(db, 'users', userId, 'trips', trip.id);
    await setDoc(tripRef, {
      id: trip.id,
      userId: userId,
      name: trip.name,
      travelType: trip.travelType,
      companyName: trip.companyName || '',
      seatClassOrCarSize: trip.seatClassOrCarSize || '',
      fareFamily: trip.fareFamily || '',
      originCity: trip.originCity || '',
      destinationCity: trip.destinationCity || '',
      destinationCountry: trip.destinationCountry || '',
      departureDate: trip.departureDate || '',
      departureTime: trip.departureTime || '',
      departureCountdownEnabled: trip.departureCountdownEnabled ?? false,
      departureReminders: trip.departureReminders || [],
      familyMembers: trip.familyMembers || [],
      bags: trip.bags || [],
      aircraftType: trip.aircraftType || '',
      isReturnRepackMode: trip.isReturnRepackMode ?? false,
      returnTripDate: trip.returnTripDate || '',
      returnTripTime: trip.returnTripTime || '',
      souvenirBufferEnabled: trip.souvenirBufferEnabled ?? true,
      gateChecklist: trip.gateChecklist || [],
      luggageTags: trip.luggageTags || {},
      modeProfiles: trip.modeProfiles || {},
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`Failed to save trip ${trip.id} to cloud:`, err);
    throw err;
  }
}

export async function deleteTripFromCloud(userId: string, tripId: string): Promise<void> {
  if (!userId || !tripId) return;
  try {
    const tripRef = doc(db, 'users', userId, 'trips', tripId);
    await deleteDoc(tripRef);
  } catch (err) {
    console.error(`Failed to delete trip ${tripId} from cloud:`, err);
    throw err;
  }
}

export async function syncLocalTripsToCloud(userId: string, localTrips: Trip[]): Promise<void> {
  if (!userId || !localTrips || localTrips.length === 0) return;
  try {
    const batch = writeBatch(db);
    for (const trip of localTrips) {
      const tripRef = doc(db, 'users', userId, 'trips', trip.id);
      batch.set(tripRef, {
        id: trip.id,
        userId: userId,
        name: trip.name,
        travelType: trip.travelType,
        companyName: trip.companyName || '',
        seatClassOrCarSize: trip.seatClassOrCarSize || '',
        fareFamily: trip.fareFamily || '',
        originCity: trip.originCity || '',
        destinationCity: trip.destinationCity || '',
        destinationCountry: trip.destinationCountry || '',
        departureDate: trip.departureDate || '',
        departureTime: trip.departureTime || '',
        departureCountdownEnabled: trip.departureCountdownEnabled ?? false,
        departureReminders: trip.departureReminders || [],
        familyMembers: trip.familyMembers || [],
        bags: trip.bags || [],
        aircraftType: trip.aircraftType || '',
        isReturnRepackMode: trip.isReturnRepackMode ?? false,
        returnTripDate: trip.returnTripDate || '',
        returnTripTime: trip.returnTripTime || '',
        souvenirBufferEnabled: trip.souvenirBufferEnabled ?? true,
        gateChecklist: trip.gateChecklist || [],
        luggageTags: trip.luggageTags || {},
        modeProfiles: trip.modeProfiles || {},
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error('Failed to batch sync local trips to cloud:', err);
    throw err;
  }
}

export async function deleteUserAccountAndData(userId: string): Promise<void> {
  if (!userId) return;
  try {
    // 1. Delete all trips in users/{userId}/trips
    const tripsColl = collection(db, 'users', userId, 'trips');
    const snapshot = await getDocs(tripsColl);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    // 2. Delete user profile doc in users/{userId}
    const userDocRef = doc(db, 'users', userId);
    batch.delete(userDocRef);
    await batch.commit();

    // 3. Delete Firebase Auth user account if matching active current user
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await auth.currentUser.delete();
      } catch (authErr) {
        console.warn('Auth user delete note (e.g. requires fresh login):', authErr);
        await firebaseSignOut(auth);
      }
    }
  } catch (err) {
    console.error(`Failed to delete account and data for user ${userId}:`, err);
    throw err;
  }
}
