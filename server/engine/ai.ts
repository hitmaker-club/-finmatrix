/**
 * Layer 2 AI Analytical Engine: Cross-Analysis based on Systems Theory,
 * Analytical Psychology, and Behavioral Economics.
 * 
 * Strict Guardrails:
 * - NO esoteric concepts, astrology, tarot, or arcana.
 * - Framework grounded purely in Ludwig von Bertalanffy (General Systems Theory),
 *   Carl Jung (Analytical Psychology), and Kahneman / Thaler / Young (Behavioral Economics).
 * - Full decoupling from Layer 1. Layer 1 is mathematically deterministic.
 * - Fault tolerance: if AI fails/times out, Layer 1 remains valid and can be re-analyzed.
 */

import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import {
  FinancialMatrixLayer1Output,
  FinancialMatrixLayer2Output,
  PersonProfile,
} from '../../src/types/domain.js';
import { logger } from '../services/logger.js';

export const PROMPT_VERSION = 'v3.0.0-behavioral-systems-financial';
export const PRIMARY_MODEL_ID = 'gemini-3.1-flash-lite';
export const FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-3.6-flash'];

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('AI', 'GEMINI_API_KEY environment variable is not configured.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${timeoutMs}ms exceeded while calling ${label}`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function callGeminiWithFallback(
  client: GoogleGenAI,
  userPrompt: string,
  systemInstruction: string,
  schema: any
): Promise<{ text: string; modelUsed: string } | null> {
  const modelsToTry = [PRIMARY_MODEL_ID, ...FALLBACK_MODELS];

  for (const model of modelsToTry) {
    try {
      const config: any = {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: schema,
      };

      // For Gemini 3 models, use LOW thinking level for quick, deterministic structured extraction
      if (model.startsWith('gemini-3')) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: userPrompt,
          config,
        }),
        25000,
        `Gemini model ${model}`
      );

      if (response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      logger.warn('AI', `Model ${model} attempt failed: ${errMsg}`);
    }
  }

  return null;
}

export async function generateLayer2Analysis(
  profile: PersonProfile,
  layer1: FinancialMatrixLayer1Output,
  lang: 'ru' | 'en' | 'es' = 'ru'
): Promise<FinancialMatrixLayer2Output> {
  const startTime = Date.now();
  const client = getAIClient();

  const v1 = layer1.vectors.v1_life_scenario;
  const v2 = layer1.vectors.v2_work_model;
  const v3 = layer1.vectors.v3_emotional_background;
  const v4 = layer1.vectors.v4_resource_management;

  const targetLangName = lang === 'ru' ? 'Russian (Русский)' : lang === 'es' ? 'Spanish (Español)' : 'English';

  const systemInstruction = `======================================================================
ROLE
======================================================================

You are a Senior Behavioral Systems Analyst and Personal Finance
Potential Specialist.

Your task is to interpret a deterministic Personal Financial Matrix
and transform its structural data into a meaningful hypothesis about
the person's financial-behavioral potential.

The purpose of the analysis is NOT to predict the future and NOT to
diagnose a psychological disorder.

The purpose is to identify:
- potential strengths;
- natural behavioral tendencies;
- possible internal contradictions;
- potential shadow manifestations of strengths;
- possible financial consequences of these patterns;
- ways in which the person's potential may be expressed more effectively.

The analysis must be INDIVIDUAL. Do not produce a generic personality
description that could apply equally well to many different people.

======================================================================
THEORETICAL FRAMEWORK
======================================================================

Use the following theoretical systems as CONCEPTUAL LENSES. Do not
mechanically assign a theory to a vector. Choose the concepts most
useful for explaining the specific combination of data.

1. LUDWIG VON BERTALANFFY — General System Theory
   Use for: system structure, element interaction, open/closed systems,
   dynamic equilibrium, feedback loops, equifinality.
   Central question: "What kind of behavioral system is formed by the
   interaction of V1, V2, V3, V4?"

2. CARL GUSTAV JUNG — Analytical Psychology
   Use for: internal polarities, shadow dynamics, compensation
   mechanisms, tension between conscious preferences and neglected
   tendencies, strength becoming limitation when overdeveloped.

3. KAHNEMAN & TVERSKY — Prospect Theory / Behavioral Economics
   Use for: loss aversion, overconfidence, certainty effect, framing,
   asymmetric perception of gains/losses, decision-making under risk.
   Identify a bias ONLY when the structural combination supports it.

4. RICHARD THALER — Behavioral Economics / Mental Accounting
   Use for: mental accounting, self-control, present vs future
   preferences, choice architecture, gap between intended and actual
   behavior, resource allocation patterns.

5. JEFFREY YOUNG — Schema Therapy
   Use for: intergenerational patterns, early maladaptive schemas
   (as hypotheses), excessive responsibility, impaired autonomy,
   need for control, conditional self-worth.
   Do NOT diagnose. Formulate hypotheses.

SYNTHESIS RULE: Do not produce five separate theoretical essays.
Weave the frameworks together into one coherent analysis.

======================================================================
THE DETERMINISTIC MATRIX — RULES
======================================================================

V1–V4 are calculated by a separate deterministic algorithm.
They are INPUT DATA. Do NOT recalculate, modify, or reinterpret them
through numerology. Do NOT assign mystical meanings to numbers.

V1–V4 are STRUCTURAL MARKERS. Their meaning comes from:
- the vector in which they appear;
- their relationship with the other vectors;
- the intergenerational structure;
- the resulting behavioral configuration.

The MATHEMATICAL LAYER and the INTERPRETIVE LAYER are separate.

======================================================================
FOUR VECTORS — FUNCTIONAL DEFINITIONS
======================================================================

V1 — Life Scenario: basic way of approaching decisions, goals,
     responsibility, long-term direction.
V2 — Work Model: interaction with work, tasks, effort, complexity,
     execution.
V3 — Emotional Background: internal tension, uncertainty, pressure,
     emotional reactions influencing financial behavior.
V4 — Resource/Time Management: organization of time, energy, attention,
     finite resources.

VECTOR POLARITY INTERPRETATION:
- Positive values (+): outward-directed energy. Expansion, expression,
  acquisition, growth orientation, active interaction with environment.
- Negative values (−): inward-directed energy. Preservation, defense,
  risk mitigation, conservation, maintenance of equilibrium.
- Zero or near-zero: neutral, latent, or context-dependent expression.

VECTOR MAGNITUDE INTERPRETATION:
- Higher absolute value = greater intensity of that function.
- Compare magnitudes across vectors to find structural bottlenecks.

======================================================================
ANALYTICAL ALGORITHM — STEP BY STEP
======================================================================

STEP 1: DETERMINE SYSTEM TYPE
Look at the polarity of all four vectors together.
- All positive → "Engine" architecture (expansion, growth, risk-taking)
- All negative → "Fortress" architecture (preservation, defense, control)
- Mixed → "Hybrid" with internal polarity between expansion and defense
Identify the dominant orientation.

STEP 2: FIND STRUCTURAL BOTTLENECKS
Compare vector magnitudes. The most important insight often comes from
a MISMATCH between vectors, not from the highest value alone.

Key bottleneck patterns:
- V3 (emotional drive) >> V4 (resource management):
  "Engine without a fuel tank." High energy output but limited
  sustainability. Risk of burnout.
- V2 (work capacity) >> V4 (resource management):
  "Worker running on empty." High effort but poor recovery.
- V1 (life direction) << V3 (emotional intensity):
  "Powerful engine without steering." Energy without clear direction.
- V4 (resources) >> V3 (emotional drive):
  "Full tank, no engine." Resources available but no motivation
  to deploy them.

STEP 3: IDENTIFY INTERGENERATIONAL TENSION
Analyze parents' birth years as a structural layer.
Determine the generational context:
- Parents born 1930s–1950s: likely carry scarcity/survival schemas.
  Security = effort, control, caution. "Don't stand out."
- Parents born 1960s–1970s: transition period. Mixed messages about
  stability and risk.
- Parents born 1980s+: more likely to carry achievement/growth schemas.

Then examine: Does the individual's vector polarity ALIGN or CONFLICT
with the likely intergenerational schema?

ALIGNMENT example: Negative vectors + scarcity-generation parents
→ reinforced caution, security-seeking.

CONFLICT example: Positive vectors + scarcity-generation parents
→ individual wants to expand, family system says "it's dangerous."
This creates unconscious self-sabotage, guilt about success, or
compulsive overwork to "earn" the right to succeed.

STEP 4: MAP STRENGTH → SHADOW → FINANCIAL EFFECT
For every major strength identified, find its polarity:

Strength → becomes Shadow when → produces Financial Effect:
- Drive → impulsivity, overconfidence → risky investments, burnout
- Caution → paralysis, missed opportunities → stagnation, inflation loss
- Responsibility → over-responsibility → inability to delegate, bottleneck
- Analysis → over-analysis → decision paralysis, slow market entry
- Independence → inability to accept help → scaling limits
- Ambition → inability to stop → diminishing returns, health cost
- Quality focus → perfectionism → missed deadlines, over-investment

STEP 5: TRANSLATE TO FINANCIAL MECHANISMS
Do not stop at psychological description. For every pattern, answer:
- How does this affect EARNING? (pricing, positioning, value capture)
- How does this affect SPENDING? (mental accounting, impulse vs control)
- How does this affect SAVING/INVESTING? (risk appetite, allocation)
- How does this affect SCALING? (delegation, systems, leverage)
- How does this affect BUSINESS MODEL choice? (solo vs team, product vs service)

======================================================================
INTERACTION PATTERNS TO LOOK FOR
======================================================================

When analyzing V1–V4 together, search for:
- Reinforcement: two vectors amplifying the same tendency
- Contradiction: two vectors pulling in opposite directions
- Compensation: one vector covering for another's weakness
- Dependency: one vector cannot function without another
- Bottleneck: the weakest vector limiting the entire system
- Hidden polarity: apparent strength concealing a limitation

The most meaningful insight often comes from the relationship between
two apparently unrelated vectors.

======================================================================
REPORT STRUCTURE & STRICT LANGUAGE MANDATE
======================================================================

CRITICAL MANDATE: ALL output text across EVERY SINGLE FIELD in the JSON response MUST be written fluently, naturally, and completely in ${targetLangName}.
Do NOT output Russian text when English or Spanish is requested. Every explanation, name, domain, summary, analysis, bullet point, and recommendation must be in ${targetLangName}.

Use exactly the JSON schema fields provided:

1. SHORT HOOK SUMMARY -> hookSummary
2-3 paragraphs written in a direct, simple, conversational, yet punchy tone without dry jargon.
Explain to the client right away what invisible trap they are in, why they hit a glass ceiling despite their high capabilities, and hook them so they desperately want to read the detailed report below to find the solution.

2. FINANCIAL MATRIX OVERVIEW -> matrixOverview
3-5 sentences. Synthesis of the overall system type, dominant
architecture, key structural feature, and intergenerational context.
Name the system metaphor (e.g., "Fortress," "Engine," "Navigator").

3. FINANCIAL POTENTIAL -> financialPotential
Describe the primary mechanism of value creation. What type of value
does this person naturally create? In what conditions does their
potential emerge most strongly?

4. STRENGTHS -> strengths
Identify 2-4 key strengths. For each:
- name: Name the strength (in ${targetLangName})
- structuralBasis: Explain the structural basis (which vectors create it)
- behavior: Show concrete behavioral manifestation
- financialEffect: Show concrete financial manifestation

5. LIMITATIONS & SHADOWS -> limitations
Identify 2-3 shadow manifestations or internal contradictions.
For each:
- name: Name of the limitation/shadow (in ${targetLangName})
- mechanismOfShadow: Explain HOW a strength becomes a limitation (mechanism of transformation)
- financialRisk: Direct financial bottleneck/risk

6. FINANCIAL MANIFESTATIONS -> moneyManifestations
Translate identified patterns into 3-5 concrete financial behaviors covering earning, investing, spending, scaling, risk, delegation.
For each item: domain (e.g. "Monetization & Pricing", "Investment & Risk", "Scaling & Delegation" in ${targetLangName}) and description.

7. MAIN INTERNAL CONFLICT -> mainInternalConflict
Identify THE ONE most important tension in the configuration.
Explain it in 3-5 sentences in ordinary, vivid language.
Use the metaphor of "pressing the gas while pulling the handbrake" or similar physical metaphor.

8. MAIN LEVER -> mainLever
Identify the single behavioral adjustment (coreAdjustment) that would unlock the most of the existing potential. Give 2-3 concrete, actionable directions (actionableDirections).

9. SUMMARY -> quickSummary
Three crisp items:
- strongestPotential: Strongest potential (one sentence)
- bottleneck: What prevents realization (one sentence)
- growthDirection: Direction for turning potential into results (one sentence)

10. DEEP THEORETICAL MODULES
- executiveSummary: Complete strategic executive synthesis.
- systemicDynamics: intergenerationalPatterns, familyResourceFlowFeedback, systemEquilibriumHypothesis.
- behavioralEconomics: mentalAccountingTendency, lossAversionSensitivity, temporalDiscountingProfile, cognitiveBiasesIdentified.
- analyticalPsychology: primaryArchetype, shadowFinancialPattern, individuationChallenges.
- actionableStrategy: tacticalAdjustments, riskMitigationProtocols, resourceAllocationRule, decisionMakingChecklist.

======================================================================
STYLE RULES
======================================================================

Language: ${targetLangName}. Clear, natural, concrete, intelligent.
Tone: Psychologically insightful + financially relevant.
Register: Between expert consultation and personal discovery.

CRITICAL LOCALIZATION REQUIREMENT:
- All generated content across ALL sections, fields, headings, bullet points, recommendations, and analysis MUST be written 100% strictly in ${targetLangName}.
- Do NOT output English or any other language unless the target language itself is English.
- Use natural, professional, idiomatically fluent phrasing in ${targetLangName}.

DO:
- Write 100% in ${targetLangName}
- Be specific to THIS person's configuration
- Use mechanisms, not labels
- Show polarity (strength ↔ shadow)
- Translate psychology into financial behavior
- Use vivid metaphors sparingly but effectively
- Formulate clear hypotheses when structure supports them

DO NOT:
- Sound like a psychological diagnosis
- Sound like an academic paper
- Sound like generic motivational content
- Use vague hedging
- Simplify to the point where individual differences disappear
- Use numerological interpretations
- Prescribe a specific career or profession
- Include socionics, emotional tone diagnostics, or compatibility`;

  const fullName = `${profile.firstName} ${profile.lastName || ''}`.trim() || (lang === 'ru' ? 'Клиент' : lang === 'es' ? 'Cliente' : 'Client');
  const notProvidedStr = lang === 'ru' ? 'Не указана' : lang === 'es' ? 'No especificada' : 'Not specified';
  const motherDob = profile.motherBirthDate || (layer1.mother ? layer1.mother.raw : notProvidedStr);
  const fatherDob = profile.fatherBirthDate || (layer1.father ? layer1.father.raw : notProvidedStr);

  const userPrompt = `Conduct a comprehensive Personal Financial Potential Diagnostic using the input data below:

Subject Name: ${fullName}
Date of Birth: ${profile.birthDate}
Mother's Date of Birth: ${motherDob}
Father's Date of Birth: ${fatherDob}
V1 (Life Scenario Vector) = ${v1.value}
V2 (Work Model Vector) = ${v2.value}
V3 (Emotional Background Vector) = ${v3.value}
V4 (Resource Management Vector) = ${v4.value}
Occupation: ${profile.occupation || notProvidedStr}
Financial Goals: ${profile.financialGoals || notProvidedStr}

CRITICAL: Return the complete comprehensive diagnostic report strictly in ${targetLangName}. Every single value inside the JSON object must be written entirely in ${targetLangName}.
Process all vectors according to the ANALYTICAL ALGORITHM and provide your complete response adhering strictly to the JSON schema in ${targetLangName}.`;

  if (!client) {
    logger.warn('AI', 'Returning structured fallback analysis due to missing API key.');
    return generateDeterministicFallbackAnalysis(profile, layer1, lang);
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      // 1. КОРОТКОЕ САММАРИ (ВВОДНАЯ ИНТРИГА)
      hookSummary: {
        type: Type.STRING,
        description: '2-3 paragraphs in a direct, simple, conversational, yet punchy tone without dry psychological terms. Explain the invisible trap, why they hit a glass ceiling, and hook them to read the report.',
      },
      // 2. ВАША ФИНАНСОВАЯ МАТРИЦА
      matrixOverview: {
        type: Type.STRING,
        description: '3-5 sentences. Synthesis of system type, dominant architecture, intergenerational context, and system metaphor.',
      },
      // 3. ВАШ ФИНАНСОВЫЙ ПОТЕНЦИАЛ
      financialPotential: {
        type: Type.STRING,
        description: 'Primary mechanism of value creation. In what conditions does their potential emerge most strongly.',
      },
      // 4. ВАШИ СИЛЬНЫЕ СТОРОНЫ
      strengths: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Name of the strength' },
            structuralBasis: { type: Type.STRING, description: 'Which vectors create it' },
            behavior: { type: Type.STRING, description: 'Concrete behavioral manifestation' },
            financialEffect: { type: Type.STRING, description: 'Concrete financial manifestation' },
          },
          required: ['name', 'structuralBasis', 'behavior', 'financialEffect'],
        },
        description: '2-4 key strengths with structural basis, behavior, and financial manifestation.',
      },
      // 5. ЧТО МОЖЕТ ВАМ МЕШАТЬ
      limitations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Name of the shadow/limitation' },
            mechanismOfShadow: { type: Type.STRING, description: 'How a strength becomes a limitation' },
            financialRisk: { type: Type.STRING, description: 'Concrete financial bottleneck' },
          },
          required: ['name', 'mechanismOfShadow', 'financialRisk'],
        },
        description: '2-3 shadow manifestations showing the mechanism of transformation.',
      },
      // 6. КАК ЭТО МОЖЕТ ПРОЯВЛЯТЬСЯ В ДЕНЬГАХ
      moneyManifestations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING, description: 'Area (Earning, Investing, Spending, Scaling, etc.)' },
            description: { type: Type.STRING, description: 'Specific financial behavior mechanism' },
          },
          required: ['domain', 'description'],
        },
        description: '3-5 concrete financial behaviors covering earning, investing, spending, scaling, risk, delegation.',
      },
      // 7. ГЛАВНЫЙ ВНУТРЕННИЙ КОНФЛИКТ
      mainInternalConflict: {
        type: Type.STRING,
        description: 'The ONE most important tension in the configuration in 3-5 sentences in vivid language (gas + handbrake).',
      },
      // 8. ГЛАВНЫЙ РЫЧАГ
      mainLever: {
        type: Type.OBJECT,
        properties: {
          coreAdjustment: { type: Type.STRING, description: 'The single behavioral adjustment unlocking potential' },
          actionableDirections: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 concrete actionable directions',
          },
        },
        required: ['coreAdjustment', 'actionableDirections'],
      },
      // 9. КРАТКИЙ ИТОГ
      quickSummary: {
        type: Type.OBJECT,
        properties: {
          strongestPotential: { type: Type.STRING, description: 'Strongest potential (one sentence)' },
          bottleneck: { type: Type.STRING, description: 'What prevents realization (one sentence)' },
          growthDirection: { type: Type.STRING, description: 'Direction for turning potential into results (one sentence)' },
        },
        required: ['strongestPotential', 'bottleneck', 'growthDirection'],
      },
      // Theoretical Deep Frameworks
      executiveSummary: {
        type: Type.STRING,
        description: 'Synthesis summary of all vectors.',
      },
      systemicDynamics: {
        type: Type.OBJECT,
        properties: {
          intergenerationalPatterns: { type: Type.STRING },
          familyResourceFlowFeedback: { type: Type.STRING },
          systemEquilibriumHypothesis: { type: Type.STRING },
        },
        required: ['intergenerationalPatterns', 'familyResourceFlowFeedback', 'systemEquilibriumHypothesis'],
      },
      behavioralEconomics: {
        type: Type.OBJECT,
        properties: {
          mentalAccountingTendency: { type: Type.STRING },
          lossAversionSensitivity: { type: Type.STRING },
          temporalDiscountingProfile: { type: Type.STRING },
          cognitiveBiasesIdentified: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['mentalAccountingTendency', 'lossAversionSensitivity', 'temporalDiscountingProfile', 'cognitiveBiasesIdentified'],
      },
      analyticalPsychology: {
        type: Type.OBJECT,
        properties: {
          primaryArchetype: { type: Type.STRING },
          shadowFinancialPattern: { type: Type.STRING },
          individuationChallenges: { type: Type.STRING },
        },
        required: ['primaryArchetype', 'shadowFinancialPattern', 'individuationChallenges'],
      },
      actionableStrategy: {
        type: Type.OBJECT,
        properties: {
          tacticalAdjustments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          riskMitigationProtocols: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          resourceAllocationRule: { type: Type.STRING },
          decisionMakingChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['tacticalAdjustments', 'riskMitigationProtocols', 'resourceAllocationRule', 'decisionMakingChecklist'],
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: 'Confidence score between 0.85 and 0.99',
      },
    },
    required: [
      'hookSummary',
      'matrixOverview',
      'financialPotential',
      'strengths',
      'limitations',
      'moneyManifestations',
      'mainInternalConflict',
      'mainLever',
      'quickSummary',
      'executiveSummary',
      'systemicDynamics',
      'behavioralEconomics',
      'analyticalPsychology',
      'actionableStrategy',
      'confidenceScore',
    ],
  };

  try {
    const result = await callGeminiWithFallback(
      client,
      userPrompt,
      systemInstruction,
      responseSchema
    );

    if (!result) {
      logger.info('AI', `Using deterministic systems-behavioral fallback for profile ${profile.id}`);
      return generateDeterministicFallbackAnalysis(profile, layer1, lang);
    }

    const { text, modelUsed } = result;
    const duration = Date.now() - startTime;
    logger.info('AI', `Generated Layer 2 analysis for profile ${profile.id} in ${duration}ms using ${modelUsed}`);

    const cleanedText = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedText || '{}');

    return {
      promptVersion: PROMPT_VERSION,
      modelUsed,
      analyzedAt: new Date().toISOString(),
      hookSummary: parsed.hookSummary,
      matrixOverview: parsed.matrixOverview,
      financialPotential: parsed.financialPotential,
      strengths: parsed.strengths,
      limitations: parsed.limitations,
      moneyManifestations: parsed.moneyManifestations,
      mainInternalConflict: parsed.mainInternalConflict,
      mainLever: parsed.mainLever,
      quickSummary: parsed.quickSummary,
      executiveSummary: parsed.executiveSummary || parsed.matrixOverview || 'Синтез финансового потенциала.',
      systemicDynamics: parsed.systemicDynamics,
      behavioralEconomics: parsed.behavioralEconomics,
      analyticalPsychology: parsed.analyticalPsychology,
      actionableStrategy: parsed.actionableStrategy,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.94,
    };
  } catch (error: any) {
    logger.info('AI', `Gemini fallback synthesis activated: ${error.message}`);
    return generateDeterministicFallbackAnalysis(profile, layer1, lang);
  }
}

/**
 * Deterministic Fallback Synthesis: Ensures the system remains 100% functional
 * even when operating completely offline or if the AI provider experiences an outage.
 */
export function generateDeterministicFallbackAnalysis(
  profile: PersonProfile,
  layer1: FinancialMatrixLayer1Output,
  lang: 'ru' | 'en' | 'es' = 'ru'
): FinancialMatrixLayer2Output {
  const v1 = layer1.vectors.v1_life_scenario.value;
  const v2 = layer1.vectors.v2_work_model.value;
  const v3 = layer1.vectors.v3_emotional_background.value;
  const v4 = layer1.vectors.v4_resource_management.value;

  const archetypesRu = [
    '',
    'Стратег-первопроходец (Автономный создатель ценности)',
    'Синтезатор и архитектор коалиций (Сбалансированный медиатор)',
    'Катализатор и экспрессивный мультипликатор (Драйвер роста)',
    'Системный архитектор и интегратор (Конструктор устойчивости)',
    'Трансформационный лидер и инноватор (Адаптивный реформатор)',
    'Хранитель баланса и ценностный наставник (Мастер доверия)',
    'Глубинный аналитик и методолог (Интеллектуальный стратег)',
    'Универсальный координатор и оператор масштаба (Диспетчер ресурсов)',
    'Гуманитарный архитектор и создатель смыслов (Философ ценности)',
  ];

  const archetypesEn = [
    '',
    'Pioneer Strategist (Autonomous Value Creator)',
    'Coalition Synthesizer & Mediator (Equilibrium Builder)',
    'Catalytic Multiplier & Growth Driver',
    'Systems Architect & Structural Integrator',
    'Transformation Leader & Agile Reformer',
    'Trust Mentor & Value Steward',
    'Deep Methodology Analyst & Intellect Strategist',
    'Universal Resource Coordinator & Scale Operator',
    'Humanitarian Architect & Vision Creator',
  ];

  const archetypesEs = [
    '',
    'Estratega Pionero (Creador Autónomo de Valor)',
    'Sintetizador de Coaliciones y Mediador',
    'Multiplicador Catalítico y Motor de Crecimiento',
    'Arquitecto de Sistemas e Integrador Estructural',
    'Líder de Transformación y Reformador Ágil',
    'Mentor de Confianza y Custodio de Valor',
    'Analista Metodológico Profundo y Estratega',
    'Coordinador Universal de Recursos y Operador de Escala',
    'Arquitecto Humanitario y Creador de Visión',
  ];

  const systemMetaphorsRu = [
    '',
    '«Высокоточная автономная лаборатория инноваций»',
    '«Сбалансированная экосистема партнёрств и союзов»',
    '«Турбогенератор быстрых гипотез и вирального роста»',
    '«Инженерный завод надежных и масштабируемых систем»',
    '«Адаптивный навигатор в условиях высокой турбулентности»',
    '«Центр доверия, глубоких связей и премиального сервиса»',
    '«Аналитический хаб и методологический мозговой центр»',
    '«Оркестр распределенных ресурсов и операционной эффективности»',
    '«Институт ценностей, смысловых продуктов и социального влияния»',
  ];

  const systemMetaphorsEn = [
    '',
    '“High-Precision Autonomous Innovation Lab”',
    '“Balanced Ecosystem of Strategic Partnerships”',
    '“Turbo-Generator of Rapid Market Hypotheses”',
    '“Engineering Plant of Resilient & Scalable Systems”',
    '“Adaptive Navigator under High Volatility”',
    '“Center of Trust, Deep Relationships & Premium Services”',
    '“Analytical Methodology Hub & Strategy Center”',
    '“Orchestrator of Distributed Resources & Operational Efficiency”',
    '“Institute of Core Values, Purposeful Products & Impact”',
  ];

  const systemMetaphorsEs = [
    '',
    '«Laboratorio de Innovación Autónoma de Alta Precisión»',
    '«Ecosistema Equilibrado de Alianzas Estratégicas»',
    '«Turbogenerador de Hipótesis Rápidas y Crecimiento»',
    '«Planta de Ingeniería de Sistemas Resilientes y Escalables»',
    '«Navegador Adaptativo en Alta Incertidumbre»',
    '«Centro de Confianza, Relaciones Profundas y Servicios Premium»',
    '«Hub Analítico y Centro Estratégico de Metodología»',
    '«Orquestador de Recursos Distribuidos y Eficiencia Operativa»',
    '«Instituto de Valores, Productos con Propósito e Impacto Social»',
  ];

  const primaryArchRu = archetypesRu[v1] || archetypesRu[1];
  const primaryArchEn = archetypesEn[v1] || archetypesEn[1];
  const primaryArchEs = archetypesEs[v1] || archetypesEs[1];
  const systemMetaphorRu = systemMetaphorsRu[v2] || systemMetaphorsRu[4];
  const systemMetaphorEn = systemMetaphorsEn[v2] || systemMetaphorsEn[4];
  const systemMetaphorEs = systemMetaphorsEs[v2] || systemMetaphorsEs[4];

  if (lang === 'ru') {
    return {
      promptVersion: `${PROMPT_VERSION}-deterministic-rule-engine`,
      modelUsed: 'Аналитический движок правил (Автономный режим)',
      analyzedAt: new Date().toISOString(),
      hookSummary: `Если вы чувствуете, что при всех ваших знаниях, упорстве и талантах доходы упираются в невидимый стеклянный потолок, а каждое масштабирование даётся через перегрузку — это не случайность. Ваша матрица показывает классическую внутреннюю ловушку: пока одна часть вашей системы стремится к росту и свободе, вторая незаметно включает экстренное торможение из соображений безопасности. В этом отчёте мы разберём точную механику этого конфликта и покажем рычаг, который освобождает ваш реальный финансовый потенциал.`,
      matrixOverview: `Ваша конфигурация [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}] формирует архитектуру типа ${systemMetaphorRu}. В ней заложен высокий ресурс самостоятельного создания ценности и системной ответственности.`,
      financialPotential: `Естественный механизм генерации капитала строится на высокой точности, доверии и структурном решении сложных задач. Масштабирование происходит через упаковку вашего мастерства в повторяемые стандарты и делегирование операционных деталей.`,
      strengths: [
        {
          name: 'Системная надежность и качество исполнения',
          structuralBasis: `Отражено в векторе работы V2=${v2} и базовом сценарии V1=${v1}`,
          behavior: 'Глубокая погруженность в продукт, нетерпимость к поверхностным решениям, исключительная честность в обязательствах.',
          financialEffect: 'Формирует высокий пожизненный LTV клиентов, безупречную репутацию и готовность заказчиков платить премию за надежность.',
        },
        {
          name: 'Стратегическая выдержка и способность к аккумуляции',
          structuralBasis: `Отражено в векторе управления ресурсами V4=${v4}`,
          behavior: 'Осознанный выбор надежных инструментов, дисциплинированное накопление резервов, расчет на длинную дистанцию.',
          financialEffect: 'Защищает капитал от импульсивных потерь и создает прочный фундамент финансовой безопасности.',
        },
      ],
      limitations: [
        {
          name: 'Ловушка перфекционизма и гиперконтроля',
          mechanismOfShadow: 'Стремление выполнить всё идеально приводит к затягиванию запуска новых инициатив и перепроверке чужой работы.',
          financialRisk: 'Упущенная выгода из-за медленного темпа тестирования гипотез и быстрого выгорания от перегрузки.',
        },
        {
          name: 'Смещение фокуса с рыночной ценности на затраченные часы',
          mechanismOfShadow: 'Ощущение, что деньги должны даваться только тяжелым непрерывным трудом.',
          financialRisk: 'Искусственное занижение чеков и неготовность продавать консалтинг или системные решения дорого.',
        },
      ],
      moneyManifestations: [
        {
          domain: 'Заработок и позиционирование',
          description: 'Склонность оценивать себя по затраченному труду, а не по ценности конечного результата для клиента, что занижает средний чек.',
        },
        {
          domain: 'Инвестиции и управление риском',
          description: 'Высокая избирательность: предпочтение понятных консервативных инструментов рискованным спекуляциям.',
        },
        {
          domain: 'Масштабирование и делегирование',
          description: 'Трудности с передачей ключевых этапов другим людям из-за боязни падения стандартов качества.',
        },
      ],
      mainInternalConflict: `Главное напряжение вашей структуры — одновременное нажатие на газ и ручной тормоз: ваше естественное стремление к финансовому росту и масштабу постоянно наталкивается на скрытую потребность в тотальном личном контроле каждого процесса. В результате энергия уходит не на рост, а на преодоление внутреннего сопротивления.`,
      mainLever: {
        coreAdjustment: 'Переход от модели «Я делаю всё сам на высшем уровне» к модели «Я создаю правила и систему, в которой результат воспроизводим другими».',
        actionableDirections: [
          'Оцифровать и передать ассистенту или команде первые 3 рутинные операции, высвободив 10 часов в неделю.',
          'Ввести правило «достаточно хорошего решения» (80/20) при тестировании новых гипотез дохода.',
          'Пересмотреть ценообразование, привязав стоимость к создаваемой ценности, а не к потраченным часам.',
        ],
      },
      quickSummary: {
        strongestPotential: 'Создание надежных, высокодоходных систем и продуктов с высоким уровнем доверия рынка.',
        bottleneck: 'Привычка замыкать все процессы на себя и откладывать расширение до идеальных условий.',
        growthDirection: 'Делегирование рутины, стандартизация процессов и смелый выход в ценообразование по ценности.',
      },
      executiveSummary: `Комплексный анализ профиля [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Архетип: «${primaryArchRu}». Архитектура системы: ${systemMetaphorRu}.`,
      systemicDynamics: {
        intergenerationalPatterns: `В работе (V2=${v2}) отражается родовая установка на честный, упорный труд как единственный надежный источник безопасности.`,
        familyResourceFlowFeedback: `Баланс между сохранением надежного тыла и стремлением к персональной автономии.`,
        systemEquilibriumHypothesis: `Точка внутреннего гомеостаза настроена на привычный уровень контролируемого дохода; прорыв требует снятия страха потери контроля.`,
      },
      behavioralEconomics: {
        mentalAccountingTendency: `Четкое разделение бюджета на неприкосновенный резерв, текущие обязательства и инвестиции в развитие.`,
        lossAversionSensitivity: `Повышенная чувствительность к потенциальным убыткам по сравнению с возможной прибылью при высокой неопределенности.`,
        temporalDiscountingProfile: `Высокая способность к отложенному вознаграждению и стратегическому накоплению.`,
        cognitiveBiasesIdentified: [
          'Иллюзия контроля (стремление лично контролировать все переменные)',
          'Эвристика статус-кво при принятии решений о смене бизнес-модели',
          'Недооценка альтернативных издержек потраченного личного времени',
        ],
      },
      analyticalPsychology: {
        primaryArchetype: primaryArchRu,
        shadowFinancialPattern: `Скрытое чувство тревоги при резком высвобождении времени или быстром росте легких денег.`,
        individuationChallenges: `Разделение своей самооценки и непрерывной трудовой загрузки; признание права на масштабирование без сверхусилий.`,
      },
      actionableStrategy: {
        tacticalAdjustments: [
          'Автоматизировать регулярные отчисления в инвестиционный фонд сразу в день поступления средств.',
          'Внедрить регламент принятия решений с ограничением времени на анализ (не более 48 часов).',
          'Начать делегирование с задач с низкой ценой ошибки.',
        ],
        riskMitigationProtocols: [
          'Поддерживать неприкосновенную финансовую подушку на 6+ месяцев.',
          'Диверсифицировать источники дохода между стабильной базой и масштабируемыми проектами.',
        ],
        resourceAllocationRule: `Правило 50/30/20: 50% — базовые расходы, 30% — инвестиции в рост и автоматизацию, 20% — резервы и качество жизни.`,
        decisionMakingChecklist: [
          'Ведет ли это решение к росту рычага или просто увеличивает мои рабочие часы?',
          'Что самое худшее может произойти при ошибке и как это компенсируется?',
          'Может ли эту задачу выполнить кто-то другой на 80% так же хорошо, как я?',
          'Соответствует ли это моей главной цели на год?',
        ],
      },
      confidenceScore: 0.95,
    };
  }

  if (lang === 'es') {
    return {
      promptVersion: `${PROMPT_VERSION}-deterministic-rule-engine`,
      modelUsed: 'Conjunto de Reglas del Motor Analítico (Modo Offline Resiliente)',
      analyzedAt: new Date().toISOString(),
      hookSummary: `Si sientes que tus ingresos tocan un techo invisible a pesar de tu esfuerzo y talento, tu matriz revela una paradoja interna: el impulso de expansión se frena por una necesidad de control absoluto.`,
      matrixOverview: `Perfil vectorial [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Configura una arquitectura de tipo ${systemMetaphorEs}, orientada a la creación sistemática de valor.`,
      financialPotential: `Creación de sistemas duraderos, capital relacional de alta confianza y apalancamiento mediante procesos escalables.`,
      strengths: [
        {
          name: 'Rigor y confiabilidad estructural',
          structuralBasis: `Vector V2=${v2} y V1=${v1}`,
          behavior: 'Compromiso riguroso y entrega de alta calidad técnica.',
          financialEffect: 'Alta retención de clientes y capacidad de cobrar primas por confiabilidad.',
        },
        {
          name: 'Disciplina de acumulación estratégica',
          structuralBasis: `Vector V4=${v4}`,
          behavior: 'Reserva metódica y visión a largo plazo.',
          financialEffect: 'Protege el patrimonio contra decisiones impulsivas.',
        },
      ],
      limitations: [
        {
          name: 'Resistencia a delegar y perfeccionismo',
          mechanismOfShadow: 'Centralización de operaciones por temor a pérdida de control.',
          financialRisk: 'Techo de ingresos por límite de horas personales.',
        },
      ],
      moneyManifestations: [
        {
          domain: 'Ingresos y precios',
          description: 'Tendencia a tarifar por horas en lugar de por valor agregado.',
        },
        {
          domain: 'Inversión y gestión de riesgo',
          description: 'Preferencia por instrumentos de alta certeza sobre oportunidades volátiles.',
        },
        {
          domain: 'Escalamiento y delegación',
          description: 'Retención de tareas críticas por miedo a la caída de estándares.',
        },
      ],
      mainInternalConflict: 'Tensión entre el deseo de escalar y el hábito de retener el control de cada detalle.',
      mainLever: {
        coreAdjustment: 'Transición de operador directo a diseñador de reglas y sistemas.',
        actionableDirections: [
          'Delegar las 3 primeras tareas operativas repetitivas.',
          'Adoptar precios basados en valor.',
          'Automatizar transferencias de inversión mensuales.',
        ],
      },
      quickSummary: {
        strongestPotential: 'Construcción de activos confiables y reputación de alto nivel.',
        bottleneck: 'Sobrecarga operativa y perfeccionismo.',
        growthDirection: 'Estandarización, delegación y modelos escalables.',
      },
      executiveSummary: `Perfil vectorial [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Arquetipo: ${primaryArchEs}.`,
      systemicDynamics: {
        intergenerationalPatterns: `El modelo de trabajo sintetiza coordenadas familiares en un esquema profesional adaptativo.`,
        familyResourceFlowFeedback: `Transición hacia activos escalables con disciplina contractual.`,
        systemEquilibriumHypothesis: `El sistema se estabiliza con exposición moderada al riesgo.`,
      },
      behavioralEconomics: {
        mentalAccountingTendency: `Categorización estricta del capital en liquidez, reservas e inversión.`,
        lossAversionSensitivity: `Alta aversión a la volatilidad no cubierta.`,
        temporalDiscountingProfile: `Gratificación postergada disciplinada.`,
        cognitiveBiasesIdentified: ['Ilusión de control', 'Resistencia al status quo'],
      },
      analyticalPsychology: {
        primaryArchetype: primaryArchEs,
        shadowFinancialPattern: `Incomodidad subconsciente ante la liquidez rápida.`,
        individuationChallenges: `Separar el valor propio de la carga laboral continua.`,
      },
      actionableStrategy: {
        tacticalAdjustments: [
          'Automatizar transferencias a cuentas de inversión.',
          'Implementar regla de decisión de 48 horas.',
          'Comenzar delegando tareas con bajo costo de error.',
        ],
        riskMitigationProtocols: [
          'Mantener reserva de emergencia para 6+ meses.',
          'Diversificar fuentes de ingresos.',
        ],
        resourceAllocationRule: `Regla 50/30/20: 50% necesidades básicas, 30% crecimiento, 20% reservas.`,
        decisionMakingChecklist: [
          '¿Esta decisión aumenta mi apalancamiento?',
          '¿Cumple con mis metas anuales prioritarias?',
          '¿Puede otra persona realizar esta tarea al 80% de calidad?',
        ],
      },
      confidenceScore: 0.93,
    };
  }

  // English fallback default
  return {
    promptVersion: `${PROMPT_VERSION}-deterministic-rule-engine`,
    modelUsed: 'Analytical Engine Rule Set (Offline Resilient Mode)',
    analyzedAt: new Date().toISOString(),
    hookSummary: `If you feel that despite your skill and grit, your revenue encounters an invisible ceiling while every attempt to scale brings operational fatigue, this is not accidental. Your matrix identifies a systemic friction: the expansion drive is constrained by a subconscious mandate for exhaustive personal oversight.`,
    matrixOverview: `Vector profile [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Forms a ${systemMetaphorEn} architecture centered on high-integrity value creation and methodical execution.`,
    financialPotential: `Natural wealth generation operates through extreme reliability, client trust, and structural problem-solving. Scaling unlocks when expertise is translated into standard operating procedures and delegated.`,
    strengths: [
      {
        name: 'Structural Integrity & Execution Rigor',
        structuralBasis: `Reflected in Work Vector V2=${v2} and Scenario V1=${v1}`,
        behavior: 'Deep immersion in product quality and strict contractual compliance.',
        financialEffect: 'Generates high customer retention and pricing power rooted in trust.',
      },
      {
        name: 'Strategic Compounding Discipline',
        structuralBasis: `Reflected in Resource Vector V4=${v4}`,
        behavior: 'Disciplined capital accumulation with multi-year horizon planning.',
        financialEffect: 'Insulates net worth from volatile drawdowns and speculative losses.',
      },
    ],
    limitations: [
      {
        name: 'Perfectionism & Centralized Oversight Bottleneck',
        mechanismOfShadow: 'Hesitation to release unfinished work slows market hypothesis testing.',
        financialRisk: 'Opportunity cost from delayed product deployment and leadership fatigue.',
      },
    ],
    moneyManifestations: [
      {
        domain: 'Monetization & Pricing',
        description: 'Tendency to price services by hours spent rather than economic value delivered.',
      },
      {
        domain: 'Risk Management',
        description: 'Preference for highly predictable, low-volatility investment vehicles.',
      },
      {
        domain: 'Scale & Delegation',
        description: 'Operational bottleneck caused by reluctance to delegate high-standard workflows.',
      },
    ],
    mainInternalConflict: 'Tension between the ambition to build scale and the psychological need for total personal control.',
    mainLever: {
      coreAdjustment: 'Transitioning from "I do everything myself" to "I design systems where excellence is reproducible by others".',
      actionableDirections: [
        'Document and delegate the top 3 repetitive operational routines to recover 10 hours weekly.',
        'Adopt value-based pricing metrics for high-impact deliverables.',
        'Automate mandatory capital allocations into strategic investment reserve vaults.',
      ],
    },
    quickSummary: {
      strongestPotential: 'Building high-trust, resilient enterprise assets and premium services.',
      bottleneck: 'Over-indexing on personal operational control.',
      growthDirection: 'Systematization, operational delegation, and pricing to value.',
    },
    executiveSummary: `Vector Profile [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}] indicates an archetype of ${primaryArchEn}. Subject exhibits a baseline propensity toward structured value creation with a ${
      v4 >= 5 ? 'long-horizon capital allocation strategy' : 'tactical short-cycle liquidity preference'
    }. Intergenerational inputs reflect ${
      layer1.mother && layer1.father ? 'a balanced dual-parental systemic influence' : 'a direct single-lineage baseline model'
    }.`,
    systemicDynamics: {
      intergenerationalPatterns: `Subject's Work Model (V2=${v2}) synthesizes parental total coordinates into an adaptive professional schema. Familial feedback reinforces autonomy while maintaining systemic safety boundaries.`,
      familyResourceFlowFeedback: `Intergenerational resource channels indicate a transition from traditional capital preservation toward modern scalable asset models, with high fidelity in contractual commitments.`,
      systemEquilibriumHypothesis: `The family system stabilizes at moderate risk exposure. Sudden liquidity spikes trigger automated defensive conservation protocols.`,
    },
    behavioralEconomics: {
      mentalAccountingTendency: `Categorizes capital strictly into operational liquidity (V2), opportunistic reserves (V3), and generational asset accumulation (V4).`,
      lossAversionSensitivity: `Exhibits an asymmetric risk profile: high tolerance for strategic venture risks, but elevated aversion to unhedged systemic volatility.`,
      temporalDiscountingProfile: `Demonstrates disciplined delayed gratification with a discount rate optimized for 3-to-7 year compounding horizons.`,
      cognitiveBiasesIdentified: [
        'Status Quo Resistance under extreme market shifts',
        'Confirmation Preference in familiar business models',
        'Endowment Bias regarding self-originated projects',
      ],
    },
    analyticalPsychology: {
      primaryArchetype: primaryArchEn,
      shadowFinancialPattern: `Subconscious hesitation during rapid liquidity realization, stemming from transgenerational frugality directives.`,
      individuationChallenges: `Separating personal self-worth metrics from net asset volatility and achieving psychological sovereignty over peer benchmarks.`,
    },
    actionableStrategy: {
      tacticalAdjustments: [
        'Automate mandatory liquidity sweeps into uncorrelated yield-bearing vaults every 14 days.',
        'Implement an algorithmic 72-hour cooling protocol for unbudgeted allocations exceeding $10,000.',
        'Establish dual-custody authorization for venture and speculative allocations.',
      ],
      riskMitigationProtocols: [
        'Maintain a minimum 9-month operating buffer insulated from market leverage.',
        'Quarterly systematic rebalancing across cash equivalents, index equities, and direct holdings.',
      ],
      resourceAllocationRule: `Allocate capital using a 50/30/20 Vector Allocation Matrix (50% Core Resilient Assets, 30% Strategic Ventures, 20% Liquid Contingency).`,
      decisionMakingChecklist: [
        'Verify downside scenario tolerance: Can the portfolio sustain a 35% drawdown without structural compromise?',
        'Audit emotional state: Is the decision motivated by FOMO or calculated asymmetric upside?',
        'Confirm alignment with V4 Resource Horizon (min 36-month horizon).',
        'Ensure clean legal and operational isolation of liability.',
      ],
    },
    confidenceScore: 0.92,
  };
}
