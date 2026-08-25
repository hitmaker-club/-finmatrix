/**
 * Socionics Diagnostic Model & Integrative Analysis Types
 */

import { Language } from '../i18n/types.js';
import { FinancialMatrixLayer1Output, FinancialMatrixLayer2Output, PersonProfile } from './domain.js';

export type SociotypeCode =
  | 'ИЛЭ'
  | 'ЛИИ'
  | 'ЭСЭ'
  | 'СЭИ'
  | 'СЛЭ'
  | 'ИЭИ'
  | 'ЛСИ'
  | 'ЭИЭ'
  | 'СЭЭ'
  | 'ИЛИ'
  | 'ЛИЭ'
  | 'ЭСИ'
  | 'ЛСЭ'
  | 'СЛИ'
  | 'ИЭЭ'
  | 'ЭИИ';

export type CognitiveFunction = 'ЧИ' | 'БИ' | 'ЧЛ' | 'БЛ' | 'ЧЭ' | 'БЭ' | 'ЧС' | 'БС';

export type QuadraType = 'Альфа' | 'Бета' | 'Гамма' | 'Дельта';
export type BashkuevQuadraType = 'Духовники' | 'Аристократы' | 'Купцы/Ремесленники' | 'Крестьяне';
export type OrientationType = 'result' | 'process';

export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface SocionicsOption {
  key: OptionKey;
  text: Record<Language, string>;
}

export interface SocionicsScreen {
  id: number;
  blockId: number;
  blockTitle: Record<Language, string>;
  title: Record<Language, string>;
  situation: Record<Language, string>;
  question: Record<Language, string>;
  options: Record<OptionKey, Record<Language, string>>;
}

export interface FunctionWeights {
  ЧИ: number;
  БИ: number;
  ЧЛ: number;
  БЛ: number;
  ЧЭ: number;
  БЭ: number;
  ЧС: number;
  БС: number;
  result: number;
  process: number;
}

export type ScreenWeightMap = Record<OptionKey, FunctionWeights>;
export type DiagnosticWeightMap = Record<number, ScreenWeightMap>;

export type EnergyCluster = 'A' | 'B' | 'C' | 'D' | 'E';

export interface EnergyScreen {
  id: number;
  title: Record<Language, string>;
  situation: Record<Language, string>;
  question: Record<Language, string>;
  options: Record<OptionKey, Record<Language, string>>;
}

export interface EnergyWeights {
  clusterA: number; // Vitality / Surplus
  clusterB: number; // Balanced / Baseline
  clusterC: number; // Burnout / Exhaustion
  clusterD: number; // Hyperarousal / Panic
  clusterE: number; // Hypoarousal / Apathy
  energyIn: number; // Generation / Input
  energyOut: number; // Drain / Dissipation
}

export interface RecoveryProtocol {
  title: string;
  source: string; // Huberman, McKeown, Rosenberg, Nagoski, Fogg, Levine
  scientificBasis: string;
  duration: string;
  actionSteps: string[];
  cheatCode: string;
}

export interface EnergyDiagnosticsResult {
  kpd: number;
  dominantCluster: EnergyCluster;
  clusterNameRu: string;
  clusterNameEn: string;
  clusterDescriptionRu: string;
  clusterDescriptionEn: string;
  energyIn: number;
  energyOut: number;
  reliability_flag: boolean; // true if kpd >= 1.0, false if kpd < 1.0
  scenario: 'A' | 'B'; // A = normal/high (KPD >= 1.0), B = depleted (KPD < 1.0)
  protocol?: RecoveryProtocol;
}

export interface SocionicsContradiction {
  pair: [number, number];
  severity: 'low' | 'medium' | 'high';
  description?: string;
}

export interface SocionicsTestResult {
  id: string;
  profileId?: string;
  profileName?: string;
  completedAt: string;
  answers: Record<number, OptionKey>;
  energyAnswers?: Record<number, OptionKey>;
  energy_diagnostics?: EnergyDiagnosticsResult;
  sociotype: {
    primary: SociotypeCode;
    secondary: SociotypeCode;
    confidence: number;
    candidates: SociotypeCode[];
    nameRu: string;
    nameEn: string;
    aliasRu: string;
    aliasEn: string;
  };
  quadra: {
    classic: QuadraType;
    bashkuev: BashkuevQuadraType;
    confidence: number;
    descriptionRu: string;
    descriptionEn: string;
    descriptionEs: string;
  };
  result_process: {
    type: OrientationType;
    confidence: number;
    scores: {
      result: number;
      process: number;
    };
  };
  validity: {
    consistency_score: number;
    contradictions: SocionicsContradiction[];
    social_desirability_bias: 'low' | 'moderate' | 'high';
    reliability_flag: boolean;
  };
  cognitive_profile: {
    functions: Record<CognitiveFunction, number>;
    normalizedFunctions: Record<CognitiveFunction, number>;
    top3: Array<{ func: CognitiveFunction; score: number; label: string }>;
    bottom3: Array<{ func: CognitiveFunction; score: number; label: string }>;
  };
}

export interface SynergyPoint {
  title: string;
  archetype: string;
  socionics: string;
  matrix: string;
  financialManifestation: string;
}

export interface ConflictPoint {
  title: string;
  archetypeWant: string;
  socionicsMatrixDemand: string;
  financialConsequence: string;
}

export interface SocialRoleRecommendation {
  title: string;
  essence: string;
  whyFits: string;
  monetization: string;
}

export interface IntegrativeAnalysisReport {
  id: string;
  promptVersion: string;
  modelUsed: string;
  analyzedAt: string;
  subjectName: string;
  birthDate: string;
  dayNumber: number;
  dayArchetypeTheme: string;
  
  // 1. Central mechanism of the system
  centralMechanism: string;

  // 2. Synergy across all four layers
  synergyPoints: SynergyPoint[];

  // 3. Friction & Conflict between Archetype and Behavior
  conflicts: ConflictPoint[];

  // 4. Family intergenerational layer
  familyLayer: string;

  // 5. Single main internal conflict
  mainInternalConflict: string;

  // 6. Main lever of transformation
  mainLever: {
    title: string;
    behaviorChange: string;
    actionableDirections: string[];
  };

  // 7. Recommended Social Roles
  socialRoles: SocialRoleRecommendation[];

  // 8. Quick Summary
  quickSummary: {
    strongestPotential: string;
    bottleneck: string;
    growthDirection: string;
  };

  // Energy Gatekeeper & Physiological Diagnostics
  energy_diagnostics?: EnergyDiagnosticsResult;

  confidenceScore: number;
  language: Language;
}

export interface FullIntegrativeAnalysisRecord {
  id: string;
  accountId: string;
  profileId: string;
  profileName: string;
  createdAt: string;
  layer1Matrix: FinancialMatrixLayer1Output;
  layer2Matrix?: FinancialMatrixLayer2Output;
  socionicsResult: SocionicsTestResult;
  integrativeReport?: IntegrativeAnalysisReport;
  durationMs: number;
  status: 'COMPLETED' | 'FAILED';
}
