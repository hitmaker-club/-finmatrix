/**
 * Socionics Diagnostic Math Engine & Archetype Dictionary
 * Deterministic scoring, Model A function mapping, quadra determination,
 * mirror-pair validation, and birthday archetype resolution.
 */

import {
  CognitiveFunction,
  OptionKey,
  QuadraType,
  BashkuevQuadraType,
  SociotypeCode,
  SocionicsContradiction,
  SocionicsTestResult,
  EnergyDiagnosticsResult,
} from '../../src/types/socionics.js';
import { SOCIONICS_DIAGNOSTIC_WEIGHTS, SOCIONICS_SCREENS } from './socionics_data.js';
import { evaluateEnergyEfficiency } from './energy_efficiency_data.js';

export interface SociotypeMeta {
  code: SociotypeCode;
  nameRu: string;
  nameEn: string;
  aliasRu: string;
  aliasEn: string;
  quadra: QuadraType;
  bashkuev: BashkuevQuadraType;
  orientation: 'result' | 'process';
  leading: CognitiveFunction;
  creative: CognitiveFunction;
  role: CognitiveFunction;
  painful: CognitiveFunction;
  descriptionRu: string;
  descriptionEn: string;
}

export const SOCIOTYPES_META: Record<SociotypeCode, SociotypeMeta> = {
  ИЛЭ: {
    code: 'ИЛЭ',
    nameRu: 'Искатель (Дон Кихот)',
    nameEn: 'Seeker (ENTp)',
    aliasRu: 'Интуитивно-логический экстраверт',
    aliasEn: 'Intuitive Logical Extravert',
    quadra: 'Альфа',
    bashkuev: 'Духовники',
    orientation: 'process',
    leading: 'ЧИ',
    creative: 'ЧЛ',
    role: 'БЭ',
    painful: 'БС',
    descriptionRu: 'Генератор концептуальных идей, визионер возможностей.',
    descriptionEn: 'Visionary concept generator, possibility explorer.',
  },
  ЛИИ: {
    code: 'ЛИИ',
    nameRu: 'Аналитик (Робеспьер)',
    nameEn: 'Analyst (INTj)',
    aliasRu: 'Логико-интуитивный интроверт',
    aliasEn: 'Logical Intuitive Introvert',
    quadra: 'Альфа',
    bashkuev: 'Духовники',
    orientation: 'result',
    leading: 'БЛ',
    creative: 'ЧИ',
    role: 'БС',
    painful: 'ЧЭ',
    descriptionRu: 'Архитектор строгих систем, объективной логики.',
    descriptionEn: 'Architect of rigorous structural models, objective logic.',
  },
  ЭСЭ: {
    code: 'ЭСЭ',
    nameRu: 'Энтузиаст (Гюго)',
    nameEn: 'Enthusiast (ESFj)',
    aliasRu: 'Этико-сенсорный экстраверт',
    aliasEn: 'Ethical Sensory Extravert',
    quadra: 'Альфа',
    bashkuev: 'Духовники',
    orientation: 'process',
    leading: 'ЧЭ',
    creative: 'БС',
    role: 'ЧИ',
    painful: 'БЛ',
    descriptionRu: 'Мастер эмоционального воодушевления и уюта.',
    descriptionEn: 'Master of uplifting emotional resonance and comfort.',
  },
  СЭИ: {
    code: 'СЭИ',
    nameRu: 'Посредник (Дюма)',
    nameEn: 'Mediator (ISFp)',
    aliasRu: 'Сенсорно-этический интроверт',
    aliasEn: 'Sensory Ethical Introvert',
    quadra: 'Альфа',
    bashkuev: 'Духовники',
    orientation: 'result',
    leading: 'БС',
    creative: 'ЧЭ',
    role: 'БЛ',
    painful: 'ЧИ',
    descriptionRu: 'Творец физической гармонии и душевного спокойствия.',
    descriptionEn: 'Creator of physical harmony and interpersonal warmth.',
  },

  СЛЭ: {
    code: 'СЛЭ',
    nameRu: 'Маршал (Жуков)',
    nameEn: 'Marshal (ESTp)',
    aliasRu: 'Сенсорно-логический экстраверт',
    aliasEn: 'Sensory Logical Extravert',
    quadra: 'Бета',
    bashkuev: 'Аристократы',
    orientation: 'process',
    leading: 'ЧС',
    creative: 'БЛ',
    role: 'ЧЭ',
    painful: 'БИ',
    descriptionRu: 'Волевой стратег захвата пространства и управления ресурсами.',
    descriptionEn: 'Resolute commander of expansion and tactical leverage.',
  },
  ИЭИ: {
    code: 'ИЭИ',
    nameRu: 'Лирик (Есенин)',
    nameEn: 'Lyricist (INFp)',
    aliasRu: 'Интуитивно-этический интроверт',
    aliasEn: 'Intuitive Ethical Introvert',
    quadra: 'Бета',
    bashkuev: 'Аристократы',
    orientation: 'result',
    leading: 'БИ',
    creative: 'ЧЭ',
    role: 'БС',
    painful: 'ЧЛ',
    descriptionRu: 'Провидец временных ритмов и тонких душевных состояний.',
    descriptionEn: 'Visionary of temporal currents and emotional subtleties.',
  },
  ЛСИ: {
    code: 'ЛСИ',
    nameRu: 'Инспектор (Максим Горький)',
    nameEn: 'Inspector (ISTj)',
    aliasRu: 'Логико-сенсорный интроверт',
    aliasEn: 'Logical Sensory Introvert',
    quadra: 'Бета',
    bashkuev: 'Аристократы',
    orientation: 'process',
    leading: 'БЛ',
    creative: 'ЧС',
    role: 'БЭ',
    painful: 'БИ',
    descriptionRu: 'Хранитель дисциплины, регламентов и структурной надежности.',
    descriptionEn: 'Guardian of ironclad discipline and hierarchical structure.',
  },
  ЭИЭ: {
    code: 'ЭИЭ',
    nameRu: 'Наставник (Гамлет)',
    nameEn: 'Mentor (ENFj)',
    aliasRu: 'Этико-интуитивный экстраверт',
    aliasEn: 'Ethical Intuitive Extravert',
    quadra: 'Бета',
    bashkuev: 'Аристократы',
    orientation: 'result',
    leading: 'ЧЭ',
    creative: 'БИ',
    role: 'ЧС',
    painful: 'БС',
    descriptionRu: 'Драматический лидер и трансформатор духа коллектива.',
    descriptionEn: 'Charismatic ideologue and dramatic mobilizer.',
  },

  СЭЭ: {
    code: 'СЭЭ',
    nameRu: 'Политик (Наполеон)',
    nameEn: 'Ambassador (ESFp)',
    aliasRu: 'Сенсорно-этический экстраверт',
    aliasEn: 'Sensory Ethical Extravert',
    quadra: 'Гамма',
    bashkuev: 'Купцы/Ремесленники',
    orientation: 'process',
    leading: 'ЧС',
    creative: 'ЧЛ',
    role: 'БЭ',
    painful: 'БИ',
    descriptionRu: 'Лидер личного влияния, дипломатического маневра и престижа.',
    descriptionEn: 'Dynamic leader of personal leverage and social maneuvering.',
  },
  ИЛИ: {
    code: 'ИЛИ',
    nameRu: 'Критик (Бальзак)',
    nameEn: 'Critic (INTp)',
    aliasRu: 'Интуитивно-логический интроверт',
    aliasEn: 'Intuitive Logical Introvert',
    quadra: 'Гамма',
    bashkuev: 'Купцы/Ремесленники',
    orientation: 'result',
    leading: 'БИ',
    creative: 'ЧЛ',
    role: 'БС',
    painful: 'ЧЭ',
    descriptionRu: 'Стратегический прогнозист и мастер оценки рисков.',
    descriptionEn: 'Strategic forecaster and master of risk evaluation.',
  },
  ЛИЭ: {
    code: 'ЛИЭ',
    nameRu: 'Предприниматель (Джек Лондон)',
    nameEn: 'Entrepreneur (ENTj)',
    aliasRu: 'Логико-интуитивный экстраверт',
    aliasEn: 'Logical Intuitive Extravert',
    quadra: 'Гамма',
    bashkuev: 'Купцы/Ремесленники',
    orientation: 'process',
    leading: 'ЧЛ',
    creative: 'БИ',
    role: 'ЧЭ',
    painful: 'БС',
    descriptionRu: 'Пионер бизнес-инноваций и динамичный строитель капитала.',
    descriptionEn: 'Pioneer of business innovation and dynamic enterprise.',
  },
  ЭСИ: {
    code: 'ЭСИ',
    nameRu: 'Хранитель (Драйзер)',
    nameEn: 'Guardian (ISFj)',
    aliasRu: 'Этико-сенсорный интроверт',
    aliasEn: 'Ethical Sensory Introvert',
    quadra: 'Гамма',
    bashkuev: 'Купцы/Ремесленники',
    orientation: 'result',
    leading: 'БЭ',
    creative: 'ЧС',
    role: 'БИ',
    painful: 'ЧЛ',
    descriptionRu: 'Защитник этических принципов и верности договоренностям.',
    descriptionEn: 'Protector of ethical standards and contractual loyalty.',
  },

  ЛСЭ: {
    code: 'ЛСЭ',
    nameRu: 'Администратор (Штирлиц)',
    nameEn: 'Administrator (ESTj)',
    aliasRu: 'Логико-сенсорный экстраверт',
    aliasEn: 'Logical Sensory Extravert',
    quadra: 'Дельта',
    bashkuev: 'Крестьяне',
    orientation: 'process',
    leading: 'ЧЛ',
    creative: 'БС',
    role: 'ЧЭ',
    painful: 'БИ',
    descriptionRu: 'Организатор производственного качества и надежности.',
    descriptionEn: 'Master of operational excellence and work culture.',
  },
  СЛИ: {
    code: 'СЛИ',
    nameRu: 'Мастер (Габен)',
    nameEn: 'Craftsman (ISTp)',
    aliasRu: 'Сенсорно-логический интроверт',
    aliasEn: 'Sensory Logical Introvert',
    quadra: 'Дельта',
    bashkuev: 'Крестьяне',
    orientation: 'result',
    leading: 'БС',
    creative: 'ЧЛ',
    role: 'БИ',
    painful: 'ЧЭ',
    descriptionRu: 'Виртуоз прикладного мастерства и технологической точности.',
    descriptionEn: 'Virtuoso of practical craftsmanship and technological precision.',
  },
  ИЭЭ: {
    code: 'ИЭЭ',
    nameRu: 'Советчик (Гексли)',
    nameEn: 'Advisor (ENFp)',
    aliasRu: 'Интуитивно-этический экстраверт',
    aliasEn: 'Intuitive Ethical Extravert',
    quadra: 'Дельта',
    bashkuev: 'Крестьяне',
    orientation: 'process',
    leading: 'ЧИ',
    creative: 'БЭ',
    role: 'ЧЛ',
    painful: 'БС',
    descriptionRu: 'Катализатор талантов и вдохновляющий дипломат.',
    descriptionEn: 'Catalyst of human potential and empathetic diplomat.',
  },
  ЭИИ: {
    code: 'ЭИИ',
    nameRu: 'Гуманист (Достоевский)',
    nameEn: 'Humanist (INFj)',
    aliasRu: 'Этико-интуитивный интроверт',
    aliasEn: 'Ethical Intuitive Introvert',
    quadra: 'Дельта',
    bashkuev: 'Крестьяне',
    orientation: 'result',
    leading: 'БЭ',
    creative: 'ЧИ',
    role: 'БС',
    painful: 'ЧС',
    descriptionRu: 'Носитель нравственной мудрости и психологического исцеления.',
    descriptionEn: 'Bearer of profound moral wisdom and spiritual guidance.',
  },
};

export const FUNCTION_NAMES: Record<CognitiveFunction, { ru: string; en: string; aspect: string }> = {
  ЧИ: { ru: 'Черная Интуиция (Интуиция возможностей)', en: 'Extraverted Intuition (Ne)', aspect: 'Потенциалы, скрытые шансы, новые идеи' },
  БИ: { ru: 'Белая Интуиция (Интуиция времени)', en: 'Introverted Intuition (Ni)', aspect: 'Тренды, развитие во времени, своевременность' },
  ЧЛ: { ru: 'Черная Логика (Деловая логика)', en: 'Extraverted Logic (Te)', aspect: 'Эффективность, факты, выгода, алгоритмы' },
  БЛ: { ru: 'Белая Логика (Структурная логика)', en: 'Introverted Logic (Ti)', aspect: 'Системы, законы, классификации, порядок' },
  ЧЭ: { ru: 'Черная Этика (Этика эмоций)', en: 'Extraverted Ethics (Fe)', aspect: 'Эмоциональный климат, драйв, воодушевление' },
  БЭ: { ru: 'Белая Этика (Этика отношений)', en: 'Introverted Ethics (Fi)', aspect: 'Межличностные связи, мораль, доверие' },
  ЧС: { ru: 'Черная Сенсорика (Волевая сенсорика)', en: 'Extraverted Sensing (Se)', aspect: 'Власть, статус, преодоление, границы' },
  БС: { ru: 'Белая Сенсорика (Сенсорика ощущений)', en: 'Introverted Sensing (Si)', aspect: 'Комфорт, здоровье, телесный уют, эстетика' },
};

// Mirror pairs for validation
const MIRROR_PAIRS: Array<{ pair: [number, number]; descRu: string; descEn: string }> = [
  { pair: [9, 22], descRu: 'Отношение к незавершенным делам и брошенным процессам', descEn: 'Attitude toward unfinished tasks and open loops' },
  { pair: [7, 23], descRu: 'Поведение в принципиальных спорах и конфронтациях', descEn: 'Behavior in high-stakes ideological disputes' },
  { pair: [3, 24], descRu: 'Реакция на внезапную ломку планов и смену курса', descEn: 'Reaction to abrupt plan disruptions' },
  { pair: [16, 17], descRu: 'Симметрия реакции на чужие и собственные ошибки', descEn: 'Symmetry of reactions to others vs own errors' },
  { pair: [18, 19], descRu: 'Базовые мотивы при отсутствии внешнего социального контроля', descEn: 'Baseline drives under zero external observation' },
];

export const BIRTHDAY_ARCHETYPES: Record<number, { themeRu: string; themeEn: string; archetypeTitleRu: string; archetypeTitleEn: string; focus: string }> = {
  1: { themeRu: 'Инициация, первопроходчество, импульс лидерства', themeEn: 'Initiation, pioneering, primal leadership drive', archetypeTitleRu: 'Первопроходец', archetypeTitleEn: 'Pioneer', focus: 'Запуск новых автономных направлений' },
  2: { themeRu: 'Дипломатия, партнерство, баланс противоположностей', themeEn: 'Diplomacy, partnership, dual equilibrium', archetypeTitleRu: 'Дипломат-Связующий', archetypeTitleEn: 'Diplomat', focus: 'Создание симбиозов и переговорных союзов' },
  3: { themeRu: 'Экспрессия, созидание, расширение и плодовитость', themeEn: 'Expression, creation, expansion, and fruitfulness', archetypeTitleRu: 'Творец-Созидатель', archetypeTitleEn: 'Creator', focus: 'Трансляция смыслов и масштабирование проектов' },
  4: { themeRu: 'Фундамент, порядок, материализация и дисциплина', themeEn: 'Foundation, structural order, tangible execution', archetypeTitleRu: 'Архитектор Формы', archetypeTitleEn: 'Architect of Form', focus: 'Построение устойчивых институциональных опор' },
  5: { themeRu: 'Свобода, трансформация, адаптивность и движение', themeEn: 'Liberty, transformation, dynamic versatility', archetypeTitleRu: 'Катализатор Перемен', archetypeTitleEn: 'Catalyst of Change', focus: 'Снятие устаревших ограничений и гибкость' },
  6: { themeRu: 'Гармония, ценность выбора, служение и красота', themeEn: 'Harmony, value-based choice, stewardship, beauty', archetypeTitleRu: 'Хранитель Гармонии', archetypeTitleEn: 'Guardian of Harmony', focus: 'Эстетическое и этическое совершенствование среды' },
  7: { themeRu: 'Глубокий поиск, мастерство, аналитика и автономия', themeEn: 'Deep inquiry, mastery, intellectual sovereignty', archetypeTitleRu: 'Исследователь-Мудрец', archetypeTitleEn: 'Seeker-Sage', focus: 'Вскрытие неочевидных первопричин и экспертность' },
  8: { themeRu: 'Материальная сила, масштаб, закон и управление капиталом', themeEn: 'Material power, scale, governance, compounding', archetypeTitleRu: 'Властелин Ресурсов', archetypeTitleEn: 'Master of Capital', focus: 'Управление большими ресурсными потоками' },
  9: { themeRu: 'Завершение циклов, глобальный гуманизм, синтез', themeEn: 'Cycle completion, global vision, integration', archetypeTitleRu: 'Интегратор Смыслов', archetypeTitleEn: 'Global Integrator', focus: 'Обобщение опыта и выведение на новый уровень' },
  10: { themeRu: 'Поток удачи, цикличность, визионерский маневр', themeEn: 'Flow of opportunity, cycles, visionary agility', archetypeTitleRu: 'Навигатор Потока', archetypeTitleEn: 'Navigator of Flow', focus: 'Точное попадание в рыночные тренды и окна шансов' },
  11: { themeRu: 'Внутренняя энергия, преодоление, несгибаемая воля', themeEn: 'Intense internal energy, endurance, sovereign will', archetypeTitleRu: 'Проводник Силы', archetypeTitleEn: 'Channel of Force', focus: 'Выдерживание экстремальных перегрузок' },
  12: { themeRu: 'Альтернативный угол зрения, служение, эмпатия', themeEn: 'Alternative perspective, empathy, service', archetypeTitleRu: 'Мастер Инверсии', archetypeTitleEn: 'Master of Inversion', focus: 'Видение неочевидных решений там, где все видят тупик' },
  13: { themeRu: 'Радикальная перестройка, отсечение лишнего, возрождение', themeEn: 'Radical restructuring, elimination, rebirth', archetypeTitleRu: 'Реформатор Систем', archetypeTitleEn: 'Systemic Reformer', focus: 'Трансформация кризисов в качественный скачок' },
  14: { themeRu: 'Мера, умеренность, алхимия синтеза и терпение', themeEn: 'Golden mean, moderation, synthesis alchemy', archetypeTitleRu: 'Алхимик Баланса', archetypeTitleEn: 'Alchemist of Balance', focus: 'Тонкая настройка пропорций и устойчивый рост' },
  15: { themeRu: 'Харизма, материальные страсти, работа с теневой энергией', themeEn: 'Magnetic charisma, material drives, shadow power', archetypeTitleRu: 'Маг Влияния', archetypeTitleEn: 'Master of Leverage', focus: 'Монетизация скрытых желаний и энергетический драйв' },
  16: { themeRu: 'Прорыв, разрушение иллюзий, мгновенное переформатирование', themeEn: 'Breakthrough, dismantling illusions, sudden pivot', archetypeTitleRu: 'Зодчий Перелома', archetypeTitleEn: 'Architect of Breakthrough', focus: 'Быстрое восстановление после системных шоков' },
  17: { themeRu: 'Звездность, признание, вдохновение и уникальный талант', themeEn: 'Prominence, public recognition, unique talent', archetypeTitleRu: 'Путеводная Звезда', archetypeTitleEn: 'Guiding Light', focus: 'Публичное сияние, персональный бренд и миссия' },
  18: { themeRu: 'Глубинные образы, интуиция, тайное знание и воображение', themeEn: 'Deep subconscious imagery, intuition, subtle perception', archetypeTitleRu: 'Провидец Глубин', archetypeTitleEn: 'Visionary of Depths', focus: 'Работа с психологией, образами и скрытыми течениями' },
  19: { themeRu: 'Солнечная витальность, масштабное лидерство, проявленность', themeEn: 'Solar vitality, large-scale leadership, public presence', archetypeTitleRu: 'Солнечный Лидер', archetypeTitleEn: 'Solar Leader', focus: 'Щедрое созидание масштабных публичных систем' },
  20: { themeRu: 'Родовая преемственность, пробуждение, связь поколений', themeEn: 'Intergenerational continuity, awakening, ancestral roots', archetypeTitleRu: 'Хранитель Преемственности', archetypeTitleEn: 'Keeper of Heritage', focus: 'Интеграция опыта предков и укрепление клана' },
  21: { themeRu: 'Глобальные границы, международный масштаб, расширение мира', themeEn: 'Global horizons, international scale, cosmopolitan scope', archetypeTitleRu: 'Человек Мира', archetypeTitleEn: 'Cosmopolitan Visionary', focus: 'Масштабирование без географических ограничений' },
  22: { themeRu: 'Абсолютная свобода, игра, выход за рамки догм', themeEn: 'Total freedom, playful exploration, unburdened presence', archetypeTitleRu: 'Вольный Путник', archetypeTitleEn: 'Free Spirit', focus: 'Легкость маневра и способность начать с чистого листа' },
  23: { themeRu: 'Синтез коммуникации и структуры, гибкий интеллект', themeEn: 'Synthesis of communication and structural intellect', archetypeTitleRu: 'Интеллектуальный Стратег', archetypeTitleEn: 'Intellectual Strategist', focus: 'Скоростная обработка информации и переговоры' },
  24: { themeRu: 'Забота о безопасности, гармония созидания и уюта', themeEn: 'Protective care, harmonious crafting, sustainable comfort', archetypeTitleRu: 'Хранитель Устойчивости', archetypeTitleEn: 'Guardian of Stability', focus: 'Создание надежной экологичной среды для жизни' },
  25: { themeRu: 'Интеллектуальная глубина, поиск совершенных моделей', themeEn: 'Intellectual depth, quest for refined perfection', archetypeTitleRu: 'Философ Формул', archetypeTitleEn: 'Philosopher of Models', focus: 'Разработка фундаментальных алгоритмов и законов' },
  26: { themeRu: 'Практическая реализация больших замыслов, организатор', themeEn: 'Practical execution of grand blueprints, executive power', archetypeTitleRu: 'Организатор Масштаба', archetypeTitleEn: 'Grand Organizer', focus: 'Воплощение концепций в работающие корпорации' },
  27: { themeRu: 'Служение гуманизму, просвещение, щедрая отдача', themeEn: 'Enlightenment, humanistic mentorship, broad contribution', archetypeTitleRu: 'Просветитель', archetypeTitleEn: 'Enlightener', focus: 'Передача знаний и улучшение жизни общества' },
  28: { themeRu: 'Осознание циклов партнерства, надежность союзов', themeEn: 'Mastery of partnership cycles, contract resilience', archetypeTitleRu: 'Созидатель Альянсов', archetypeTitleEn: 'Alliance Builder', focus: 'Формирование долгосрочных стратегических коалиций' },
  29: { themeRu: 'Высокая интуиция возможностей, тонкая дипломатия', themeEn: 'High intuitive potential, nuanced diplomacy and talent', archetypeTitleRu: 'Интуитивный Мастер', archetypeTitleEn: 'Intuitive Craftsman', focus: 'Объединение разнородных талантов вокруг идеи' },
  30: { themeRu: 'Ясность выражения, экспрессия масштаба, оптимизм', themeEn: 'Clarity of expression, expansive optimism, vital drive', archetypeTitleRu: 'Голос Масштаба', archetypeTitleEn: 'Voice of Scale', focus: 'Вдохновляющее руководство и объединение людей' },
  31: { themeRu: 'Основательность замысла, прагматичная материализация', themeEn: 'Thoroughness of vision, pragmatic material grounding', archetypeTitleRu: 'Основатель Долговечного', archetypeTitleEn: 'Foundational Builder', focus: 'Создание активов с запасом прочности на десятилетия' },
};

export function getBirthdayArchetypeInfo(day: number) {
  const normalizedDay = Math.max(1, Math.min(31, isNaN(day) ? 1 : day));
  return BIRTHDAY_ARCHETYPES[normalizedDay] || BIRTHDAY_ARCHETYPES[1];
}

export function evaluateSocionicsTest(
  answers: Record<number, OptionKey>,
  energyAnswers?: Record<number, OptionKey>
): SocionicsTestResult {
  const rawFunctions: Record<CognitiveFunction, number> = {
    ЧИ: 0,
    БИ: 0,
    ЧЛ: 0,
    БЛ: 0,
    ЧЭ: 0,
    БЭ: 0,
    ЧС: 0,
    БС: 0,
  };

  let resultScore = 0;
  let processScore = 0;

  for (let i = 1; i <= 30; i++) {
    const chosenOption = answers[i] || 'A';
    const weightMap = SOCIONICS_DIAGNOSTIC_WEIGHTS[i]?.[chosenOption];
    if (weightMap) {
      rawFunctions.ЧИ += weightMap.ЧИ || 0;
      rawFunctions.БИ += weightMap.БИ || 0;
      rawFunctions.ЧЛ += weightMap.ЧЛ || 0;
      rawFunctions.БЛ += weightMap.БЛ || 0;
      rawFunctions.ЧЭ += weightMap.ЧЭ || 0;
      rawFunctions.БЭ += weightMap.БЭ || 0;
      rawFunctions.ЧС += weightMap.ЧС || 0;
      rawFunctions.БС += weightMap.БС || 0;
      resultScore += weightMap.result || 0;
      processScore += weightMap.process || 0;
    }
  }

  // Normalize functions to 0..100
  const maxFuncVal = Math.max(...Object.values(rawFunctions), 1);
  const normalizedFunctions: Record<CognitiveFunction, number> = {} as any;
  for (const k of Object.keys(rawFunctions) as CognitiveFunction[]) {
    normalizedFunctions[k] = Math.round((rawFunctions[k] / maxFuncVal) * 100);
  }

  // Sort functions
  const sortedFunctions = (Object.keys(rawFunctions) as CognitiveFunction[])
    .map((func) => ({
      func,
      score: normalizedFunctions[func],
      label: FUNCTION_NAMES[func].ru,
    }))
    .sort((a, b) => b.score - a.score);

  const top3 = sortedFunctions.slice(0, 3);
  const bottom3 = sortedFunctions.slice(-3).reverse();

  // Score each of 16 sociotypes based strictly on Model A formula WITH PENALTY
  const sociotypeScores: Array<{ code: SociotypeCode; score: number }> = [];

  // Получаем названия Топ-3 функций пользователя для проверки
  const top3FunctionNames = sortedFunctions.slice(0, 3).map((f) => f.func);

  for (const meta of Object.values(SOCIOTYPES_META)) {
    const leadScore = normalizedFunctions[meta.leading] || 0;
    const creatScore = normalizedFunctions[meta.creative] || 0;
    const roleScore = normalizedFunctions[meta.role] || 0;

    // ШТРАФ ЗА БОЛЕВУЮ ФУНКЦИЮ (Согласно ТЗ)
    let vulnerablePenalty = 0;
    if (top3FunctionNames.includes(meta.painful)) {
      vulnerablePenalty = 15; // Вычитаем 15 баллов, если болевая функция в Топ-3
    }

    const typeScore = 1.0 * leadScore + 0.8 * creatScore + 0.3 * roleScore - vulnerablePenalty;
    sociotypeScores.push({ code: meta.code, score: Math.round(typeScore * 10) / 10 });
  }

  sociotypeScores.sort((a, b) => b.score - a.score);

  const primaryCode = sociotypeScores[0]?.code || 'ЛИЭ';
  const secondaryCode = sociotypeScores[1]?.code || 'ИЛИ';
  const primaryMeta = SOCIOTYPES_META[primaryCode];

  // Quadra determination
  const classicQuadra = primaryMeta.quadra;
  const bashkuevQuadra = primaryMeta.bashkuev;

  const quadraDescriptions = {
    Альфа: {
      ru: 'Квадра познания, фундаментальных идей, открытости и интеллектуальной свободы (Духовники).',
      en: 'Quadra of open inquiry, fundamental discovery, and intellectual liberty.',
      es: 'Cuadra de exploración abierta, ideas fundamentales y libertad intelectual.',
    },
    Бета: {
      ru: 'Квадра воли, стратегического масштаба, идеологии, дисциплины и иерархии (Аристократы).',
      en: 'Quadra of sovereign will, strategic scale, ideological mission, and hierarchy.',
      es: 'Cuadra de voluntad estratégica, ideología, disciplina y jerarquía sólida.',
    },
    Гамма: {
      ru: 'Квадра свободного предпринимательства, капитала, прагматизма и динамичных рынков (Купцы/Ремесленники).',
      en: 'Quadra of free enterprise, capital accumulation, pragmatic ROI, and dynamic markets.',
      es: 'Cuadra de libre empresa, capitalización, pragmatismo y dinamismo comercial.',
    },
    Дельта: {
      ru: 'Квадра непревзойденного качества жизни, мастерства, экологии и гуманизма (Крестьяне-Мастера).',
      en: 'Quadra of supreme craftsmanship, quality of life, sustainability, and humanism.',
      es: 'Cuadra de maestría artesanal, calidad de vida, sostenibilidad y humanismo.',
    },
  };

  // Orientation
  const orientationType = resultScore >= processScore ? 'result' : 'process';
  const orientationConfidence = Math.min(
    0.95,
    Math.max(0.65, 0.5 + Math.abs(resultScore - processScore) / 25)
  );

  // Validation & Mirror Pairs
  const contradictions: SocionicsContradiction[] = [];
  for (const mp of MIRROR_PAIRS) {
    const ans1 = answers[mp.pair[0]];
    const ans2 = answers[mp.pair[1]];
    if (ans1 && ans2) {
      // Check if options diverge drastically (e.g. A vs B on discipline/ideology)
      const w1 = SOCIONICS_DIAGNOSTIC_WEIGHTS[mp.pair[0]]?.[ans1];
      const w2 = SOCIONICS_DIAGNOSTIC_WEIGHTS[mp.pair[1]]?.[ans2];
      if (w1 && w2) {
        // Measure cosine/dot product divergence
        const diff =
          Math.abs(w1.ЧЛ - w2.ЧЛ) +
          Math.abs(w1.БЛ - w2.БЛ) +
          Math.abs(w1.ЧС - w2.ЧС) +
          Math.abs(w1.БС - w2.БС) +
          Math.abs(w1.ЧИ - w2.ЧИ) +
          Math.abs(w1.БИ - w2.БИ);
        if (diff > 1.8) {
          contradictions.push({
            pair: mp.pair,
            severity: diff > 2.5 ? 'high' : 'medium',
            description: `${mp.descRu} (экраны ${mp.pair[0]} и ${mp.pair[1]})`,
          });
        }
      }
    }
  }

  const consistencyScore = Math.max(0.6, Math.round((1 - contradictions.length * 0.08) * 100) / 100);

  // Social desirability bias detection based on weights across screens 18, 19
  let socialDesirabilityScore = 0;
  const w18 = SOCIONICS_DIAGNOSTIC_WEIGHTS[18]?.[answers[18] || 'A'];
  const w19 = SOCIONICS_DIAGNOSTIC_WEIGHTS[19]?.[answers[19] || 'A'];
  if (w18) socialDesirabilityScore += (w18.БЭ || 0) + (w18.ЧЭ || 0);
  if (w19) socialDesirabilityScore += (w19.БЭ || 0) + (w19.ЧЭ || 0);

  let sdb: 'low' | 'moderate' | 'high' = 'low';
  if (socialDesirabilityScore >= 1.6) {
    sdb = 'high';
  } else if (socialDesirabilityScore >= 1.1) {
    sdb = 'moderate';
  }

  // Exact requested Confidence Formula: (Score(T1) - Score(T2)) / Score(T1)
  const topScore = sociotypeScores[0]?.score || 1;
  const secondScore = sociotypeScores[1]?.score || 0;
  const rawConfidence = topScore > 0 ? (topScore - secondScore) / topScore : 0.5;
  const typeConfidence = Math.min(0.99, Math.max(0.10, Math.round(rawConfidence * 100) / 100));

  // Energy Diagnostics & Gatekeeper
  let energyDiagnostics: EnergyDiagnosticsResult | undefined;
  if (energyAnswers && Object.keys(energyAnswers).length > 0) {
    energyDiagnostics = evaluateEnergyEfficiency(energyAnswers);
  }

  const reliabilityFlag = energyDiagnostics ? energyDiagnostics.reliability_flag : true;

  return {
    id: `soc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    completedAt: new Date().toISOString(),
    answers,
    energyAnswers,
    energy_diagnostics: energyDiagnostics,
    sociotype: {
      primary: primaryCode,
      secondary: secondaryCode,
      confidence: typeConfidence,
      candidates: sociotypeScores.slice(0, 4).map((s) => s.code),
      nameRu: primaryMeta.nameRu,
      nameEn: primaryMeta.nameEn,
      aliasRu: primaryMeta.aliasRu,
      aliasEn: primaryMeta.aliasEn,
    },
    quadra: {
      classic: classicQuadra,
      bashkuev: bashkuevQuadra,
      confidence: Math.min(0.99, Math.round((typeConfidence + 0.15) * 100) / 100),
      descriptionRu: quadraDescriptions[classicQuadra].ru,
      descriptionEn: quadraDescriptions[classicQuadra].en,
      descriptionEs: quadraDescriptions[classicQuadra].es,
    },
    result_process: {
      type: orientationType,
      confidence: Math.round(orientationConfidence * 100) / 100,
      scores: {
        result: Math.round(resultScore * 10) / 10,
        process: Math.round(processScore * 10) / 10,
      },
    },
    validity: {
      consistency_score: consistencyScore,
      contradictions,
      social_desirability_bias: sdb,
      reliability_flag: reliabilityFlag,
    },
    cognitive_profile: {
      functions: rawFunctions,
      normalizedFunctions,
      top3,
      bottom3,
    },
  };
}
