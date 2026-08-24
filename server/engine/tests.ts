/**
 * Automated Verification Suite for Math Integrity, Invariant Compliance,
 * Layer 1 Reproducibility, and Access Control Security.
 */

import { computeFinancialMatrix, reduceToSingleDigit, sumDigits } from './math.js';
import { canAccess } from '../services/auth.js';
import { db } from '../services/db.js';
import { TestSuiteResult, TestResult, Account } from '../../src/types/domain.js';

export function runAutomatedDiagnosticsTestSuite(): TestSuiteResult {
  const tests: TestResult[] = [];
  const suiteStartTime = Date.now();

  // Suite 1: Mathematical Invariant - Single Digit 1-9 Reduction
  {
    const start = Date.now();
    let passed = true;
    let failedCases: number[] = [];

    // Test numbers 1 through 2000
    for (let i = 1; i <= 2000; i++) {
      const { value } = reduceToSingleDigit(i);
      if (value < 1 || value > 9 || !Number.isInteger(value)) {
        passed = false;
        failedCases.push(i);
      }
    }

    tests.push({
      name: 'Strict Range 1-9 Reduction Exhaustive Check (N=1..2000)',
      status: passed ? 'PASSED' : 'FAILED',
      message: passed ? 'All 2,000 integer inputs reduced strictly to single digits (1-9).' : `Failed for inputs: ${failedCases.slice(0, 5).join(', ')}`,
      durationMs: Date.now() - start,
    });
  }

  // Suite 2: Strict Exclusion of 11 and 22 Master Numbers
  {
    const start = Date.now();
    const red11 = reduceToSingleDigit(11);
    const red22 = reduceToSingleDigit(22);
    const passed = red11.value === 2 && red22.value === 4;

    tests.push({
      name: 'Strict Exclusion of 11 & 22 (11->2, 22->4)',
      status: passed ? 'PASSED' : 'FAILED',
      message: passed
        ? 'Confirmed: 11 reduces to 2, 22 reduces to 4. No esoteric master number retention.'
        : `Failed: 11->${red11.value}, 22->${red22.value}`,
      durationMs: Date.now() - start,
      details: { red11, red22 },
    });
  }

  // Suite 3: Deterministic Financial Matrix Vector Reproducibility
  {
    const start = Date.now();
    const input = {
      userBirthDate: '14.07.1990',
      motherBirthDate: '23.04.1965',
      fatherBirthDate: '11.11.1962',
    };

    const run1 = computeFinancialMatrix(input);
    const run2 = computeFinancialMatrix(input);

    const v1Match = run1.vectors.v1_life_scenario.value === run2.vectors.v1_life_scenario.value;
    const v2Match = run1.vectors.v2_work_model.value === run2.vectors.v2_work_model.value;
    const v3Match = run1.vectors.v3_emotional_background.value === run2.vectors.v3_emotional_background.value;
    const v4Match = run1.vectors.v4_resource_management.value === run2.vectors.v4_resource_management.value;
    const hashMatch = run1.mathematicalIntegrity.reproducibilityHash === run2.mathematicalIntegrity.reproducibilityHash;

    const allPassed = v1Match && v2Match && v3Match && v4Match && hashMatch && run1.mathematicalIntegrity.allSingleDigits1to9;

    tests.push({
      name: 'Layer 1 Idempotency & Mathematical Reproducibility',
      status: allPassed ? 'PASSED' : 'FAILED',
      message: allPassed
        ? `100% Identical Output: V1=${run1.vectors.v1_life_scenario.value}, V2=${run1.vectors.v2_work_model.value}, V3=${run1.vectors.v3_emotional_background.value}, V4=${run1.vectors.v4_resource_management.value}`
        : 'Determinism mismatch detected between consecutive runs.',
      durationMs: Date.now() - start,
      details: { reproducibilityHash: run1.mathematicalIntegrity.reproducibilityHash },
    });
  }

  // Suite 4: Vector Formula Verification
  {
    const start = Date.now();
    const testMatrix = computeFinancialMatrix({
      userBirthDate: '01.01.2000',
      motherBirthDate: '02.02.1980',
      fatherBirthDate: '03.03.1975',
    });

    const isV1Correct = testMatrix.vectors.v1_life_scenario.value === 4;
    const isV2Correct = testMatrix.vectors.v2_work_model.value === 9;
    const isV3Correct = testMatrix.vectors.v3_emotional_background.value === 7;
    const isV4Correct = testMatrix.vectors.v4_resource_management.value === 6;
    const passed = isV1Correct && isV2Correct && isV3Correct && isV4Correct;

    tests.push({
      name: 'Exact Hand-Calculated Vector Reference Validation (V1=4, V2=9, V3=7, V4=6)',
      status: passed ? 'PASSED' : 'FAILED',
      message: passed
        ? 'Vector formula arithmetic validated against exact analytical reference values.'
        : `Mismatch: V1=${testMatrix.vectors.v1_life_scenario.value} (exp 4), V2=${testMatrix.vectors.v2_work_model.value} (exp 9), V3=${testMatrix.vectors.v3_emotional_background.value} (exp 7), V4=${testMatrix.vectors.v4_resource_management.value} (exp 6)`,
      durationMs: Date.now() - start,
    });
  }

  // Suite 5: Security & RBAC `canAccess` Matrix
  {
    const start = Date.now();
    const adminAcc: Account = db.accounts.get('acc_desadmin') || {
      id: 'acc_test_admin',
      role: 'ADMIN' as const,
      email: 'desadmin',
      name: 'desadmin',
      token: 'tok_test',
      referralCode: 'DESADMIN',
      subscriptionTier: 'ENTERPRISE' as const,
      createdAt: new Date().toISOString(),
      settings: { theme: 'dark', locale: 'ru', notificationsEnabled: true },
    };
    const userAcc: Account = {
      id: 'acc_test_user_sim',
      role: 'USER' as const,
      email: 'user@test.io',
      name: 'Test User',
      token: 'tok_user_sim',
      referralCode: 'TEST123',
      subscriptionTier: 'FREE_TRIAL' as const,
      createdAt: new Date().toISOString(),
      settings: { theme: 'dark', locale: 'ru', notificationsEnabled: true },
    };
    db.subscriptions.set(userAcc.id, {
      id: 'sub_test_user_sim',
      accountId: userAcc.id,
      tier: 'FREE_TRIAL',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      maxProfiles: 5,
      features: ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE'],
      referralCreditsApplied: 0,
    });

    const adminCanConsole = canAccess(adminAcc, 'ADMIN_CONSOLE').allowed;
    const userCannotConsole = !canAccess(userAcc, 'ADMIN_CONSOLE').allowed;
    const userCanMatrix = canAccess(userAcc, 'RUN_FINANCIAL_MATRIX').allowed;

    const passed = adminCanConsole && userCannotConsole && userCanMatrix;

    tests.push({
      name: 'RBAC Privilege Segregation & Feature Gate Enforcement',
      status: passed ? 'PASSED' : 'FAILED',
      message: passed
        ? 'Admin and User permission boundaries strictly enforced by canAccess() engine.'
        : 'Permission boundary failure detected.',
      durationMs: Date.now() - start,
    });
  }

  // Suite 6: Referral Rule Verification (5 Conversions = 1 Free Month)
  {
    const start = Date.now();
    const testAccountId = 'acc_test_referral_' + Date.now();
    db.subscriptions.set(testAccountId, {
      id: 'sub_test_ref',
      accountId: testAccountId,
      tier: 'PRO_MONTHLY',
      status: 'active',
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-02-01T00:00:00.000Z',
      maxProfiles: 10,
      features: ['RUN_FINANCIAL_MATRIX'],
      referralCreditsApplied: 0,
    });

    // Add 5 converted referrals
    for (let i = 1; i <= 5; i++) {
      db.referrals.set(`ref_test_${testAccountId}_${i}`, {
        id: `ref_test_${testAccountId}_${i}`,
        referrerAccountId: testAccountId,
        refereeAccountId: `referee_${i}`,
        refereeEmail: `referee_${i}@test.com`,
        status: 'CONVERTED',
        createdAt: new Date().toISOString(),
      });
    }

    const { rewardGranted, monthsAdded } = db.checkAndApplyReferralRewards(testAccountId);
    const subAfter = db.subscriptions.get(testAccountId)!;
    const isExtended = new Date(subAfter.endDate).getMonth() === 2; // March 2026

    const passed = rewardGranted && monthsAdded === 1 && isExtended;

    // Cleanup test record
    db.subscriptions.delete(testAccountId);

    tests.push({
      name: 'Automated 5-Conversion Threshold -> 1 Free Month Extension',
      status: passed ? 'PASSED' : 'FAILED',
      message: passed
        ? 'Automated referral reward trigger verified: exactly 1 month added after 5 conversions.'
        : 'Referral reward trigger failed to extend subscription by 1 month.',
      durationMs: Date.now() - start,
    });
  }

  const passedCount = tests.filter((r) => r.status === 'PASSED').length;
  const totalDuration = Date.now() - suiteStartTime;

  return {
    timestamp: new Date().toISOString(),
    summary: {
      total: tests.length,
      passed: passedCount,
      failed: tests.length - passedCount,
      durationMs: totalDuration,
    },
    tests,
  };
}
