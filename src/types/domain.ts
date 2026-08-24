/**
 * Diagnostic Service Domain Entities & Interfaces
 * Fully normalized domain model for PWA Diagnostic Platform.
 */

export type UserRole = 'USER' | 'ADMIN' | 'ANALYST';

export type RelationshipType = 
  | 'self'
  | 'partner'
  | 'child'
  | 'parent'
  | 'relative'
  | 'business_partner'
  | 'other';

export interface Account {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
  referralCode: string;
  referredBy?: string;
  subscriptionTier: 'FREE_TRIAL' | 'PRO_MONTHLY' | 'ENTERPRISE';
  createdAt: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    locale: string;
    notificationsEnabled: boolean;
  };
}

export interface PersonProfile {
  id: string;
  accountId: string;
  relationType: RelationshipType;
  firstName: string;
  lastName: string;
  birthDate: string; // Format: YYYY-MM-DD or DD.MM.YYYY
  motherBirthDate?: string;
  fatherBirthDate?: string;
  occupation?: string;
  monthlyIncomeBracket?: string;
  financialGoals?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DiagnosticModuleType = 'financial_matrix' | 'socionics' | 'emotional_tone';

export interface DiagnosticModuleMeta {
  id: DiagnosticModuleType;
  title: string;
  status: 'ACTIVE' | 'PLANNED';
  version: string;
  description: string;
  theoreticalFrameworks: string[];
  specificationStatus?: string;
}

export interface DateReductionBreakdown {
  raw: string;
  day: number;
  dayReduced: number;
  month: number;
  monthReduced: number;
  year: number;
  yearDigitsSum: number;
  yearReduced: number;
  allDigitsSum: number;
  totalReduced: number;
  stepTrace: string[];
}

export interface FinancialMatrixLayer1Output {
  algorithmVersion: string;
  computedAt: string;
  user: DateReductionBreakdown;
  mother?: DateReductionBreakdown;
  father?: DateReductionBreakdown;
  vectors: {
    v1_life_scenario: {
      value: number; // 1-9
      formula: string;
      label: string;
      description: string;
    };
    v2_work_model: {
      value: number; // 1-9
      formula: string;
      label: string;
      description: string;
    };
    v3_emotional_background: {
      value: number; // 1-9
      formula: string;
      label: string;
      description: string;
    };
    v4_resource_management: {
      value: number; // 1-9
      formula: string;
      label: string;
      description: string;
    };
  };
  mathematicalIntegrity: {
    allSingleDigits1to9: boolean;
    excluded22Check: boolean;
    reproducibilityHash: string;
  };
}

export interface Layer2SystemicDynamics {
  intergenerationalPatterns: string;
  familyResourceFlowFeedback: string;
  systemEquilibriumHypothesis: string;
}

export interface Layer2BehavioralEconomics {
  mentalAccountingTendency: string;
  lossAversionSensitivity: string;
  temporalDiscountingProfile: string;
  cognitiveBiasesIdentified: string[];
}

export interface Layer2AnalyticalPsychology {
  primaryArchetype: string;
  shadowFinancialPattern: string;
  individuationChallenges: string;
}

export interface Layer2ActionableStrategy {
  tacticalAdjustments: string[];
  riskMitigationProtocols: string[];
  resourceAllocationRule: string;
  decisionMakingChecklist: string[];
}

export interface StrengthItem {
  name: string;
  structuralBasis: string;
  behavior: string;
  financialEffect: string;
}

export interface LimitationItem {
  name: string;
  mechanismOfShadow: string;
  financialRisk: string;
}

export interface MoneyManifestationItem {
  domain: string;
  description: string;
}

export interface MainLever {
  coreAdjustment: string;
  actionableDirections: string[];
}

export interface QuickSummary {
  strongestPotential: string;
  bottleneck: string;
  growthDirection: string;
}

export interface FinancialMatrixLayer2Output {
  promptVersion: string;
  modelUsed: string;
  analyzedAt: string;
  // Primary Comprehensive Report (Exact requested sections)
  hookSummary?: string; // КОРОТКОЕ САММАРИ (ВВОДНАЯ ИНТРИГА)
  matrixOverview?: string; // ВАША ФИНАНСОВАЯ МАТРИЦА
  financialPotential?: string; // ВАШ ФИНАНСОВЫЙ ПОТЕНЦИАЛ
  strengths?: StrengthItem[]; // ВАШИ СИЛЬНЫЕ СТОРОНЫ
  limitations?: LimitationItem[]; // ЧТО МОЖЕТ ВАМ МЕШАТЬ
  moneyManifestations?: MoneyManifestationItem[]; // КАК ЭТО МОЖЕТ ПРОЯВЛЯТЬСЯ В ДЕНЬГАХ
  mainInternalConflict?: string; // ГЛАВНЫЙ ВНУТРЕННИЙ КОНФЛИКТ
  mainLever?: MainLever; // ГЛАВНЫЙ РЫЧАГ
  quickSummary?: QuickSummary; // КРАТКИЙ ИТОГ

  // Theoretical frameworks & deeper tabs
  executiveSummary: string;
  systemicDynamics: Layer2SystemicDynamics;
  behavioralEconomics: Layer2BehavioralEconomics;
  analyticalPsychology: Layer2AnalyticalPsychology;
  actionableStrategy: Layer2ActionableStrategy;
  confidenceScore: number;
}

export interface DiagnosticAnalysisRecord {
  id: string;
  accountId: string;
  profileId: string;
  profileName: string;
  relationType: RelationshipType;
  moduleType: DiagnosticModuleType;
  algorithmVersion: string;
  promptVersion: string;
  status: 'CALCULATED_ONLY' | 'COMPLETED' | 'FAILED';
  layer1: FinancialMatrixLayer1Output;
  layer2?: FinancialMatrixLayer2Output;
  errorMessage?: string;
  durationMs: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  accountId: string;
  tier: 'FREE_TRIAL' | 'PRO_MONTHLY' | 'ENTERPRISE';
  status: 'active' | 'trialing' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  maxProfiles: number;
  features: string[];
  referralCreditsApplied: number;
}

export interface Referral {
  id: string;
  referrerAccountId: string;
  refereeAccountId: string;
  refereeEmail: string;
  status: 'PENDING' | 'CONVERTED';
  convertedAt?: string;
  createdAt: string;
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalInvites: number;
  convertedCount: number;
  rewardMonthsEarned: number;
  conversionsTowardsNextMonth: number;
  history: Referral[];
}

export type LogCategory = 
  | 'Application'
  | 'Error'
  | 'AI'
  | 'Diagnostic'
  | 'Subscription'
  | 'Referral'
  | 'AdminAudit'
  | 'Security'
  | 'Authentication';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: LogCategory;
  message: string;
  details?: Record<string, unknown>;
  accountId?: string;
  ipAddress?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminAccountId: string;
  adminEmail: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  details: Record<string, unknown>;
}

export type FeaturePermission = 
  | 'RUN_FINANCIAL_MATRIX'
  | 'RUN_AI_DEEP_DIVE'
  | 'CREATE_PROFILE'
  | 'EXPORT_REPORT'
  | 'UNLIMITED_PROFILES'
  | 'ADMIN_CONSOLE'
  | 'VIEW_AUDIT_LOGS';

export interface FormFieldConfig {
  key: string;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
}

export interface ContentSectionConfig {
  invariantNotice: string;
  methodologyDisclaimer: string;
  referralTerms: string;
  supportEmail: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
  referralCode?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  account: Account;
  token: string;
  subscription?: Subscription;
  permissions?: Record<string, boolean>;
}

export interface TestResult {
  name: string;
  status: 'PASSED' | 'FAILED';
  message: string;
  durationMs: number;
  details?: Record<string, unknown>;
}

export interface TestSuiteResult {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    durationMs: number;
  };
  tests: TestResult[];
}

