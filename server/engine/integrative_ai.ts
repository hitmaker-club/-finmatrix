/**
 * 4-Layer Integrative AI Synthesis Engine
 * Integrates:
 * 1. Socionics Profile (Type, Quadra, Result/Process)
 * 2. Financial Matrix (V1-V4 Vectors)
 * 3. Financial Matrix Behavioral Analysis
 * 4. Birthday Archetype (Day marker of theme & pattern)
 *
 * Implements role: "Senior Integrative Behavioral Analyst and Personal Potential Architect"
 */

import { GoogleGenAI, Type } from '@google/genai';
import { Language } from '../../src/i18n/types.js';
import {
  FinancialMatrixLayer1Output,
  FinancialMatrixLayer2Output,
} from '../../src/types/domain.js';
import {
  IntegrativeAnalysisReport,
  SocionicsTestResult,
} from '../../src/types/socionics.js';
import { logger } from '../services/logger.js';
import { getBirthdayArchetypeInfo, FUNCTION_NAMES, SOCIOTYPES_META } from './socionics_engine.js';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateIntegrativeAnalysis(input: {
  subjectName: string;
  birthDate: string;
  layer1Matrix: FinancialMatrixLayer1Output;
  layer2Matrix?: FinancialMatrixLayer2Output;
  socionicsResult: SocionicsTestResult;
  lang?: Language;
}): Promise<IntegrativeAnalysisReport> {
  const lang: Language = input.lang === 'en' || input.lang === 'es' ? input.lang : 'ru';
  const startTimestamp = Date.now();

  // Extract day number from birthDate
  let dayNum = 1;
  const parts = input.birthDate.split(/[-./]/);
  if (parts.length >= 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      dayNum = parseInt(parts[2], 10) || 1;
    } else {
      // DD.MM.YYYY
      dayNum = parseInt(parts[0], 10) || 1;
    }
  }
  const dayArchetype = getBirthdayArchetypeInfo(dayNum);

  const soc = input.socionicsResult;
  const l1 = input.layer1Matrix;
  const l2 = input.layer2Matrix;

  const v1Val = l1.vectors.v1_life_scenario.value;
  const v2Val = l1.vectors.v2_work_model.value;
  const v3Val = l1.vectors.v3_emotional_background.value;
  const v4Val = l1.vectors.v4_resource_management.value;
  const motherTotal = l1.mother ? `${l1.mother.totalReduced}` : 'Н/Д';
  const fatherTotal = l1.father ? `${l1.father.totalReduced}` : 'Н/Д';

  const ai = getGeminiClient();
  if (ai) {
    try {
      logger.info('AI', 'Calling Gemini for 4-Layer Integrative Behavioral Analysis', {
        subjectName: input.subjectName,
        sociotype: soc.sociotype.primary,
        dayNum,
        lang,
      });

      const languageInstruction =
        lang === 'en'
          ? 'Output MUST be strictly in English.'
          : lang === 'es'
          ? 'Output MUST be strictly in Spanish.'
          : 'Вывод строго на русском языке.';

      const systemInstruction = `Ты — Senior Integrative Behavioral Analyst и Personal Potential Architect.
Твоя задача — провести комплексный анализ, который интегрирует четыре независимых слоя данных:
1. Соционический профиль (социотип, квадра, результатник/процессник, иерархия функций)
2. Финансовая матрица (V1-V4 векторы и межпоколенческие связи)
3. Анализ финансовой матрицы (поведенческий отчет, тени, паттерны)
4. Архетип дня рождения (число дня как структурный маркер тем и паттернов, без эзотерики и нумерологии)

ПРАВИЛА АНАЛИЗА:
- Не пересказывай исходные данные — синтезируй их.
- Найди точки напряжения и точки синергии между всеми 4 слоями.
- Формулируй конкретные механизмы, а не абстрактные описания.
- Стиль: строгий, глубокий, психологически точный, без эзотерики и инфобизнесовых штампов.
${languageInstruction}`;

      const userPrompt = `
ДАННЫЕ КЛИЕНТА ДЛЯ ИНТЕГРАЦИИ:

СУБЪЕКТ: ${input.subjectName || 'Клиент'}
ДАТА РОЖДЕНИЯ: ${input.birthDate} (День ${dayNum})

СЛОЙ 1: СОЦИОНИКА
- Социотип: ${soc.sociotype.primary} (${soc.sociotype.nameRu} / ${soc.sociotype.aliasRu})
- Вторичный кандидат: ${soc.sociotype.secondary}
- Квадра: ${soc.quadra.classic} (${soc.quadra.bashkuev})
- Тип мышления: ${soc.result_process.type === 'result' ? 'Результатник' : 'Процессник'}
- Ведущие функции (Топ-3): ${soc.cognitive_profile.top3.map((t) => `${t.func} (${t.score}%)`).join(', ')}
- Слабые функции: ${soc.cognitive_profile.bottom3.map((t) => `${t.func} (${t.score}%)`).join(', ')}
- Согласованность ответов: ${Math.round(soc.validity.consistency_score * 100)}%

СЛОЙ 2: ФИНАНСОВАЯ МАТРИЦА (Layer 1)
- V1 (Базовый потенциал / Жизненный сценарий): ${v1Val} (${l1.vectors.v1_life_scenario.label})
- V2 (Модель труда / Рабочий паттерн): ${v2Val} (${l1.vectors.v2_work_model.label})
- V3 (Отношение к деньгам / Уязвимость): ${v3Val} (${l1.vectors.v3_emotional_background.label})
- V4 (Горизонт планирования / Активы): ${v4Val} (${l1.vectors.v4_resource_management.label})
- Родительский контекст: Мать (${motherTotal}), Отец (${fatherTotal})

СЛОЙ 3: АНАЛИЗ ФИНАНСОВОЙ МАТРИЦЫ (Layer 2)
${
  l2
    ? `
- Архетип капитала: ${l2.analyticalPsychology?.primaryArchetype || l1.vectors.v1_life_scenario.label}
- Главный внутренний конфликт матрицы: ${l2.hookSummary || 'Поведенческий паттерн'}
- Сильные стороны: ${l2.strengths?.map((s) => s.name).join('; ') || 'Базовый потенциал'}
- Теневые риски: ${l2.limitations?.map((s) => s.name).join('; ') || 'Операционные риски'}
`
    : 'Базовый синтез по формуле векторов V1-V4.'
}

СЛОЙ 4: АРХЕТИП ДНЯ РОЖДЕНИЯ (День ${dayNum})
- Архетипическая тема: ${dayArchetype.themeRu} (${dayArchetype.archetypeTitleRu})
- Фокус применения: ${dayArchetype.focus}

СГЕНЕРИРУЙ ОТЧЕТ СТРОГО В ФОРМАТЕ JSON СО СЛЕДУЮЩИМИ 8 РАЗДЕЛАМИ:
1. centralMechanism: Центральный механизм системы (1-2 емких абзаца: как сходятся 4 слоя в один работающий механизм).
2. synergyPoints: Массив из 3-4 точек синергии. Каждая точка содержит:
   - title: Название синергии
   - archetype: Что задает архетип дня ${dayNum}
   - socionics: Как социотип ${soc.sociotype.primary} дает инструмент/процесс
   - matrix: Как матрица (${v1Val}/${v2Val}/${v3Val}/${v4Val}) усиливает это
   - financialManifestation: Финансовое проявление (как это превращается в капитал)
3. conflicts: Массив из 2-3 точек трения. Каждая точка содержит:
   - title: Название конфликта
   - archetypeWant: Чего требует архетип
   - socionicsMatrixDemand: Что диктует социотип/матрица
   - financialConsequence: Финансовое последствие (риск пробуксовки/потери)
4. familyLayer: Семейный слой (как влияние родителей усилило или исказило потенциал этой связки).
5. mainInternalConflict: Главный внутренний конфликт (строгая формула: «Одна часть хочет X, другая требует Y, а среда ждет Z»).
6. mainLever: Главный рычаг изменений:
   - title: Название ключевого рычага
   - behaviorChange: Изменение поведенческого механизма
   - actionableDirections: Массив из 3 конкретных практических шагов
7. socialRoles: Рекомендуемые социальные роли (Массив из 2-3 ролей, каждая содержит: title, essence, whyFits, monetization).
8. quickSummary: Краткий итог:
   - strongestPotential: Сильнейший потенциал
   - bottleneck: Что мешает
   - growthDirection: Что позволит превратить потенциал в масштабные деньги
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
          },
        ],
        config: {
          temperature: 0.25,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              centralMechanism: { type: Type.STRING },
              synergyPoints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    archetype: { type: Type.STRING },
                    socionics: { type: Type.STRING },
                    matrix: { type: Type.STRING },
                    financialManifestation: { type: Type.STRING },
                  },
                  required: ['title', 'archetype', 'socionics', 'matrix', 'financialManifestation'],
                },
              },
              conflicts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    archetypeWant: { type: Type.STRING },
                    socionicsMatrixDemand: { type: Type.STRING },
                    financialConsequence: { type: Type.STRING },
                  },
                  required: ['title', 'archetypeWant', 'socionicsMatrixDemand', 'financialConsequence'],
                },
              },
              familyLayer: { type: Type.STRING },
              mainInternalConflict: { type: Type.STRING },
              mainLever: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  behaviorChange: { type: Type.STRING },
                  actionableDirections: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'behaviorChange', 'actionableDirections'],
              },
              socialRoles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    essence: { type: Type.STRING },
                    whyFits: { type: Type.STRING },
                    monetization: { type: Type.STRING },
                  },
                  required: ['title', 'essence', 'whyFits', 'monetization'],
                },
              },
              quickSummary: {
                type: Type.OBJECT,
                properties: {
                  strongestPotential: { type: Type.STRING },
                  bottleneck: { type: Type.STRING },
                  growthDirection: { type: Type.STRING },
                },
                required: ['strongestPotential', 'bottleneck', 'growthDirection'],
              },
            },
            required: [
              'centralMechanism',
              'synergyPoints',
              'conflicts',
              'familyLayer',
              'mainInternalConflict',
              'mainLever',
              'socialRoles',
              'quickSummary',
            ],
          },
        },
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          promptVersion: '4-Layer-Integrative-v1.0',
          modelUsed: 'gemini-2.5-flash',
          analyzedAt: new Date().toISOString(),
          subjectName: input.subjectName || 'Client',
          birthDate: input.birthDate,
          dayNumber: dayNum,
          dayArchetypeTheme:
            lang === 'en'
              ? `${dayArchetype.archetypeTitleEn} — ${dayArchetype.themeEn}`
              : `${dayArchetype.archetypeTitleRu} — ${dayArchetype.themeRu}`,
          centralMechanism: parsed.centralMechanism,
          synergyPoints: parsed.synergyPoints || [],
          conflicts: parsed.conflicts || [],
          familyLayer: parsed.familyLayer,
          mainInternalConflict: parsed.mainInternalConflict,
          mainLever: parsed.mainLever,
          socialRoles: parsed.socialRoles || [],
          quickSummary: parsed.quickSummary,
          confidenceScore: 0.94,
          language: lang,
        };
      }
    } catch (err: any) {
      logger.warn('AI', 'Gemini integrative synthesis failed, falling back to deterministic synthesis engine', {
        error: err?.message,
      });
    }
  }

  // Deterministic Fallback Engine
  return generateDeterministicIntegrativeReport({
    subjectName: input.subjectName,
    birthDate: input.birthDate,
    dayNum,
    dayArchetype,
    layer1Matrix: l1,
    layer2Matrix: l2,
    socionicsResult: soc,
    lang,
  });
}

function generateDeterministicIntegrativeReport(params: {
  subjectName: string;
  birthDate: string;
  dayNum: number;
  dayArchetype: ReturnType<typeof getBirthdayArchetypeInfo>;
  layer1Matrix: FinancialMatrixLayer1Output;
  layer2Matrix?: FinancialMatrixLayer2Output;
  socionicsResult: SocionicsTestResult;
  lang: Language;
}): IntegrativeAnalysisReport {
  const { subjectName, birthDate, dayNum, dayArchetype, layer1Matrix: l1, layer2Matrix: l2, socionicsResult: soc, lang } = params;
  const isEn = lang === 'en';
  const isEs = lang === 'es';

  const typeMeta = SOCIOTYPES_META[soc.sociotype.primary] || SOCIOTYPES_META.ЛИЭ;
  const v1 = l1.vectors.v1_life_scenario.value;
  const v2 = l1.vectors.v2_work_model.value;
  const v3 = l1.vectors.v3_emotional_background.value;
  const v4 = l1.vectors.v4_resource_management.value;
  const motherTotal = l1.mother ? `${l1.mother.totalReduced}` : 'N/A';
  const fatherTotal = l1.father ? `${l1.father.totalReduced}` : 'N/A';

  if (isEn) {
    return {
      id: `int_det_${Date.now()}`,
      promptVersion: '4-Layer-Deterministic-v1.0',
      modelUsed: 'deterministic-behavioral-engine',
      analyzedAt: new Date().toISOString(),
      subjectName: subjectName || 'Client',
      birthDate,
      dayNumber: dayNum,
      dayArchetypeTheme: `${dayArchetype.archetypeTitleEn} — ${dayArchetype.themeEn}`,
      centralMechanism: `The subject's system operates at the intersection of birthday archetype ${dayArchetype.archetypeTitleEn} (Day ${dayNum}), sociotype ${typeMeta.nameEn} (${typeMeta.quadra} Quadra), and a financial vector profile [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. The core engine converts intuitive ideation into structural capital models, using ${typeMeta.leading} as the primary intake filter and ${typeMeta.creative} as the creative execution mechanism.`,
      synergyPoints: [
        {
          title: 'Strategic Horizon & Vector Alignment',
          archetype: `Day ${dayNum} establishes the fundamental impulse toward ${dayArchetype.themeEn.toLowerCase()}.`,
          socionics: `Sociotype ${typeMeta.code} channels this through high ${typeMeta.leading} mastery and ${typeMeta.orientation} cognitive processing.`,
          matrix: `Financial Vector V1 (${v1}) provides foundational baseline resilience for scale.`,
          financialManifestation: 'Monetization through premium conceptual positioning and scalable system architecture.',
        },
        {
          title: 'Execution Discipline & Resource Mobilization',
          archetype: `Archetype focus on ${dayArchetype.focus.toLowerCase()} demands real-world leverage.`,
          socionics: `${typeMeta.creative} provides the tactical tools to structure and negotiate agreements.`,
          matrix: `V2 (${v2}) and V4 (${v4}) ensure operational continuity and asset preservation.`,
          financialManifestation: 'High-margin advisory or enterprise asset construction with compounding returns.',
        },
      ],
      conflicts: [
        {
          title: 'Autonomy vs. Operational Scale Bottleneck',
          archetypeWant: `Desire for absolute autonomy and rapid initiation without systemic drag.`,
          socionicsMatrixDemand: `Sociotype ${typeMeta.code} and Vector V3 (${v3}) demand rigorous structural risk controls and delegative mechanics.`,
          financialConsequence: 'Leadership fatigue and revenue plateau when personal capacity caps execution speed.',
        },
      ],
      familyLayer: `Intergenerational parental inputs (Mother: ${motherTotal}, Father: ${fatherTotal}) reinforced structural safety patterns, balancing speculative expansion with conservative wealth preservation schemas.`,
      mainInternalConflict: `Formula: One part of the psyche demands radical scale and swift initiative, while another insists on total micro-control over every operational detail.`,
      mainLever: {
        title: 'Transition from Direct Execution to Systems Architecture',
        behaviorChange: 'Shifting from manual operational problem-solving to designing reproducible asset structures.',
        actionableDirections: [
          'Delegate repetitive operational workflows to free up 15 hours weekly for strategic market moves.',
          'Adopt value-based pricing and performance equity models instead of time-based remuneration.',
          'Automate mandatory capital allocations into strategic liquidity reserves.',
        ],
      },
      socialRoles: [
        {
          title: 'Strategic Systems Architect / Venture Lead',
          essence: 'Designing high-trust institutional blueprints and scalable business infrastructure.',
          whyFits: `Perfect match for ${typeMeta.code} leading ${typeMeta.leading} and Day ${dayNum} leadership drive.`,
          monetization: 'Retainer advisory, equity participation, and royalty-based intellectual property licensing.',
        },
        {
          title: 'Managing Partner / Arbitrage Strategist',
          essence: 'Directing asset allocation, optimizing transaction structures, and mitigating systemic risks.',
          whyFits: `Aligns with ${typeMeta.quadra} quadra pragmatism and Vector V4 asset horizon.`,
          monetization: 'Success fees, asset management margins, and enterprise valuation growth.',
        },
      ],
      quickSummary: {
        strongestPotential: `Exceptional capacity to structure complex concepts into high-margin commercial vehicles.`,
        bottleneck: 'Reluctance to release operational micro-control.',
        growthDirection: 'Systematization, team delegation, and asset-backed equity deals.',
      },
      confidenceScore: 0.91,
      language: lang,
    };
  }

  if (isEs) {
    return {
      id: `int_det_${Date.now()}`,
      promptVersion: '4-Layer-Deterministic-v1.0',
      modelUsed: 'deterministic-behavioral-engine',
      analyzedAt: new Date().toISOString(),
      subjectName: subjectName || 'Cliente',
      birthDate,
      dayNumber: dayNum,
      dayArchetypeTheme: `${dayArchetype.archetypeTitleEn} — ${dayArchetype.themeEn}`,
      centralMechanism: `El sistema del sujeto opera en la intersección del arquetipo del día ${dayNum} (${dayArchetype.archetypeTitleEn}), el sociotipo ${typeMeta.nameEn} (Cuadra ${typeMeta.quadra}) y la matriz financiera [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Su motor principal convierte la ideación en estructuras de capital escalables.`,
      synergyPoints: [
        {
          title: 'Alineación Estratégica y Vectores de Capital',
          archetype: `El día ${dayNum} fija el impulso hacia la innovación y liderazgo.`,
          socionics: `El sociotipo ${typeMeta.code} aporta rigor conceptual y procesamiento ${typeMeta.orientation}.`,
          matrix: `El Vector V1 (${v1}) otorga resiliencia basal para proyectos de gran escala.`,
          financialManifestation: 'Monetización mediante posicionamiento conceptual de alto valor y arquitectura de sistemas.',
        },
      ],
      conflicts: [
        {
          title: 'Autonomía vs. Cuello de Botella Operativo',
          archetypeWant: 'Deseo de autonomía total y rápida ejecución sin fricción externa.',
          socionicsMatrixDemand: 'La estructura del sociotipo y el Vector V3 exigen control de riesgos y delegación.',
          financialConsequence: 'Estancamiento en la facturación por sobrecarga de control personal.',
        },
      ],
      familyLayer: `El contexto intergeneracional de los padres (Madre: ${motherTotal}, Padre: ${fatherTotal}) fijó esquemas de preservación y cautela que equilibran la expansión.`,
      mainInternalConflict: `Fórmula: Una parte busca escala radical y nuevas iniciativas, mientras otra exige control absoluto sobre cada detalle operativo.`,
      mainLever: {
        title: 'Transición de la Ejecución Manual a la Arquitectura de Sistemas',
        behaviorChange: 'Pasar de resolver problemas operativos directamente a diseñar sistemas reproducibles.',
        actionableDirections: [
          'Delegar rutinas operativas repetitivas para liberar 15 horas semanales hacia decisiones estratégicas.',
          'Implementar tarifas basadas en valor e impacto en lugar de cobro por horas.',
          'Automatizar reservas de capital en fondos estratégicos de liquidez.',
        ],
      },
      socialRoles: [
        {
          title: 'Arquitecto Estratégico de Sistemas / Líder de Proyectos',
          essence: 'Diseño de modelos de negocio escalables e infraestructura institucional de alta confianza.',
          whyFits: `Alineado con ${typeMeta.code} y el impulso de liderazgo del día ${dayNum}.`,
          monetization: 'Honorarios de asesoría estratégica, participación accionaria y licencias de propiedad intelectual.',
        },
      ],
      quickSummary: {
        strongestPotential: 'Gran capacidad para transformar ideas complejas en activos comerciales rentables.',
        bottleneck: 'Resistencia a soltar el microcontrol operativo.',
        growthDirection: 'Sistematización, delegación y acuerdos basados en patrimonio.',
      },
      confidenceScore: 0.91,
      language: lang,
    };
  }

  // RU Default
  return {
    id: `int_det_${Date.now()}`,
    promptVersion: '4-Layer-Deterministic-v1.0',
    modelUsed: 'deterministic-behavioral-engine',
    analyzedAt: new Date().toISOString(),
    subjectName: subjectName || 'Клиент',
    birthDate,
    dayNumber: dayNum,
    dayArchetypeTheme: `${dayArchetype.archetypeTitleRu} — ${dayArchetype.themeRu}`,
    centralMechanism: `Система субъекта функционирует на стыке архетипа дня рождения «${dayArchetype.archetypeTitleRu}» (День ${dayNum}), соционического профиля ${typeMeta.nameRu} (Квадра ${typeMeta.quadra} / ${typeMeta.bashkuev}) и конфигурации векторов финансовой матрицы [V1=${v1}, V2=${v2}, V3=${v3}, V4=${v4}]. Центральный механизм преобразует концептуальное видение и волевой импульс в структурированные рыночные активы, опираясь на ведущую функцию ${typeMeta.leading} (${FUNCTION_NAMES[typeMeta.leading].ru}) и творческую функцию ${typeMeta.creative} (${FUNCTION_NAMES[typeMeta.creative].ru}).`,
    synergyPoints: [
      {
        title: 'Стратегический горизонт и масштабная инициация',
        archetype: `День ${dayNum} формирует фундаментальный импульс: ${dayArchetype.themeRu.toLowerCase()}.`,
        socionics: `Социотип ${typeMeta.code} переводит этот импульс в системную форму мышления (${typeMeta.orientation === 'result' ? 'Результатник' : 'Процессник'}) и точный выбор момента.`,
        matrix: `Базовый потенциал V1 (${v1}) задает высокий уровень устойчивости при масштабировании замысла.`,
        financialManifestation: 'Премиальное рыночное позиционирование, упаковка уникальных концепций в тиражируемые бизнес-модели.',
      },
      {
        title: 'Энергия исполнения и капитализация преимуществ',
        archetype: `Фокус дня «${dayArchetype.focus}» требует осязаемых результатов и признания.`,
        socionics: `Творческая функция ${typeMeta.creative} обеспечивает инструментальный инструментарий переговоров и структурирования сделок.`,
        matrix: `Рабочий паттерн V2 (${v2}) и горизонт V4 (${v4}) гарантируют непрерывность воспроизводства капитала.`,
        financialManifestation: 'Создание активов с высокой маржинальностью и устойчивым притоком дивидендов.',
      },
      {
        title: 'Устойчивость к рыночной турбулентности',
        archetype: `Архетипическая опора дает психологическую стойкость в периоды неопределенности.`,
        socionics: `Квадральные ценности (${typeMeta.quadra}) отсекают неэффективные эмоциональные затраты.`,
        matrix: `Вектор V3 (${v3}) удерживает баланс между рискованными аллокациями и защитными резервами.`,
        financialManifestation: 'Сохранение капитала и защита ключевых активов при кризисных фазах рынка.',
      },
    ],
    conflicts: [
      {
        title: 'Трение между автономным импульсом и операционным контролем',
        archetypeWant: `Архетип дня требует скорости, полной свободы маневра и первопроходческого лидерства.`,
        socionicsMatrixDemand: `Социотип ${typeMeta.code} и вектор V3 требуют безупречной структуры, перепроверки данных и контроля каждого узла.`,
        financialConsequence: 'Операционное выгорание и искусственный потолок выручки из-за нежелания передать рутину ассистентам.',
      },
      {
        title: 'Конфликт между масштабом видения и текущей ликвидностью',
        archetypeWant: `Стремление запускать глобальные, ресурсоемкие проекты с многолетним горизонтом.`,
        socionicsMatrixDemand: `Потребность в гарантированной безопасности создает тревогу при временных просадках кассового потока.`,
        financialConsequence: 'Замораживание ликвидности в незавершенных проектах или упущенная выгода от избыточной осторожности.',
      },
    ],
    familyLayer: `Межпоколенческие координаты родителей (Мать: ${motherTotal}, Отец: ${fatherTotal}) закрепили сценарий высокой личной ответственности и осмотрительности в отношении долгов. Это служит мощным стабилизатором от импульсивных авантюр, но одновременно требует сознательного преодоления семейного запрета на «легкие и быстрые деньги».`,
    mainInternalConflict: `«Одна часть меня стремится к масштабному рыночному доминированию и радикальной автономии, другая требует тотального микроконтроля над всеми процессами, а окружающая среда ждет делегирования и построения партнерской команды».`,
    mainLever: {
      title: 'Переход от прямого ручного труда к архитектуре автономных систем',
      behaviorChange: 'Замена убеждения «Если хочешь сделать хорошо — сделай сам» на модель «Я проектирую надежные регламенты и среду, где обученные люди воспроизводят стандарты качества».',
      actionableDirections: [
        'Оцифровать и делегировать 3 ключевые повторяющиеся операционные функции, высвободив не менее 12 часов в неделю для стратегических партнерств.',
        'Внедрить ценностное ценообразование (Value-based Pricing) и долевые механизмы (Success Fee / Equity) вместо фиксированной оплаты за затраченное время.',
        'Автоматизировать распределение доходов: фиксированные 20% маржи направлять в защищенный стратегический инвест-фонд с запретом на вывод в течение 36 месяцев.',
      ],
    },
    socialRoles: [
      {
        title: 'Стратегический Архитектор / Главный Визионер Проекта',
        essence: 'Формирование концептуальной архитектуры, определение долгосрочных векторов и упаковка ключевых смыслов.',
        whyFits: `Идеальное соответствие ведущей функции ${typeMeta.leading} социотипа ${typeMeta.code} и архетипическому импульсу дня ${dayNum}.`,
        monetization: 'Стратегический консалтинг высокой стоимости, доля в прибыли (Equity), роялти от интеллектуальной собственности.',
      },
      {
        title: 'Управляющий Партнер / Директор по Развитию и Сделкам',
        essence: 'Ведение ключевых переговоров, привлечение капиталов и структурирование сложных альянсов.',
        whyFits: `Опирается на творческую функцию ${typeMeta.creative} и квадру ${typeMeta.quadra} (${typeMeta.bashkuev}).`,
        monetization: 'Процент от закрытых масштабных сделок, дивиденды от совместных предприятий, опционные пулы.',
      },
      {
        title: 'Архитектор Методологий и Системных Решений',
        essence: 'Создание замкнутых технологических и управленческих экосистем с высокой добавленной стоимостью.',
        whyFits: `Синхронизировано с горизонтом планирования V4 (${v4}) и аналитической точностью модели.`,
        monetization: 'Продажа франшиз, лицензирование методологий, создание закрытых клубов/синдикатов.',
      },
    ],
    quickSummary: {
      strongestPotential: `Уникальная способность синтезировать масштабное визионерское видение в жизнеспособные, высокомаржинальные системные структуры.`,
      bottleneck: 'Попытка удерживать все операционные рычаги в личных руках из-за недоверия к автономности команды.',
      growthDirection: 'Переход в роль системного архитектора, масштабирование через сильных управляющих и монетизация ценности, а не личного времени.',
    },
    confidenceScore: 0.92,
    language: lang,
  };
}
