/**
 * Client API Client for Diagnostic Service
 */

import {
  Account,
  PersonProfile,
  FinancialMatrixLayer1Output,
  DiagnosticAnalysisRecord,
  Subscription,
  ReferralStats,
  DiagnosticModuleMeta,
  LogEntry,
  AdminAuditLog,
  FormFieldConfig,
  ContentSectionConfig,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '../types/domain.js';
import {
  SocionicsScreen,
  EnergyScreen,
  EnergyDiagnosticsResult,
  SocionicsTestResult,
  FullIntegrativeAnalysisRecord,
  EnergyEvaluationRecord,
  OptionKey,
} from '../types/socionics.js';

const AUTH_STORAGE_KEY = 'diag_auth_token';

let currentAuthToken: string = (() => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) || '';
  } catch {
    return '';
  }
})();

export function setClientAuthToken(token: string) {
  currentAuthToken = token;
  try {
    if (token) {
      localStorage.setItem(AUTH_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to persist auth token:', e);
  }
}

export function getClientAuthToken(): string {
  return currentAuthToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (currentAuthToken) {
    headers.set('Authorization', `Bearer ${currentAuthToken}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error) errorMsg = errorJson.error;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export const api = {
  setToken: setClientAuthToken,
  getToken: getClientAuthToken,

  // Auth
  async getMe(): Promise<{ account: Account; token?: string; subscription?: Subscription; permissions: Record<string, boolean> }> {
    return request('/api/auth/me');
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setClientAuthToken(res.token);
    }
    return res;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setClientAuthToken(res.token);
    }
    return res;
  },

  async googleLogin(data: { email: string; name?: string; avatarUrl?: string }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setClientAuthToken(res.token);
    }
    return res;
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await request<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setClientAuthToken('');
    return { success: true };
  },

  async updateSettings(settings: { theme?: string; locale?: string; notificationsEnabled?: boolean; name?: string }): Promise<{ account: Account }> {
    return request('/api/auth/update-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async switchAccount(targetRole: 'USER' | 'ADMIN'): Promise<{ account: Account }> {
    const res = await request<{ account: Account }>('/api/auth/switch-account', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
    setClientAuthToken(res.account.token);
    return res;
  },

  // Public Configuration
  async getFormConfig(): Promise<{ fields: FormFieldConfig[]; content: ContentSectionConfig }> {
    return request('/api/config/fields');
  },

  // Profiles
  async getProfiles(): Promise<{ profiles: PersonProfile[] }> {
    return request('/api/profiles');
  },

  async createProfile(data: Partial<PersonProfile>): Promise<{ profile: PersonProfile }> {
    return request('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProfile(id: string, data: Partial<PersonProfile>): Promise<{ profile: PersonProfile }> {
    return request(`/api/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProfile(id: string): Promise<{ success: boolean }> {
    return request(`/api/profiles/${id}`, {
      method: 'DELETE',
    });
  },

  // Modules & Calculations
  async getModules(): Promise<{ modules: DiagnosticModuleMeta[] }> {
    return request('/api/diagnostics/modules');
  },

  async calculateFinancialMatrix(input: {
    userBirthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
  }): Promise<{ layer1: FinancialMatrixLayer1Output }> {
    return request('/api/diagnostics/financial-matrix/calculate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async runFinancialMatrixAnalysis(input: {
    profileId?: string;
    firstName?: string;
    lastName?: string;
    userBirthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
    occupation?: string;
    financialGoals?: string;
    notes?: string;
    lang?: string;
  }): Promise<{ analysis: DiagnosticAnalysisRecord }> {
    return request('/api/diagnostics/financial-matrix/analyze', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Socionics, Energy Gatekeeper & Integrative AI
  async getSocionicsScreens(): Promise<{ screens: SocionicsScreen[] }> {
    return request('/api/diagnostics/socionics/screens');
  },

  async getEnergyScreens(): Promise<{ screens: EnergyScreen[] }> {
    return request('/api/diagnostics/energy/screens');
  },

  async evaluateEnergy(input: {
    answers: Record<number, OptionKey>;
    profileId?: string;
    profileName?: string;
  }): Promise<{ result: EnergyEvaluationRecord }> {
    return request('/api/diagnostics/energy/evaluate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getEnergyHistory(): Promise<{ history: EnergyEvaluationRecord[] }> {
    return request('/api/diagnostics/energy/history');
  },

  async getEnergyResult(id: string): Promise<{ result: EnergyEvaluationRecord }> {
    return request(`/api/diagnostics/energy/results/${id}`);
  },

  async deleteEnergyResult(id: string): Promise<{ success: boolean }> {
    return request(`/api/diagnostics/energy/results/${id}`, {
      method: 'DELETE',
    });
  },

  async evaluateSocionics(input: {
    answers: Record<number, OptionKey>;
    energyAnswers?: Record<number, OptionKey>;
    profileId?: string;
    profileName?: string;
  }): Promise<{ result: SocionicsTestResult }> {
    return request('/api/diagnostics/socionics/evaluate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getSocionicsHistory(): Promise<{ history: SocionicsTestResult[] }> {
    return request('/api/diagnostics/socionics/history');
  },

  async getSocionicsResult(id: string): Promise<{ result: SocionicsTestResult }> {
    return request(`/api/diagnostics/socionics/results/${id}`);
  },

  async deleteSocionicsResult(id: string): Promise<{ success: boolean }> {
    return request(`/api/diagnostics/socionics/results/${id}`, {
      method: 'DELETE',
    });
  },

  async runIntegrativeAnalysis(input: {
    profileId?: string;
    subjectName?: string;
    birthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
    socionicsResultId?: string;
    socionicsAnswers?: Record<number, OptionKey>;
    energyAnswers?: Record<number, OptionKey>;
    lang?: string;
  }): Promise<{ record: FullIntegrativeAnalysisRecord }> {
    return request('/api/diagnostics/integrative/analyze', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getIntegrativeHistory(): Promise<{ history: FullIntegrativeAnalysisRecord[] }> {
    return request('/api/diagnostics/integrative/history');
  },

  async getIntegrativeRecord(id: string): Promise<{ record: FullIntegrativeAnalysisRecord }> {
    return request(`/api/diagnostics/integrative/${id}`);
  },

  async deleteIntegrativeResult(id: string): Promise<{ success: boolean }> {
    return request(`/api/diagnostics/integrative/${id}`, {
      method: 'DELETE',
    });
  },

  // History
  async getHistory(): Promise<{ history: DiagnosticAnalysisRecord[] }> {
    return request('/api/diagnostics/history');
  },

  async getHistoryItem(id: string): Promise<{ analysis: DiagnosticAnalysisRecord }> {
    return request(`/api/diagnostics/history/${id}`);
  },

  async deleteHistoryItem(id: string): Promise<{ success: boolean }> {
    return request(`/api/diagnostics/history/${id}`, {
      method: 'DELETE',
    });
  },

  // Subscriptions & Referrals
  async getCurrentSubscription(): Promise<{ subscription: Subscription }> {
    return request('/api/subscriptions/current');
  },

  async upgradeSubscription(tier: 'PRO_MONTHLY' | 'ENTERPRISE'): Promise<{ subscription: Subscription }> {
    return request('/api/subscriptions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  },

  async getReferralStats(): Promise<{ stats: ReferralStats }> {
    return request('/api/referrals/stats');
  },

  async simulateReferralConversion(email?: string): Promise<{ referral: any; rewardResult: any }> {
    return request('/api/referrals/simulate-conversion', {
      method: 'POST',
      body: JSON.stringify({ refereeEmail: email }),
    });
  },

  // Admin
  async getAdminMetrics(): Promise<{ metrics: any }> {
    return request('/api/admin/metrics');
  },

  async getAdminAccounts(): Promise<{ accounts: any[] }> {
    return request('/api/admin/accounts');
  },

  async getAdminAccountDetails(id: string): Promise<{
    account: Account;
    subscription?: Subscription;
    profiles: PersonProfile[];
    analyses: DiagnosticAnalysisRecord[];
    referrals: any[];
  }> {
    return request(`/api/admin/accounts/${id}/details`);
  },

  async updateAdminAccount(id: string, data: Partial<Account & { subscriptionTier?: string; endDate?: string }>): Promise<{ account: Account; subscription?: Subscription }> {
    return request(`/api/admin/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateAdminUserRole(id: string, role: 'USER' | 'ADMIN'): Promise<{ success: boolean; account: Account; subscription?: Subscription }> {
    return request(`/api/admin/accounts/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async deleteAdminAccount(id: string): Promise<{ success: boolean }> {
    return request(`/api/admin/accounts/${id}`, {
      method: 'DELETE',
    });
  },

  async getAdminModules(): Promise<{ modules: DiagnosticModuleMeta[] }> {
    return request('/api/admin/modules');
  },

  async updateAdminModule(id: string, data: Partial<DiagnosticModuleMeta>): Promise<{ module: DiagnosticModuleMeta }> {
    return request(`/api/admin/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async createAdminModule(data: Partial<DiagnosticModuleMeta>): Promise<{ module: DiagnosticModuleMeta }> {
    return request('/api/admin/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminField(key: string, data: Partial<FormFieldConfig>): Promise<{ field: FormFieldConfig }> {
    return request(`/api/admin/fields/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getAdminContentConfig(): Promise<{ content: ContentSectionConfig; fields: FormFieldConfig[] }> {
    return request('/api/admin/content-config');
  },

  async updateAdminContentConfig(data: Partial<ContentSectionConfig>): Promise<{ content: ContentSectionConfig }> {
    return request('/api/admin/content-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getAdminLogs(filter?: { category?: string; level?: string; search?: string }): Promise<{ logs: LogEntry[] }> {
    const params = new URLSearchParams();
    if (filter?.category) params.set('category', filter.category);
    if (filter?.level) params.set('level', filter.level);
    if (filter?.search) params.set('search', filter.search);
    return request(`/api/admin/logs?${params.toString()}`);
  },

  async getAdminAuditLogs(): Promise<{ auditLogs: AdminAuditLog[] }> {
    return request('/api/admin/audit');
  },

  // Tests
  async runTests(): Promise<{ suite: any }> {
    return request('/api/tests/run', {
      method: 'POST',
    });
  },
};
