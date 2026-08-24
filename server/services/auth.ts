/**
 * Authentication, Authorization, RBAC & Row-Level Access Control (RLAC) Service
 */

import { Account, FeaturePermission, PersonProfile } from '../../src/types/domain.js';
import { db } from './db.js';
import { logger } from './logger.js';

export function getAccountFromToken(authHeader?: string): Account | null {
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  for (const account of db.accounts.values()) {
    if (account.token === token) {
      return account;
    }
  }
  return null;
}

/**
 * Unified access control evaluator:
 * Evaluates subscriptions, trial windows, role privileges, and reward entitlements.
 */
export function canAccess(account: Account, feature: FeaturePermission): { allowed: boolean; reason?: string } {
  // Admin role bypass for operational oversight
  if (account.role === 'ADMIN') {
    return { allowed: true };
  }

  // Check admin console permissions
  if (feature === 'ADMIN_CONSOLE' || feature === 'VIEW_AUDIT_LOGS') {
    return { allowed: false, reason: 'Administrator privilege required.' };
  }

  const sub = db.subscriptions.get(account.id);
  if (!sub) {
    return { allowed: false, reason: 'No active subscription or trial found.' };
  }

  // Check expiration
  const now = new Date();
  const endDate = new Date(sub.endDate);
  if (now > endDate && sub.status !== 'active') {
    return { allowed: false, reason: 'Trial or subscription period expired. Please renew.' };
  }

  // Feature specific checks
  if (sub.features.includes(feature)) {
    return { allowed: true };
  }

  if (feature === 'UNLIMITED_PROFILES' && sub.tier === 'ENTERPRISE') {
    return { allowed: true };
  }

  if (feature === 'CREATE_PROFILE') {
    const existingProfiles = Array.from(db.profiles.values()).filter(p => p.accountId === account.id);
    if (existingProfiles.length >= sub.maxProfiles) {
      return {
        allowed: false,
        reason: `Profile limit reached (${existingProfiles.length}/${sub.maxProfiles}). Upgrade plan for additional slots.`,
      };
    }
    return { allowed: true };
  }

  return { allowed: false, reason: `Feature ${feature} is not available in your current tier (${sub.tier}).` };
}

/**
 * Row-Level Access Control (RLAC) check for Person Profiles
 */
export function verifyProfileAccess(account: Account, profileId: string): PersonProfile {
  const profile = db.profiles.get(profileId);
  if (!profile) {
    throw new Error(`Profile ${profileId} not found.`);
  }

  // Ensure user owns the profile or is ADMIN
  if (profile.accountId !== account.id && account.role !== 'ADMIN') {
    logger.warn('Security', `Unauthorized access attempt on profile ${profileId} by account ${account.id}`);
    throw new Error('Access denied: You do not have permission to view or modify this profile.');
  }

  return profile;
}
