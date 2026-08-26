/**
 * Energy Efficiency Diagnostic Engine & Physiological Protocols Knowledge Base
 * 7 Psychophysiological Screens (Э-1 — Э-7)
 * Evaluates Energy Efficiency Ratio (КПД), Dominant Cluster (A, B, C, D, E), Gatekeeper Reliability Flag,
 * and Tailored Evidence-Based Physiological Recovery Protocols (Huberman, McKeown, Rosenberg, Nagoski, Fogg, Levine).
 */

import {
  EnergyCluster,
  EnergyDiagnosticsResult,
  EnergyScreen,
  EnergyWeights,
  OptionKey,
  RecoveryProtocol,
} from '../../src/types/socionics.js';

export const ENERGY_EFFICIENCY_SCREENS: EnergyScreen[] = [
  {
    id: 1,
    title: {
      ru: 'Э-1: Утренний старт',
      en: 'E-1: Morning Start',
      es: 'E-1: Inicio matutino',
    },
    situation: {
      ru: 'Прошло 30 минут после пробуждения в обычный рабочий день.',
      en: 'It has been 30 minutes after waking up on a regular workday.',
      es: 'Han pasado 30 minutos desde que te despertaste en un día laboral normal.',
    },
    question: {
      ru: 'Каково ваше преобладающее физическое и ментальное ощущение?',
      en: 'What is your predominant physical and mental sensation?',
      es: '¿Cuál es tu sensación física y mental predominante?',
    },
    options: {
      A: {
        ru: 'Есть четкий фокус и легкое возбуждение от предстоящих задач. Тело бодрое.',
        en: 'Clear focus and mild excitement for upcoming tasks. Body feels energized.',
        es: 'Enfoque claro y entusiasmo por las próximas tareas. Cuerpo lleno de energía.',
      },
      B: {
        ru: 'Спокойная собранность. Я действую по привычному, отработанному ритуалу.',
        en: 'Calm composure. I act according to a familiar, well-established routine.',
        es: 'Serenidad concentrada. Actúo según una rutina habitual y bien practicada.',
      },
      C: {
        ru: 'Мысль «опять этот день». Делаю всё на автомате, кофе не помогает, внутри легкое раздражение.',
        en: 'Thinking "this day again". Doing everything on autopilot, coffee does not help, mild inner irritation.',
        es: 'Pensamiento de "otra vez este día". Todo en automático, el café no ayuda, leve irritación interna.',
      },
      D: {
        ru: 'Тревожный фон. Мозг сразу начинает прокручивать проблемы, тело напряжено (сжаты челюсти или плечи).',
        en: 'Anxious background. Brain immediately loops problems, body is tense (clenched jaw or shoulders).',
        es: 'Fondo ansioso. El cerebro repasa problemas de inmediato, cuerpo tenso (mandíbula u hombros apretados).',
      },
      E: {
        ru: 'Тяжесть. Физически трудно встать, мысль о делах вызывает желание просто лечь обратно.',
        en: 'Heaviness. Physically hard to get up, thoughts of tasks make me want to just lie back down.',
        es: 'Pesadez. Físicamente difícil levantarse, la idea de las tareas hace querer volver a acostarse.',
      },
    },
  },
  {
    id: 2,
    title: {
      ru: 'Э-2: Внезапное препятствие',
      en: 'E-2: Unexpected Obstacle',
      es: 'E-2: Obstáculo imprevisto',
    },
    situation: {
      ru: 'Важный план внезапно сорвался по не зависящим от вас причинам (отмена встречи, сбой системы).',
      en: 'An important plan suddenly falls through for reasons beyond your control (canceled meeting, system outage).',
      es: 'Un plan importante se cancela repentinamente por razones ajenas a tu control (reunión cancelada, fallo del sistema).',
    },
    question: {
      ru: 'Какова ваша первая автоматическая реакция?',
      en: 'What is your first automatic reaction?',
      es: '¿Cuál es tu primera reacción automática?',
    },
    options: {
      A: {
        ru: 'Мгновенная переоценка: «Ок, план Б. Какие новые возможности это открывает?»',
        en: 'Instant reassessment: "OK, plan B. What new opportunities does this open?"',
        es: 'Reevaluación instantánea: "Bien, plan B. ¿Qué nuevas oportunidades abre esto?"',
      },
      B: {
        ru: 'Холодный анализ: фиксирую факт, ищу в инструкциях или договорах пункт о форс-мажоре.',
        en: 'Cold analysis: note the fact, look up force majeure clauses in manuals or contracts.',
        es: 'Análisis frío: registro el hecho, busco cláusulas de fuerza mayor en contratos o manuales.',
      },
      C: {
        ru: 'Внутренний вздох: «Ну конечно». Сделаю необходимый минимум, чтобы формально закрыть вопрос.',
        en: 'Inner sigh: "Of course". I do the bare minimum to formally close the issue.',
        es: 'Suspiro interior: "Por supuesto". Hago lo mínimo necesario para cerrar el asunto formalmente.',
      },
      D: {
        ru: 'Резкий всплеск эмоций (гнев или паника). Начинаю искать виноватых или лихорадочно искать любое решение.',
        en: 'Sharp emotional spike (anger or panic). Start blaming or frantically looking for any fix.',
        es: 'Fuerte estallido emocional (ira o pánico). Empiezo a buscar culpables o una solución frenética.',
      },
      E: {
        ru: 'Оцепенение. Откладываю решение «на потом», потому что нет сил даже начинать разбираться.',
        en: 'Numb freeze. Postpone the decision for later because I lack the energy to even begin dealing with it.',
        es: 'Bloqueo. Pospongo la solución para después porque no tengo fuerzas ni para empezar a mirarlo.',
      },
    },
  },
  {
    id: 3,
    title: {
      ru: 'Э-3: Паттерн-интеррапт (Экран-сюрприз)',
      en: 'E-3: Pattern Interrupt (Surprise Screen)',
      es: 'E-3: Interrupción de patrón (Pantalla sorpresa)',
    },
    situation: {
      ru: 'Представьте, что прямо сейчас, посреди этого теста, вам приходит уведомление от самого влиятельного человека в вашей сфере. В сообщении только одно слово: «Всё».',
      en: 'Imagine right now, in the middle of this test, you get a notification from the most influential person in your industry. The message says just one word: "All / Done".',
      es: 'Imagina que ahora mismo, en mitad de este test, recibes un mensaje de la persona más influyente de tu sector. El mensaje solo dice una palabra: "Todo / Fin".',
    },
    question: {
      ru: 'Какова ваша самая первая, автоматическая реакция в теле за первые 2 секунды?',
      en: 'What is your very first, automatic bodily reaction in the first 2 seconds?',
      es: '¿Cuál es tu primera reacción física automática en los primeros 2 segundos?',
    },
    options: {
      A: {
        ru: 'Учащенное, но азартное сердцебиение. Мозг мгновенно строит 3 варианта развития событий.',
        en: 'Elevated yet eager heartbeat. Brain instantly generates 3 possible scenarios.',
        es: 'Latido acelerado pero estimulante. El cerebro construye al instante 3 escenarios posibles.',
      },
      B: {
        ru: 'Спокойный выдох. Я жду следующего сообщения или звонка, не делая поспешных выводов.',
        en: 'Calm exhale. I wait for the next message or call without jumping to conclusions.',
        es: 'Exhalación tranquila. Espero el siguiente mensaje o llamada sin sacar conclusiones apresuradas.',
      },
      C: {
        ru: 'Раздражение и мысль: «Опять какие-то игры, пусть подождут, у меня свои дела».',
        en: 'Irritation and thought: "More mind games again, let them wait, I have my own tasks".',
        es: 'Irritación y pensamiento: "Otra vez jueguecitos, que esperen, tengo mis propios asuntos".'
      },
      D: {
        ru: 'Холодок в животе или резкий прилив жара. Мгновенная паника или злость: «Что это значит?!»',
        en: 'Cold pit in stomach or sudden hot flash. Instant panic or anger: "What does this mean?!"',
        es: 'Frío en el estómago o golpe de calor repentino. Pánico o enfado instantáneo: "¿Qué significa esto?!"',
      },
      E: {
        ru: 'Тяжесть в груди. Мысль: «Ну вот, опять что-то случилось, у меня нет сил это разгребать».',
        en: 'Chest heaviness. Thought: "Here we go again, something happened, I have no energy to sort this out".',
        es: 'Pesadez en el pecho. Pensamiento: "Ya está, otra vez un problema, no tengo fuerzas para resolverlo".',
      },
    },
  },
  {
    id: 4,
    title: {
      ru: 'Э-4: Расход последнего ресурса',
      en: 'E-4: Expending the Last Resource',
      es: 'E-4: Gasto del último recurso',
    },
    situation: {
      ru: 'У вас остался один свободный час в конце напряженной недели.',
      en: 'You have one free hour left at the end of a demanding week.',
      es: 'Te queda una hora libre al final de una semana intensa.',
    },
    question: {
      ru: 'Как вы его используете?',
      en: 'How do you spend it?',
      es: '¿Cómo la aprovechas?',
    },
    options: {
      A: {
        ru: 'На то, что дает энергию: хобби, спорт, глубокое общение или изучение чего-то нового.',
        en: 'On what gives energy: hobbies, sports, deep conversation, or learning something new.',
        es: 'En lo que da energía: pasatiempos, deporte, conversación profunda o aprender algo nuevo.',
      },
      B: {
        ru: 'На наведение порядка: закрою все мелкие хвосты, чтобы неделя завершилась чисто.',
        en: 'On tidying up: wrap up all loose ends so the week closes cleanly.',
        es: 'En poner orden: cerrar todos los cabos sueltos para que la semana termine limpia.',
      },
      C: {
        ru: 'На пассивное потребление контента (скроллинг ленты), чтобы «отключить мозг», даже если это не приносит радости.',
        en: 'On passive content consumption (scrolling feeds) to "turn off the brain", even if it brings no joy.',
        es: 'En consumo pasivo de contenido (scroll en redes) para "desconectar el cerebro", aunque no dé alegría.',
      },
      D: {
        ru: 'На прокручивание в голове прошлых конфликтов или тревогу о будущем.',
        en: 'On replaying past conflicts in my head or agonizing over the future.',
        es: 'En darle vueltas a conflictos pasados o preocuparme por el futuro.',
      },
      E: {
        ru: 'Просто лежу или сплю. Любое действие кажется неподъемным.',
        en: 'Just lying down or sleeping. Any action feels overwhelmingly heavy.',
        es: 'Simplemente acostado o durmiendo. Cualquier acción parece inalcanzable.',
      },
    },
  },
  {
    id: 5,
    title: {
      ru: 'Э-5: Социальное трение',
      en: 'E-5: Social Friction',
      es: 'E-5: Fricción social',
    },
    situation: {
      ru: 'Коллега или партнер предлагает идею, которая вам кажется слабой или ошибочной.',
      en: 'A colleague or partner proposes an idea that you find weak or flawed.',
      es: 'Un compañero o socio propone una idea que te parece débil o equivocada.',
    },
    question: {
      ru: 'Как вы отреагируете?',
      en: 'How do you react?',
      es: '¿Cómo reaccionas?',
    },
    options: {
      A: {
        ru: 'Задам уточняющие вопросы, чтобы найти в идее рациональное зерно и улучшить её совместно.',
        en: 'Ask clarifying questions to find a rational kernel and enhance it collaboratively.',
        es: 'Haré preguntas aclaratorias para encontrar el núcleo racional y mejorarla juntos.',
      },
      B: {
        ru: 'Спокойно и аргументированно укажу на риски, опираясь на факты.',
        en: 'Calmly and factually point out risks based on concrete evidence.',
        es: 'Señalaré con calma y argumentos los riesgos basándome en hechos.',
      },
      C: {
        ru: 'Промолчу или соглашусь формально, чтобы не тратить энергию на спор, но внутри буду критиковать.',
        en: 'Stay silent or agree formally to save energy on arguing, but criticize internally.',
        es: 'Guardaré silencio o aceptaré formalmente para no gastar energía en discutir, pero criticando por dentro.',
      },
      D: {
        ru: 'Резко и эмоционально отвергну идею, возможно, с сарказмом или повышением тона.',
        en: 'Harshly and emotionally reject the idea, possibly with sarcasm or a raised voice.',
        es: 'Rechazaré la idea con dureza y emoción, quizá con sarcasmo o elevando el tono.',
      },
      E: {
        ru: 'Мне всё равно. Пусть делает как хочет, меня это уже не касается.',
        en: 'I do not care. Let them do whatever they want, it is no longer my concern.',
        es: 'Me da igual. Que haga lo que quiera, ya no me incumbe.',
      },
    },
  },
  {
    id: 6,
    title: {
      ru: 'Э-6: Соматический маркер (Телесный сигнал)',
      en: 'E-6: Somatic Marker (Body Signal)',
      es: 'E-6: Marcador somático (Señal corporal)',
    },
    situation: {
      ru: 'Вы сидите за работой уже 2 часа.',
      en: 'You have been sitting at work for 2 hours already.',
      es: 'Llevas 2 horas sentado trabajando.',
    },
    question: {
      ru: 'Что вы замечаете в своем теле чаще всего?',
      en: 'What do you notice most often in your body?',
      es: '¿Qué notas en tu cuerpo con mayor frecuencia?',
    },
    options: {
      A: {
        ru: 'Тело подвижно, дыхание свободное, я легко меняю позу.',
        en: 'Body is agile, breathing is free, I easily shift posture.',
        es: 'El cuerpo está ágil, respiración libre, cambio de postura con facilidad.',
      },
      B: {
        ru: 'Тело стабильно, я контролирую осанку, дыхание ровное.',
        en: 'Body is stable, I control posture, breathing is steady.',
        es: 'El cuerpo está estable, controlo la postura, respiración uniforme.',
      },
      C: {
        ru: 'Ощущение «ватности», желание потянуться, частые зевота или потягивания без чувства облегчения.',
        en: 'Feeling sluggish/lethargic, urge to stretch, frequent yawns without relief.',
        es: 'Sensación de pesadez, ganas de estirarse, bostezos frecuentes sin alivio.',
      },
      D: {
        ru: 'Зажимы в плечах, шее или челюсти. Поверхностное, учащенное дыхание.',
        en: 'Tension in shoulders, neck, or jaw. Shallow, rapid breathing.',
        es: 'Tensión en hombros, cuello o mandíbula. Respiración superficial y rápida.',
      },
      E: {
        ru: 'Ощущение тяжести в конечностях, взгляд расфокусирован, хочется свернуться в позу эмбриона.',
        en: 'Heaviness in limbs, unfocused gaze, urge to curl into fetal position.',
        es: 'Pesadez en las extremidades, mirada desenfocada, ganas de acurrucarse en posición fetal.',
      },
    },
  },
  {
    id: 7,
    title: {
      ru: 'Э-7: Горизонт планирования',
      en: 'E-7: Planning Horizon',
      es: 'E-7: Horizonte de planificación',
    },
    situation: {
      ru: 'Вас просят описать ваши ощущения от ближайших 3 месяцев.',
      en: 'You are asked to describe your feelings about the next 3 months.',
      es: 'Te piden describir tus sensaciones respecto a los próximos 3 meses.',
    },
    question: {
      ru: 'Что ближе всего к истине?',
      en: 'What is closest to the truth?',
      es: '¿Qué se acerca más a la verdad?',
    },
    options: {
      A: {
        ru: 'Предвкушение. Вижу конкретные цели и понимаю, как их достичь.',
        en: 'Anticipation. I see clear goals and understand how to achieve them.',
        es: 'Expectación positiva. Veo objetivos claros y sé cómo alcanzarlos.',
      },
      B: {
        ru: 'Уверенность. Знаю, что буду делать, всё под контролем, сюрпризов не жду.',
        en: 'Confidence. I know what I will do, everything is under control, expecting no surprises.',
        es: 'Confianza. Sé lo que haré, todo bajo control, no espero sorpresas.',
      },
      C: {
        ru: 'Скука или фатализм. «Будет день, будет и пища». Не вижу смысла далеко загадывать.',
        en: 'Boredom or fatalism. "Take each day as it comes". See no point in planning far ahead.',
        es: 'Tedio o fatalismo. "Un día a la vez". No veo sentido en planificar a largo plazo.',
      },
      D: {
        ru: 'Напряженное ожидание подвоха. Готовлюсь к тому, что что-то пойдет не так.',
        en: 'Tense anticipation of trouble. Preparing for things to go wrong.',
        es: 'Espera tensa de problemas. Preparándome para que algo salga mal.',
      },
      E: {
        ru: 'Безразличие или страх. Мысль о будущем вызывает желание спрятаться.',
        en: 'Indifference or fear. Thoughts of the future make me want to hide.',
        es: 'Indiferencia o miedo. Pensar en el futuro me hace querer esconderme.',
      },
    },
  },
];

/**
 * Exact weight map for all 7 screens
 */
export const ENERGY_WEIGHT_MAP: Record<number, Record<OptionKey, EnergyWeights>> = {
  1: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.5, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.2, energyIn: 0.1, energyOut: 1.4 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 1.0, clusterE: 0.0, energyIn: 0.3, energyOut: 1.5 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.3, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.3 },
  },
  2: {
    A: { clusterA: 1.0, clusterB: 0.3, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.6, energyOut: 0.1 },
    B: { clusterA: 0.3, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.1, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.2, clusterE: 0.1, energyIn: 0.0, energyOut: 1.5 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.2, energyOut: 1.6 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.4 },
  },
  3: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.5, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.2, energyIn: 0.1, energyOut: 1.3 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.2, energyOut: 1.4 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.3 },
  },
  4: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.4, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.1, energyIn: 0.1, energyOut: 1.3 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.1, energyOut: 1.5 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.2 },
  },
  5: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.5, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.2, energyIn: 0.1, energyOut: 1.4 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.2, energyOut: 1.6 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.3 },
  },
  6: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.6, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.1, energyIn: 0.1, energyOut: 1.3 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.2, energyOut: 1.4 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.3 },
  },
  7: {
    A: { clusterA: 1.0, clusterB: 0.2, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.5, energyOut: 0.1 },
    B: { clusterA: 0.2, clusterB: 1.0, clusterC: 0.0, clusterD: 0.0, clusterE: 0.0, energyIn: 1.0, energyOut: 0.2 },
    C: { clusterA: 0.0, clusterB: 0.0, clusterC: 1.0, clusterD: 0.1, clusterE: 0.2, energyIn: 0.1, energyOut: 1.4 },
    D: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.1, clusterD: 1.0, clusterE: 0.0, energyIn: 0.2, energyOut: 1.5 },
    E: { clusterA: 0.0, clusterB: 0.0, clusterC: 0.2, clusterD: 0.0, clusterE: 1.0, energyIn: 0.0, energyOut: 1.4 },
  },
};

/**
 * Evidence-Based Physiological Protocols Knowledge Base
 */
export const PHYSIOLOGICAL_PROTOCOLS: Record<EnergyCluster, RecoveryProtocol> = {
  A: {
    title: 'Поддержание пиковой ресурсности и предотвращение скрытого перегрева',
    source: 'Andrew Huberman (Neurobiology of Optimal Performance) & BJ Fogg (Habit Anchors)',
    scientificBasis: 'Калибровка симпато-парасимпатического баланса при высоком дофаминовом тонусе во избежание незаметного истощения рецепторов.',
    duration: '10-15 минут ежедневно',
    actionSteps: [
      'Утренний солнечный свет в глаза (10-15 мин) в первый час после подъема для фиксации циркадного кортизолового пика.',
      'Четкие тайм-боксы отдыха: запланированные периоды Non-Sleep Deep Rest (NSDR) даже при высоком драйве.',
      'Гигиена вечернего синего света за 2 часа до сна для поддержания пиковой фазы глубокого сна.',
    ],
    cheatCode: 'NSDR (Non-Sleep Deep Rest) на 10 минут в середине дня + заземление взгляда на горизонт для снятия туннельного зрительного напряжения.',
  },
  B: {
    title: 'Оптимизация рабочего ритма и сохранение баланса энергии',
    source: 'Patrick McKeown (Oxygen Advantage) & Emily Nagoski (Stress Cycle Completion)',
    scientificBasis: 'Стабилизация вариабельности сердечного ритма (HRV) и своевременное закрытие микро-циклов стресса в течение рабочего дня.',
    duration: '5-10 минут между рабочими спринтами',
    actionSteps: [
      'Переход на непрерывное носовое дыхание в течение всего рабочего дня.',
      'Физическая активность 20-30 минут (ходьба в темпе, растяжка) для выведения кортизола.',
      'Контрастное умывание или теплый душ вечером для запуска парасимпатического расслабления.',
    ],
    cheatCode: 'Ритмичное дыхание по схеме 4-2-6 (вдох 4 сек через нос, задержка 2 сек, выдох 6 сек) — 6 циклов при смене контекста задач.',
  },
  C: {
    title: 'Протокол экстренной реанимации при истощении и выгорании (Кластер C)',
    source: 'Andrew Huberman (Physiological Sigh) & Emily Nagoski (Burnout & Stress Cycle)',
    scientificBasis: 'Перезагрузка альвеол легких, сброс избыточного накопления CO₂ в тканях и быстрое механическое торможение симпатической системы через блуждающий нерв.',
    duration: '3-5 минут, 3-4 раза в день',
    actionSteps: [
      '«Физиологический вздох» (Huberman): Двойной глубокий вдох через нос (первый полный, второй короткий доволновой вдох) + медленный длинный выдох через рот. Повторить 5-7 раз подряд.',
      'Завершение цикла стресса (Nagoski): 10 минут умеренной кардио-активности или 20-секундное глубокое объятие с близким/питомцем до полного физиологического выдоха.',
      'Жесткий мораторий на новые обязательства до восстановления базового сна (минимум 8.5 часов в темноте и прохладе 18-19°C).',
    ],
    cheatCode: 'Физиологический вздох (двойной вдох носом + длинный выдох ртом × 5 повторов) + магний бисглицинат 400 мг за 1 час до сна.',
  },
  D: {
    title: 'Протокол купирования паники, тревоги и гипернапряжения (Кластер D)',
    source: 'Patrick McKeown (CO₂ Tolerance / Buteyko) & Stanley Rosenberg (Vagal Reset / Basic Exercise)',
    scientificBasis: 'Нормализация хеморецепторной чувствительности к углекислому газу, снятие рефлекторного спазма затылочных мышц (C1-C2) и стимуляция вентрального вагуса.',
    duration: '5 минут',
    actionSteps: [
      'Упражнение Розенберга (Basic Exercise): Лежа на спине, пальцы рук в замок на затылке. Не поворачивая головы, перевести взгляд максимально вправо до самопроизвольного вздоха, зевка или сглатывания (30-60 сек), затем повторить влево.',
      'Каденс-дыхание по МакКеону: 4 секунды вдох через нос, 6 секунд выдох. Дыхание тихое, беззвучное, только нижней частью ребер.',
      'Физическое отсечение сенсорной перегрузки: выключить все уведомления, закрыть глаза, положить теплую ладонь на солнечное сплетение.',
    ],
    cheatCode: 'Базовое упражнение Розенберга (взгляд в крайнее положение на 45 сек до зевка) + удлиненный выдох в 2 раза длиннее вдоха.',
  },
  E: {
    title: 'Протокол выхода из апатии, оцепенения и прокрастинации (Кластер E)',
    source: 'Peter Levine (Somatic Experiencing / Shaking) & BJ Fogg (Tiny Habits / Micro-Activation)',
    scientificBasis: 'Снятие дорсального вагального торможения (freeze state) через кинестетическую проприоцепцию и микро-дофаминовые триггеры без перегрузки коры.',
    duration: '3-7 минут',
    actionSteps: [
      'Соматический шейкинг (Levine): Встать на стопы, 2-3 минуты мягко потрясти всем телом, кистями и плечами, сбрасывая застывший мышечный тонус («стряхивание оцепенения»).',
      'Микро-шаг Tiny Habits (Fogg): Уменьшить действие до смехотворно простого (например, не «написать отчет», а «открыть документ и поставить точку»). Совершить ровно 1 микро-действие.',
      'Холодовая стимуляция лица (Mammalian Dive Reflex): опустить лицо в емкость с прохладной водой на 15 секунд для мгновенной соматической перезагрузки.',
    ],
    cheatCode: 'Соматический шейкинг всего тела 120 секунд + 1 микро-действие по правилу Фогга («сделай шаг размером в 30 секунд»).',
  },
};

const CLUSTER_METAS: Record<EnergyCluster, { nameRu: string; nameEn: string; descRu: string; descEn: string }> = {
  A: {
    nameRu: 'Кластер A: Высокий тонус / Профицит энергии',
    nameEn: 'Cluster A: High Vitality / Energy Surplus',
    descRu: 'Высокий психофизиологический ресурс, быстрое восстановление, чистый когнитивный фокус и готовность к масштабированию.',
    descEn: 'High psychophysiological reserve, rapid recovery, crisp cognitive focus, and capacity for scale.',
  },
  B: {
    nameRu: 'Кластер B: Оптимум / Устойчивая норма',
    nameEn: 'Cluster B: Optimal Flow / Baseline Stability',
    descRu: 'Стабильный рабочий тонус, адекватный баланс расхода и восполнения сил, контролируемый уровень стресса.',
    descEn: 'Steady operational capacity, sound balance of expenditure and regeneration, controlled stress levels.',
  },
  C: {
    nameRu: 'Кластер C: Истощение / Выгорание (Burnout)',
    nameEn: 'Cluster C: Depletion / Burnout State',
    descRu: 'Критический дефицит энергии, тяжесть в теле, истощение дофаминовой системы. Требуется срочная физиологическая реанимация.',
    descEn: 'Critical energy deficit, somatic exhaustion, depleted dopamine baseline. Requires immediate physiological reset.',
  },
  D: {
    nameRu: 'Кластер D: Гипервозбуждение / Паника и Тревога',
    nameEn: 'Cluster D: Hyperarousal / Sympathetic Overdrive',
    descRu: 'Перегрузка симпатической нервной системы, мышечные зажимы, суетливость, поверхностное дыхание и страх ошибок.',
    descEn: 'Sympathetic nervous system overload, muscle constriction, agitated focus, shallow breathing, and acute anxiety.',
  },
  E: {
    nameRu: 'Кластер E: Апатия / Оцепенение (Dorsal Shutdown)',
    nameEn: 'Cluster E: Hypoarousal / Freeze State',
    descRu: 'Дорсальное вагальное оцепенение, туман в голове, прокрастинация и утрата воли к действию. Необходим мягкий паттерн-интеррапт.',
    descEn: 'Dorsal vagal immobilization, brain fog, paralytic procrastination, and somatic numbness. Requires gentle pattern interrupt.',
  },
};

/**
 * Evaluate 7 Energy Efficiency Screens
 */
export function evaluateEnergyEfficiency(answers: Record<number, OptionKey>): EnergyDiagnosticsResult {
  const clusterScores: Record<EnergyCluster, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  };

  let totalEnergyIn = 0;
  let totalEnergyOut = 0;

  for (let i = 1; i <= 7; i++) {
    const chosenOption = answers[i] || 'B';
    const weights = ENERGY_WEIGHT_MAP[i]?.[chosenOption];
    if (weights) {
      clusterScores.A += weights.clusterA;
      clusterScores.B += weights.clusterB;
      clusterScores.C += weights.clusterC;
      clusterScores.D += weights.clusterD;
      clusterScores.E += weights.clusterE;
      totalEnergyIn += weights.energyIn;
      totalEnergyOut += weights.energyOut;
    }
  }

  // Calculate КПД = Energy In / max(Energy Out, 0.5)
  const safeOut = Math.max(totalEnergyOut, 0.5);
  const rawKpd = totalEnergyIn / safeOut;
  const kpd = Math.round(rawKpd * 100) / 100;

  // Determine dominant cluster
  let dominantCluster: EnergyCluster = 'B';
  let maxScore = -1;
  for (const c of ['A', 'B', 'C', 'D', 'E'] as EnergyCluster[]) {
    if (clusterScores[c] > maxScore) {
      maxScore = clusterScores[c];
      dominantCluster = c;
    }
  }

  // If KPD is severely depleted but tied, prioritize C, D, or E
  if (kpd < 1.0 && (dominantCluster === 'A' || dominantCluster === 'B')) {
    if (clusterScores.C >= clusterScores.D && clusterScores.C >= clusterScores.E) {
      dominantCluster = 'C';
    } else if (clusterScores.D >= clusterScores.E) {
      dominantCluster = 'D';
    } else {
      dominantCluster = 'E';
    }
  }

  // Gatekeeper: Scenario A (kpd >= 1.0) vs Scenario B (kpd < 1.0)
  const isReliable = kpd >= 1.0;
  const scenario: 'A' | 'B' = isReliable ? 'A' : 'B';
  const meta = CLUSTER_METAS[dominantCluster];
  const protocol = PHYSIOLOGICAL_PROTOCOLS[dominantCluster];

  return {
    kpd,
    dominantCluster,
    clusterNameRu: meta.nameRu,
    clusterNameEn: meta.nameEn,
    clusterDescriptionRu: meta.descRu,
    clusterDescriptionEn: meta.descEn,
    energyIn: Math.round(totalEnergyIn * 10) / 10,
    energyOut: Math.round(totalEnergyOut * 10) / 10,
    reliability_flag: isReliable,
    scenario,
    protocol,
  };
}
