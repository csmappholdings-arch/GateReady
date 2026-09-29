import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { Trip } from '../types/travel';

export const firebaseConfig = {
  projectId: "evocative-ranger-0smzh",
  appId: "1:463979773556:web:e744b145ce240f26415b21",
  apiKey: "AIzaSyAgzao6GfmdxLdiFnEVzvJk-LocnPdYZic",
  authDomain: "evocative-ranger-0smzh.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-gateready-2f760ff4-8d7a-48b4-97ad-6aca2b4c6665",
  storageBucket: "evocative-ranger-0smzh.firebasestorage.app",
  messagingSenderId: "463979773556",
  measurementId: "",
  oAuthClientId: "463979773556-f3h2r4ta81qp8hq0cf3tj58b7i6o26lp.apps.googleusercontent.com",
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

// Initialize Cloud Firestore (using the provisioned database ID)
export const db = firebaseConfig.firestoreDatabaseId 
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
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // Upsert user profile to Firestore
  await syncUserProfile(user);
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
  await syncUserProfile(user);
  return user;
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
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Traveler',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user profile to cloud:', err);
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
        departureDate: data.departureDate || '',
        departureTime: data.departureTime || '',
        departureCountdownEnabled: data.departureCountdownEnabled ?? false,
        departureReminders: data.departureReminders || [],
        familyMembers: data.familyMembers || [],
        bags: data.bags || [],
        aircraftType: data.aircraftType || '',
        isReturnRepackMode: data.isReturnRepackMode ?? false,
        returnTripDate: data.returnTripDate || '',
        souvenirBufferEnabled: data.souvenirBufferEnabled ?? true,
        gateChecklist: data.gateChecklist || []
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
      departureDate: trip.departureDate || '',
      departureTime: trip.departureTime || '',
      departureCountdownEnabled: trip.departureCountdownEnabled ?? false,
      departureReminders: trip.departureReminders || [],
      familyMembers: trip.familyMembers || [],
      bags: trip.bags || [],
      aircraftType: trip.aircraftType || '',
      isReturnRepackMode: trip.isReturnRepackMode ?? false,
      returnTripDate: trip.returnTripDate || '',
      souvenirBufferEnabled: trip.souvenirBufferEnabled ?? true,
      gateChecklist: trip.gateChecklist || [],
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
        departureDate: trip.departureDate || '',
        departureTime: trip.departureTime || '',
        departureCountdownEnabled: trip.departureCountdownEnabled ?? false,
        departureReminders: trip.departureReminders || [],
        familyMembers: trip.familyMembers || [],
        bags: trip.bags || [],
        gateChecklist: trip.gateChecklist || [],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error('Failed to batch sync local trips to cloud:', err);
    throw err;
  }
}
