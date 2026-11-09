/**
 * Attendance & Bunk Mathematics Utility
 * Exact integer calculations for college attendance policies.
 */

/**
 * Calculates attendance percentage rounded to one decimal place.
 * Returns 100.0 if total is 0.
 */
export function calculatePercentage(attended, total) {
  if (!total || total <= 0) return 100.0;
  if (!attended || attended < 0) return 0.0;
  const pct = (attended / total) * 100;
  return Number(Math.min(100, Math.max(0, pct)).toFixed(1));
}

/**
 * Calculates maximum additional absences allowed without falling below the minimum threshold.
 * 
 * Formula:
 * Let A = attended, T = total conducted, P = minimum threshold percentage.
 * Condition: A / (T + x) >= P / 100
 * => T + x <= (A * 100) / P
 * => x <= (A * 100) / P - T
 * Largest non-negative integer x:
 * x = floor((A * 100) / P - T)
 * 
 * If current attendance is below threshold, returns 0.
 */
export function calculateSafeBunks(attended, total, threshold = 75) {
  if (!total || total <= 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct < threshold) return 0;

  // Exact integer math
  const maxAbsences = Math.floor((attended * 100) / threshold - total);
  return Math.max(0, maxAbsences);
}

/**
 * Calculates the number of consecutive lectures a student must attend to reach or exceed
 * the minimum required threshold when currently below it.
 * 
 * Formula:
 * Let y = additional consecutive lectures attended.
 * (A + y) / (T + y) >= P / 100
 * 100A + 100y >= PT + Py
 * (100 - P)y >= PT - 100A
 * y >= (PT - 100A) / (100 - P)
 * Smallest non-negative integer y:
 * y = ceil((P * T - 100 * A) / (100 - P))
 */
export function calculateClassesToAttend(attended, total, threshold = 75) {
  if (!total || total <= 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct >= threshold) return 0;

  const numerator = threshold * total - 100 * attended;
  const denominator = 100 - threshold;
  
  if (denominator <= 0) return 0; // Prevent division by zero if threshold is 100
  
  const required = Math.ceil(numerator / denominator);
  return Math.max(0, required);
}

/**
 * Categorizes attendance status based on percentage and threshold.
 */
export function getStatusCategory(percentage, threshold = 75) {
  if (percentage >= 90) return 'excellent';
  if (percentage >= threshold) return 'safe';
  if (percentage >= threshold - 10) return 'warning';
  return 'critical';
}

/**
 * Status presentation attributes for badges, pills, and indicators.
 */
export const STATUS_CONFIG = {
  excellent: {
    label: 'Excellent',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    progressColor: 'bg-emerald-500',
    shadowColor: 'shadow-emerald-100',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  safe: {
    label: 'Safe',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    progressColor: 'bg-blue-500',
    shadowColor: 'shadow-blue-100',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  warning: {
    label: 'Warning',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    progressColor: 'bg-amber-500',
    shadowColor: 'shadow-amber-100',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  critical: {
    label: 'Critical',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-500',
    progressColor: 'bg-rose-500',
    shadowColor: 'shadow-rose-100',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

/**
 * Simulates attending or missing the next lecture.
 */
export function simulateNextLecture(attended, total, action, threshold = 75) {
  const currentPct = calculatePercentage(attended, total);
  let newAttended = attended;
  let newTotal = total + 1;

  if (action === 'attend') {
    newAttended = attended + 1;
  } else if (action === 'skip') {
    newAttended = attended;
  }

  const newPct = calculatePercentage(newAttended, newTotal);
  const diff = Number((newPct - currentPct).toFixed(1));
  const newSafeBunks = calculateSafeBunks(newAttended, newTotal, threshold);
  const newNeedToAttend = calculateClassesToAttend(newAttended, newTotal, threshold);
  const willDropBelow = currentPct >= threshold && newPct < threshold;
  const isSafeAfter = newPct >= threshold;

  return {
    newAttended,
    newTotal,
    currentPct,
    newPct,
    diff,
    newSafeBunks,
    newNeedToAttend,
    willDropBelow,
    isSafeAfter,
    action,
  };
}

/**
 * Aggregates overall attendance statistics across all subjects.
 */
export function calculateOverallStats(subjects = [], threshold = 75) {
  if (!subjects.length) {
    return {
      totalAttended: 0,
      totalConducted: 0,
      totalMissed: 0,
      overallPercentage: 100.0,
      safeBunks: 0,
      classesToAttend: 0,
      status: 'excellent',
      subjectsBelowThreshold: [],
      subjectsAtRisk: [],
      excellentCount: 0,
      safeCount: 0,
      warningCount: 0,
      criticalCount: 0,
    };
  }

  let totalAttended = 0;
  let totalConducted = 0;
  let safeBunks = 0;
  let classesToAttend = 0;
  const subjectsBelowThreshold = [];
  const subjectsAtRisk = [];

  let excellentCount = 0;
  let safeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  subjects.forEach(subject => {
    const subAttended = Number(subject.attended || 0);
    const subTotal = Number(subject.total || 0);
    const subThreshold = Number(subject.threshold || threshold);
    
    totalAttended += subAttended;
    totalConducted += subTotal;

    const pct = calculatePercentage(subAttended, subTotal);
    const bunks = calculateSafeBunks(subAttended, subTotal, subThreshold);
    const recover = calculateClassesToAttend(subAttended, subTotal, subThreshold);
    safeBunks += bunks;
    classesToAttend += recover;

    const category = getStatusCategory(pct, subThreshold);
    if (category === 'excellent') excellentCount++;
    else if (category === 'safe') safeCount++;
    else if (category === 'warning') warningCount++;
    else if (category === 'critical') criticalCount++;

    if (pct < subThreshold) {
      subjectsBelowThreshold.push({
        ...subject,
        percentage: pct,
        requiredToRecover: recover,
        shortfall: Number((subThreshold - pct).toFixed(1)),
      });
    }

    if (bunks <= 1 && pct >= subThreshold) {
      subjectsAtRisk.push({
        ...subject,
        percentage: pct,
        safeBunks: bunks,
      });
    }
  });

  const totalMissed = totalConducted - totalAttended;
  const overallPercentage = calculatePercentage(totalAttended, totalConducted);
  const status = getStatusCategory(overallPercentage, threshold);

  return {
    totalAttended,
    totalConducted,
    totalMissed,
    overallPercentage,
    safeBunks,
    classesToAttend,
    status,
    subjectsBelowThreshold,
    subjectsAtRisk,
    excellentCount,
    safeCount,
    warningCount,
    criticalCount,
  };
}

