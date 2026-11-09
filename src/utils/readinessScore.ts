import { Trip, TravelReadinessScore, Bag } from '../types/travel';
import { computeBagWeightStatus } from './bagWeightAnalysis';

/**
 * Calculates the comprehensive Travel Readiness Score (0 - 100) for a trip.
 * 
 * Scoring Categories (Phase 2 Specification):
 * - Packing checklist: 30 points
 * - Baggage compliance: 30 points
 * - Traveller preparation: 15 points
 * - Travel documents: 15 points
 * - Final trip review: 10 points
 */
export function calculateTravelReadinessScore(trip: Trip): TravelReadinessScore {
  const recommendations: TravelReadinessScore['recommendedNextActions'] = [];

  // ==========================================
  // 1. PACKING CHECKLIST (30 Points Max)
  // ==========================================
  const allItems = trip.bags.flatMap((b) => b.items);
  const totalItemsCount = allItems.length;
  const packedItemsCount = allItems.filter((i) => i.isPacked).length;

  let packingScore = 0;
  let packingPercentage = 0;
  let packingDetail = 'No items added yet';
  let packingComplete = false;

  if (totalItemsCount === 0) {
    packingScore = 0;
    packingPercentage = 0;
    packingDetail = 'Add packing items to your bags';
    recommendations.push({
      id: 'pack_empty',
      title: 'Start Your Packing List',
      description: 'Add clothes, toiletries, and travel essentials to your suitcases.',
      actionLabel: 'Open Packing Checklist',
      targetTab: 'Checklist',
      priority: 'HIGH'
    });
  } else {
    packingPercentage = Math.round((packedItemsCount / totalItemsCount) * 100);
    packingScore = Math.round((packedItemsCount / totalItemsCount) * 30);
    packingDetail = `${packedItemsCount} of ${totalItemsCount} items packed (${packingPercentage}%)`;
    packingComplete = packedItemsCount === totalItemsCount && totalItemsCount > 0;

    if (!packingComplete) {
      recommendations.push({
        id: 'pack_remaining',
        title: `Complete Remaining Items (${totalItemsCount - packedItemsCount} left)`,
        description: `Pack and check off the remaining items before heading to the airport.`,
        actionLabel: 'Pack Remaining Items',
        targetTab: 'Checklist',
        priority: totalItemsCount - packedItemsCount > 5 ? 'HIGH' : 'MEDIUM'
      });
    }
  }

  // ==========================================
  // 2. BAGGAGE COMPLIANCE (30 Points Max)
  // ==========================================
  let baggageScore = 0;
  let baggagePercentage = 0;
  let baggageDetail = 'No bags created';
  let baggageComplete = false;

  if (!trip.bags || trip.bags.length === 0) {
    baggageScore = 0;
    baggageDetail = 'Add at least one carry-on or checked bag';
    recommendations.push({
      id: 'bag_add',
      title: 'Add Your First Bag',
      description: 'Configure your carry-on or checked suitcase to track weights and limits.',
      actionLabel: 'Add Luggage',
      targetTab: 'Luggage',
      priority: 'HIGH'
    });
  } else {
    let overweightCount = 0;
    let approachingCount = 0;
    let unverifiedTareCount = 0;
    let missingDimensionsCount = 0;

    trip.bags.forEach((bag) => {
      const status = computeBagWeightStatus(bag, 'LBS', trip.companyName, trip.travelType);

      if (status.isOverweight) {
        overweightCount++;
      } else if (status.isNearLimit) {
        approachingCount++;
      }

      if (bag.emptyBagWeightLbs === undefined) {
        unverifiedTareCount++;
      }

      if (!bag.lengthInches || !bag.widthInches || !bag.heightInches) {
        missingDimensionsCount++;
      }
    });

    if (overweightCount > 0) {
      baggageScore = 10;
      baggageDetail = `${overweightCount} bag${overweightCount > 1 ? 's' : ''} exceed airline limit!`;
      recommendations.push({
        id: 'bag_overweight',
        title: 'Rebalance Overweight Luggage',
        description: 'Redistribute packed items across bags or deduct excess weight to prevent airport fees.',
        actionLabel: 'Rebalance Luggage',
        targetTab: 'Luggage',
        priority: 'HIGH'
      });
    } else if (approachingCount > 0) {
      baggageScore = 24;
      baggageDetail = `${approachingCount} bag approaching weight limit`;
    } else {
      baggageScore = 30;
      baggageDetail = `All ${trip.bags.length} bags within airline allowances`;
      baggageComplete = true;
    }

    if (missingDimensionsCount > 0 && baggageScore > 15) {
      baggageScore = Math.max(15, baggageScore - 4);
      recommendations.push({
        id: 'bag_dimensions',
        title: 'Verify Luggage Dimensions',
        description: 'Check length, width, and height against carrier sizer boxes.',
        actionLabel: 'Verify Dimensions',
        targetTab: 'Luggage',
        priority: 'LOW'
      });
    }

    baggagePercentage = Math.round((baggageScore / 30) * 100);
  }

  // ==========================================
  // 3. TRAVELLER PREPARATION (15 Points Max)
  // ==========================================
  const rawTravelers = trip.familyMembers || [];
  const travelerCount = Math.max(1, rawTravelers.length);
  let travelerScore = 0;
  let travelerDetail = '1 traveler (self)';
  let travelerComplete = false;

  if (rawTravelers.length <= 1) {
    // Solo traveler - check if they have bags and items
    if (totalItemsCount > 0 && trip.bags.length > 0) {
      travelerScore = 15;
      travelerDetail = 'Solo traveler luggage assigned';
      travelerComplete = true;
    } else {
      travelerScore = 8;
      travelerDetail = 'Solo traveler checklist in progress';
    }
  } else {
    // Multi-traveler group: check if each traveler has items or bags assigned
    const assignedPackers = new Set(allItems.map((i) => i.packedFor).filter(Boolean));
    const assignedBagOwners = new Set(trip.bags.map((b) => b.assignedTo).filter(Boolean));
    
    let preparedCount = 0;
    rawTravelers.forEach((m) => {
      if (assignedPackers.has(m) || assignedBagOwners.has(m)) {
        preparedCount++;
      }
    });

    const ratio = preparedCount / rawTravelers.length;
    travelerScore = Math.round(ratio * 15);
    travelerDetail = `${preparedCount} of ${rawTravelers.length} travelers have items assigned`;
    travelerComplete = preparedCount === rawTravelers.length;

    if (!travelerComplete) {
      recommendations.push({
        id: 'traveler_assign',
        title: 'Assign Packing to Family Members',
        description: 'Assign bags or packing lists to companions to keep everybody organized.',
        actionLabel: 'Manage Travellers',
        targetTab: 'Travellers',
        priority: 'MEDIUM'
      });
    }
  }
  const travelerPercentage = Math.round((travelerScore / 15) * 100);

  // ==========================================
  // 4. TRAVEL DOCUMENTS (15 Points Max)
  // ==========================================
  const docs = trip.travelDocuments || {};
  const docFields: Array<keyof typeof docs> = [
    'passportChecked',
    'visaReviewed',
    'boardingPassAvailable',
    'travelInsuranceReviewed',
    'hotelConfirmationAvailable',
    'flightConfirmationAvailable',
    'travelAuthorizationsReviewed'
  ];

  const totalDocsCount = docFields.length;
  const completedDocsCount = docFields.filter((key) => !!docs[key]).length;

  let documentsScore = Math.round((completedDocsCount / totalDocsCount) * 15);
  let documentsPercentage = Math.round((completedDocsCount / totalDocsCount) * 100);
  let documentsDetail = `${completedDocsCount} of ${totalDocsCount} travel documents verified`;
  let documentsComplete = completedDocsCount === totalDocsCount;

  if (completedDocsCount < totalDocsCount) {
    recommendations.push({
      id: 'docs_incomplete',
      title: 'Review Travel Document Checklist',
      description: 'Check off passport validity, visas, boarding pass, and hotel confirmations.',
      actionLabel: 'Check Documents',
      targetTab: 'Documents',
      priority: completedDocsCount <= 2 ? 'HIGH' : 'MEDIUM'
    });
  }

  // ==========================================
  // 5. FINAL TRIP REVIEW (10 Points Max)
  // ==========================================
  let finalReviewScore = 0;
  let finalReviewDetail = 'Departure details pending';
  let finalReviewComplete = false;

  const hasDepartureDate = !!trip.departureDate;
  const hasDepartureTime = !!trip.departureTime;
  const hasCarrierOrOrigin = !!(trip.companyName && (trip.originCity || trip.destinationCity));
  const hasGateCheck = !!(trip.gateChecklist && trip.gateChecklist.some((g) => g.completed));

  if (hasDepartureDate) finalReviewScore += 3;
  if (hasDepartureTime) finalReviewScore += 2;
  if (hasCarrierOrOrigin) finalReviewScore += 3;
  if (hasGateCheck) finalReviewScore += 2;

  finalReviewScore = Math.min(10, finalReviewScore);
  const finalReviewPercentage = Math.round((finalReviewScore / 10) * 100);
  finalReviewComplete = finalReviewScore === 10;

  if (finalReviewScore >= 8) {
    finalReviewDetail = 'Schedule and departure route confirmed';
  } else {
    finalReviewDetail = 'Departure date, flight numbers or schedule needed';
    if (!hasDepartureDate) {
      recommendations.push({
        id: 'review_departure',
        title: 'Set Departure Schedule',
        description: 'Enter departure date and time to enable the travel countdown timer and alerts.',
        actionLabel: 'Set Departure Date',
        targetTab: 'Overview',
        priority: 'HIGH'
      });
    }
  }

  // ==========================================
  // TOTAL CALCULATION
  // ==========================================
  const totalScore = Math.min(
    100,
    Math.max(0, packingScore + baggageScore + travelerScore + documentsScore + finalReviewScore)
  );

  let statusLabel: TravelReadinessScore['statusLabel'] = 'NEEDS ATTENTION';
  let statusColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';

  if (totalScore >= 95) {
    statusLabel = "YOU'RE TRAVEL READY!";
    statusColor = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
  } else if (totalScore >= 80) {
    statusLabel = 'ALMOST READY';
    statusColor = 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800';
  } else if (totalScore >= 50) {
    statusLabel = 'GETTING READY';
    statusColor = 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
  }

  return {
    totalScore,
    statusLabel,
    statusColor,
    categories: {
      packing: {
        score: packingScore,
        max: 30,
        percentage: packingPercentage,
        label: 'Packing Checklist',
        detail: packingDetail,
        complete: packingComplete
      },
      baggage: {
        score: baggageScore,
        max: 30,
        percentage: baggagePercentage,
        label: 'Baggage Compliance',
        detail: baggageDetail,
        complete: baggageComplete
      },
      travellers: {
        score: travelerScore,
        max: 15,
        percentage: travelerPercentage,
        label: 'Traveller Preparation',
        detail: travelerDetail,
        complete: travelerComplete
      },
      documents: {
        score: documentsScore,
        max: 15,
        percentage: documentsPercentage,
        label: 'Travel Documents',
        detail: documentsDetail,
        complete: documentsComplete
      },
      finalReview: {
        score: finalReviewScore,
        max: 10,
        percentage: finalReviewPercentage,
        label: 'Departure & Flight Review',
        detail: finalReviewDetail,
        complete: finalReviewComplete
      }
    },
    recommendedNextActions: recommendations.sort((a, b) => {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return weight[b.priority] - weight[a.priority];
    })
  };
}
