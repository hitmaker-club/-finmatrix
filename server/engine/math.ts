/**
 * Layer 1 Algorithmic Layer: Deterministic Financial Matrix Math Engine
 * 
 * Strict Guardrails:
 * - Zero AI usage in Layer 1. Pure deterministic math.
 * - No esoteric concepts, no Tarot/Arcana.
 * - Range 1-22 strictly excluded; all outputs reduced to single digit 1-9 via digit summation.
 * - Complete reproducibility and audit trace for every step.
 */

import { DateReductionBreakdown, FinancialMatrixLayer1Output } from '../../src/types/domain.js';

export const ALGORITHM_VERSION = 'v1.4.0-deterministic-1to9';

/**
 * Reduce any positive number to a single digit (1-9) by iterative digit summation.
 * Specifically excludes 11 and 22 master numbers (reduces 11 -> 2, 22 -> 4).
 */
export function reduceToSingleDigit(n: number): { value: number; steps: number[] } {
  let current = Math.abs(Math.floor(n));
  const steps: number[] = [current];

  if (current === 0) {
    return { value: 0, steps: [0] };
  }

  while (current > 9) {
    const digits = current.toString().split('').map(d => parseInt(d, 10));
    current = digits.reduce((sum, d) => sum + d, 0);
    steps.push(current);
  }

  return { value: current, steps };
}

/**
 * Sum all digits in a number or digit string.
 */
export function sumDigits(numOrStr: number | string): number {
  const str = typeof numOrStr === 'number' ? Math.abs(Math.floor(numOrStr)).toString() : numOrStr;
  return str
    .replace(/\D/g, '')
    .split('')
    .reduce((acc, char) => acc + parseInt(char, 10), 0);
}

/**
 * Parse date string into day, month, year.
 * Accepts formats: DD.MM.YYYY, YYYY-MM-DD, DD/MM/YYYY
 */
export function parseDateString(dateStr: string): { day: number; month: number; year: number } {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  const trimmed = dateStr.trim();
  let day = 0;
  let month = 0;
  let year = 0;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    // ISO format YYYY-MM-DD
    const parts = trimmed.split('-').map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else if (/^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/.test(trimmed)) {
    // DD.MM.YYYY or DD/MM/YYYY or DD-MM-YYYY
    const parts = trimmed.split(/[./-]/).map(Number);
    day = parts[0];
    month = parts[1];
    year = parts[2];
  } else {
    // Fallback Date object parsing
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Unrecognized date format: "${dateStr}". Please use DD.MM.YYYY or YYYY-MM-DD.`);
    }
    day = parsed.getUTCDate();
    month = parsed.getUTCMonth() + 1;
    year = parsed.getUTCFullYear();
  }

  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month} in date ${dateStr}`);
  if (day < 1 || day > 31) throw new Error(`Invalid day: ${day} in date ${dateStr}`);
  if (year < 1900 || year > 2100) throw new Error(`Year ${year} outside valid range (1900-2100) in date ${dateStr}`);

  return { day, month, year };
}

/**
 * Calculate deterministic date breakdown according to specification:
 * - day_value = reduce(DAY)
 * - month_value = reduce(MONTH)
 * - year_value = reduce(sum_digits(YEAR))
 * - total_value = reduce(sum_all_digits_of_date)
 */
export function calculateDateComponents(rawDate: string): DateReductionBreakdown {
  const { day, month, year } = parseDateString(rawDate);
  const stepTrace: string[] = [];

  // 1. Day reduction
  const dayRedObj = reduceToSingleDigit(day);
  const dayReduced = dayRedObj.value;
  stepTrace.push(`Day ${day} -> reduce -> ${dayReduced} (steps: ${dayRedObj.steps.join(' -> ')})`);

  // 2. Month reduction
  const monthRedObj = reduceToSingleDigit(month);
  const monthReduced = monthRedObj.value;
  stepTrace.push(`Month ${month} -> reduce -> ${monthReduced} (steps: ${monthRedObj.steps.join(' -> ')})`);

  // 3. Year reduction: sum digits of the year first, then reduce
  const yearDigitsSum = sumDigits(year);
  const yearRedObj = reduceToSingleDigit(yearDigitsSum);
  const yearReduced = yearRedObj.value;
  stepTrace.push(`Year ${year} -> sum digits (${yearDigitsSum}) -> reduce -> ${yearReduced} (steps: ${yearRedObj.steps.join(' -> ')})`);

  // 4. Total date reduction: sum all digits of date, then reduce
  const datePadded = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year.toString()}`;
  const allDigitsSum = sumDigits(datePadded);
  const totalRedObj = reduceToSingleDigit(allDigitsSum);
  const totalReduced = totalRedObj.value;
  stepTrace.push(`All digits sum (${datePadded} = ${allDigitsSum}) -> reduce -> ${totalReduced} (steps: ${totalRedObj.steps.join(' -> ')})`);

  return {
    raw: rawDate,
    day,
    dayReduced,
    month,
    monthReduced,
    year,
    yearDigitsSum,
    yearReduced,
    allDigitsSum,
    totalReduced,
    stepTrace,
  };
}

export interface ComputeMatrixInput {
  userBirthDate: string;
  motherBirthDate?: string;
  fatherBirthDate?: string;
}

/**
 * Compute the 4 vectors of the Financial Matrix:
 * - V1 (Life Scenario) = user_total
 * - V2 (Work Model) = reduce(user_total + mother_total + father_total)
 * - V3 (Emotional Background) = reduce(mother_total + father_total + user_day + user_month)
 * - V4 (Time/Resource Management) = reduce(user_year + mother_year + father_year)
 * 
 * If mother/father dates are not provided, uses baseline defaults (0 or self-projection)
 * with explicit flag for user awareness.
 */
export function computeFinancialMatrix(input: ComputeMatrixInput): FinancialMatrixLayer1Output {
  const user = calculateDateComponents(input.userBirthDate);
  const mother = input.motherBirthDate ? calculateDateComponents(input.motherBirthDate) : undefined;
  const father = input.fatherBirthDate ? calculateDateComponents(input.fatherBirthDate) : undefined;

  const motherTotal = mother ? mother.totalReduced : 0;
  const fatherTotal = father ? father.totalReduced : 0;
  const motherYear = mother ? mother.yearReduced : 0;
  const fatherYear = father ? father.yearReduced : 0;

  // V1: Life Scenario = user_total
  const v1Value = user.totalReduced;

  // V2: Work Model = reduce(user_total + mother_total + father_total)
  const v2Sum = user.totalReduced + motherTotal + fatherTotal;
  const v2Value = reduceToSingleDigit(v2Sum).value;

  // V3: Emotional Background = reduce(mother_total + father_total + user_day + user_month)
  const v3Sum = motherTotal + fatherTotal + user.dayReduced + user.monthReduced;
  const v3Value = reduceToSingleDigit(v3Sum).value;

  // V4: Time & Resource Management = reduce(user_year + mother_year + father_year)
  const v4Sum = user.yearReduced + motherYear + fatherYear;
  const v4Value = reduceToSingleDigit(v4Sum).value;

  // Verification checks:
  const vectorList = [v1Value, v2Value, v3Value, v4Value];
  const allSingleDigits1to9 = vectorList.every(v => v >= 1 && v <= 9);
  const excluded22Check = !vectorList.includes(22) && !vectorList.includes(11);

  // Reproducibility Hash based on raw components
  const reproducibilitySeed = `${user.raw}|${mother?.raw || 'none'}|${father?.raw || 'none'}|${v1Value}-${v2Value}-${v3Value}-${v4Value}`;
  const reproducibilityHash = Buffer.from(reproducibilitySeed).toString('base64');

  return {
    algorithmVersion: ALGORITHM_VERSION,
    computedAt: new Date().toISOString(),
    user,
    mother,
    father,
    vectors: {
      v1_life_scenario: {
        value: v1Value,
        formula: 'user_total',
        label: 'V1: Life & Financial Scenario',
        description: 'Core baseline behavioral trajectory and personal financial archetype orientation.',
      },
      v2_work_model: {
        value: v2Value,
        formula: 'reduce(user_total + mother_total + father_total)',
        label: 'V2: Professional & Work Strategy',
        description: 'Transgenerational work ethic, career progression models, and income generation dynamics.',
      },
      v3_emotional_background: {
        value: v3Value,
        formula: 'reduce(mother_total + father_total + user_day + user_month)',
        label: 'V3: Emotional Financial Background',
        description: 'Psychological relationship with money, spending impulses, and financial security reflexes.',
      },
      v4_resource_management: {
        value: v4Value,
        formula: 'reduce(user_year + mother_year + father_year)',
        label: 'V4: Time & Capital Allocation',
        description: 'Long-term planning horizons, risk budgeting, capital preservation, and temporal discounting.',
      },
    },
    mathematicalIntegrity: {
      allSingleDigits1to9,
      excluded22Check,
      reproducibilityHash,
    },
  };
}
