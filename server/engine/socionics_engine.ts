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
} from '../../src/types/socionics.js';
import { SOCIONICS_DIAGNOSTIC_WEIGHTS, SOCIONICS_SCREENS } from './socionics_data.js';

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
    creative: 'БЛ',
    descriptionRu: 'Генератор концептуальных идей, визионер возможностей и исследователь фундаментальных законов.',
    descriptionEn: 'Visionary concept generator, possibility explorer, and fundamental systems theorist.',
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
    descriptionRu: 'Архитектор строгих систем, объективной логики, справедливости и концептуальной ясности.',
    descriptionEn: 'Architect of rigorous structural models, objective logic, justice, and clarity.',
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
    descriptionRu: 'Мастер эмоционального воодушевления, праздничной энергии, гостеприимства и уюта.',
    descriptionEn: 'Master of uplifting emotional resonance, festive energy, hospitality, and comfort.',
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
    descriptionRu: 'Творец физической гармонии, гедонистического комфорта, тепла и душевного спокойствия.',
    descriptionEn: 'Creator of physical harmony, sensory delight, interpersonal warmth, and serenity.',
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
    descriptionRu: 'Волевой стратег захвата пространства, преодоления кризисов, управления властью и ресурсами.',
    descriptionEn: 'Resolute commander of expansion, crisis management, tactical leverage, and power.',
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
    descriptionRu: 'Интуитивный провидец временных ритмов, тонких душевных состояний и романтических смыслов.',
    descriptionEn: 'Visionary of temporal currents, delicate emotional subtleties, and inspirational faith.',
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
    descriptionRu: 'Хранитель дисциплины, регламентов, иерархического порядка и структурной надежности.',
    descriptionEn: 'Guardian of ironclad discipline, regulations, hierarchical structure, and execution.',
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
    descriptionRu: 'Драматический лидер, идеолог больших движений, трансформатор ценностей и духа коллектива.',
    descriptionEn: 'Charismatic ideologue, dramatic mobilizer of collective destiny, and cultural leader.',
  },
  СЭЭ: {
    code: 'СЭЭ',
    nameRu: 'Политик (Цезарь / Наполеон)',
    nameEn: 'Ambassador (ESFp)',
    aliasRu: 'Сенсорно-этический экстраверт',
    aliasEn: 'Sensory Ethical Extravert',
    quadra: 'Гамма',
    bashkuev: 'Купцы/Ремесленники',
    orientation: 'process',
    leading: 'ЧС',
    creative: 'БЭ',
    descriptionRu: 'Лидер личного влияния, дипломатического маневра, масштабных амбиций и престижа.',
    descriptionEn: 'Dynamic leader of personal leverage, social maneuvering, prestige, and market presence.',
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
    descriptionRu: 'Стратегический прогнозист, мастер оценки рисков, экономности ресурсов и своевременности.',
    descriptionEn: 'Strategic forecaster, master of risk evaluation, capital conservation, and timing.',
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
    descriptionRu: 'Пионер бизнес-инноваций, оптимизатор прибыльности, динамичный строитель капитала.',
    descriptionEn: 'Pioneer of business innovation, velocity of capital, dynamic enterprise, and ROI.',
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
    descriptionRu: 'Защитник этических принципов, верности договоренностям, семейных активов и границ.',
    descriptionEn: 'Protector of ethical standards, contractual loyalty, family assets, and moral boundaries.',
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
    descriptionRu: 'Организатор безупречного производственного качества, высокой культуры труда и надежности.',
    descriptionEn: 'Master of operational excellence, premium production standards, work culture, and quality.',
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
    descriptionRu: 'Виртуоз прикладного мастерства, эргономики, технологической точности и сбережения сил.',
    descriptionEn: 'Virtuoso of practical craftsmanship, ergonomic mastery, technological precision, and ease.',
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
    descriptionRu: 'Катализатор талантов людей, вдохновляющий дипломат возможностей и гуманистических связей.',
    descriptionEn: 'Catalyst of human potential, intuitive connector of opportunities, and empathetic diplomat.',
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
    descriptionRu: 'Носитель глубокой нравственной мудрости, психологического исцеления и духовного развития.',
    descriptionEn: 'Bearer of profound moral wisdom, psychological healing, and quiet spiritual guidance.',
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

export function evaluateSocionicsTest(answers: Record<number, OptionKey>): SocionicsTestResult {
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

  // Score each of 16 sociotypes based on leading + creative + quadra synergy
  const sociotypeScores: Array<{ code: SociotypeCode; score: number }> = [];

  for (const meta of Object.values(SOCIOTYPES_META)) {
    const leadScore = normalizedFunctions[meta.leading] || 0;
    const creatScore = normalizedFunctions[meta.creative] || 0;
    // Base weight formula: leading*1.5 + creative*1.0
    let typeScore = leadScore * 1.5 + creatScore * 1.0;

    // Bonus for matching orientation
    if (meta.orientation === 'result' && resultScore > processScore) {
      typeScore += 15;
    } else if (meta.orientation === 'process' && processScore >= resultScore) {
      typeScore += 15;
    }

    sociotypeScores.push({ code: meta.code, score: typeScore });
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

  // Social desirability bias detection from Block 7 (screens 18, 19)
  let sdb: 'low' | 'moderate' | 'high' = 'low';
  const ans18 = answers[18];
  const ans19 = answers[19];
  if (ans18 === 'E' && ans19 === 'E') {
    sdb = 'moderate';
  }

  const topScore = sociotypeScores[0]?.score || 100;
  const secondScore = sociotypeScores[1]?.score || 80;
  const typeConfidence = Math.min(0.96, Math.max(0.7, 0.6 + (topScore - secondScore) / 150));

  return {
    id: `soc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    completedAt: new Date().toISOString(),
    answers,
    sociotype: {
      primary: primaryCode,
      secondary: secondaryCode,
      confidence: Math.round(typeConfidence * 100) / 100,
      candidates: sociotypeScores.slice(0, 4).map((s) => s.code),
      nameRu: primaryMeta.nameRu,
      nameEn: primaryMeta.nameEn,
      aliasRu: primaryMeta.aliasRu,
      aliasEn: primaryMeta.aliasEn,
    },
    quadra: {
      classic: classicQuadra,
      bashkuev: bashkuevQuadra,
      confidence: Math.round((typeConfidence + 0.05) * 100) / 100,
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
    },
    cognitive_profile: {
      functions: rawFunctions,
      normalizedFunctions,
      top3,
      bottom3,
    },
  };
}
