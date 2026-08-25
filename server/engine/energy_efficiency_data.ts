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
      ru: 'Э-1: Утреннее пробуждение и витальный тонус',
      en: 'E-1: Morning Awakening & Vital Tonus',
      es: 'E-1: Despertar matutino y tono vital',
    },
    situation: {
      ru: 'Вы просыпаетесь утром в обычный рабочий день после стандартного количества часов сна.',
      en: 'You wake up on a regular weekday after your standard amount of sleep.',
      es: 'Te despiertas en un día laboral normal después de tu cantidad habitual de horas de sueño.',
    },
    question: {
      ru: 'Каково ваше преобладающее психофизиологическое состояние в первые 30-45 минут?',
      en: 'What is your predominant psychophysiological state during the first 30-45 minutes?',
      es: '¿Cuál es tu estado psicofisiológico predominante durante los primeros 30-45 minutos?',
    },
    options: {
      A: {
        ru: 'A) Просыпаюсь с ясной головой, чувствую избыток сил и желание немедленно включиться в амбициозные задачи.',
        en: 'A) Wake up clear-headed, with surplus energy and an urge to tackle ambitious projects immediately.',
        es: 'A) Me despierto con la mente clara, sintiendo un exceso de energía y ganas de actuar de inmediato.',
      },
      B: {
        ru: 'B) Нормальный рабочий тонус: нужно 15-20 минут на кофе/душ, после чего стабильно вхожу в продуктивный ритм.',
        en: 'B) Steady baseline: need 15-20 mins for coffee/shower, then smoothly enter a productive rhythm.',
        es: 'B) Tono normal: necesito 15-20 minutos para café/ducha, luego entro en un ritmo productivo estable.',
      },
      C: {
        ru: 'C) Просыпаюсь разбитым, ощущение тяжести в теле («как будто не спал»), даже если спал 8+ часов.',
        en: 'C) Wake up unrefreshed, heavy body sensation as if I had not slept, even after 8+ hours.',
        es: 'C) Me despierto agotado, pesadez corporal como si no hubiera dormido, incluso tras 8+ horas.',
      },
      D: {
        ru: 'D) Сразу подскакиваю с тревогой, учащенным пульсом и хаотичным роем мыслей о горящих дедлайнах.',
        en: 'D) Instantly jump with anxiety, elevated pulse, and a racing mind about pressing deadlines.',
        es: 'D) Salto de inmediato con ansiedad, pulso acelerado y pensamientos caóticos sobre urgencias.',
      },
      E: {
        ru: 'E) Полная апатия и оцепенение: трудно заставить себя просто подняться с кровати, откладываю подъем.',
        en: 'E) Complete apathy and stupor: hard to force myself out of bed, repeatedly postponing getting up.',
        es: 'E) Apatía total y entumecimiento: me cuesta levantarme de la cama, pospongo el momento.',
      },
    },
  },
  {
    id: 2,
    title: {
      ru: 'Э-2: Реакция на непредвиденную перегрузку и стресс-факторы',
      en: 'E-2: Response to Unexpected Overload & Stressors',
      es: 'E-2: Respuesta a sobrecargas imprevistas y factores de estrés',
    },
    situation: {
      ru: 'Посреди дня возникает внезапный форс-мажор: ключевой сбой, требование срочного решения, двойная нагрузка.',
      en: 'In the middle of the day, an unexpected crisis erupts: urgent bug, double workload, abrupt disruption.',
      es: 'En mitad del día surge una crisis imprevista: fallo crítico, doble carga, interrupción urgente.',
    },
    question: {
      ru: 'Как реагирует ваша нервная система и тело?',
      en: 'How does your nervous system and body react?',
      es: '¿Cómo reaccionan tu sistema nervioso y tu cuerpo?',
    },
    options: {
      A: {
        ru: 'A) Моментальная мобилизация: азарт, обострение внимания, быстрое принятие точных решений без истощения.',
        en: 'A) Instant mobilization: thrill, hyper-focus, sharp decision-making without fatigue.',
        es: 'A) Movilización instantánea: entusiasmo, enfoque agudo, decisiones precisas sin agotamiento.',
      },
      B: {
        ru: 'B) Прагматичный сбор: беру паузу на 2 минуты, расставляю приоритеты и методично закрываю проблему.',
        en: 'B) Pragmatic composure: take 2 mins, prioritize calmly, and methodically resolve the issue.',
        es: 'B) Calma pragmática: tomo 2 minutos, priorizo y resuelvo el problema metódicamente.',
      },
      C: {
        ru: 'C) Мгновенный спад: чувствую, что последняя капля переполнила чашу, возникает физическая слабость и тошнота от нагрузки.',
        en: 'C) Immediate drain: feels like the last straw, experiencing physical weakness and brain fog.',
        es: 'C) Caída inmediata: siento que es la gota que colma el vaso, debilidad física y niebla mental.',
      },
      D: {
        ru: 'D) Вспышка адреналина/паники: зажим в плечах и шее, суетливые хаотичные действия, поверхностное дыхание.',
        en: 'D) Adrenaline/panic spike: shoulder/neck tension, erratic actions, rapid shallow breathing.',
        es: 'D) Pico de adrenalina/pánico: tensión en hombros y cuello, acciones caóticas, respiración corta.',
      },
      E: {
        ru: 'E) Эмоциональное отключение (диссоциация): «зависаю», смотрю в одну точку, тело цепенеет, пропадает чувствительность.',
        en: 'E) Emotional shutdown (freeze/dissociation): zone out, stare into space, numbness and immobility.',
        es: 'E) Desconexión emocional (bloqueo): me quedo paralizado, mirada perdida, cuerpo entumecido.',
      },
    },
  },
  {
    id: 3,
    title: {
      ru: 'Э-3: Длительность фокуса и устойчивость внимания',
      en: 'E-3: Focus Duration & Attention Resilience',
      es: 'E-3: Duración de enfoque y resistencia atencional',
    },
    situation: {
      ru: 'Вам необходимо выполнить глубокую аналитическую или творческую задачу продолжительностью 90 минут.',
      en: 'You need to execute a deep analytical or creative task lasting 90 minutes.',
      es: 'Necesitas realizar una tarea analítica o creativa profunda que dura 90 minutos.',
    },
    question: {
      ru: 'Как удерживается ваш фокус внимания?',
      en: 'How do you sustain your attention span?',
      es: '¿Cómo mantienes tu concentración?',
    },
    options: {
      A: {
        ru: 'A) Состояние глубокого потока: легко держу непрерывный фокус 90-120 минут, выхожу наполненным.',
        en: 'A) Deep flow state: effortlessly sustain uninterrupted focus for 90-120 mins, feeling energized.',
        es: 'A) Flujo profundo: mantengo el enfoque 90-120 minutos con facilidad, saliendo con energía.',
      },
      B: {
        ru: 'B) Стабильный рабочий ритм: работаю блоками по 45 минут с короткими перерывами, задача выполняется в срок.',
        en: 'B) Steady cadence: work in 45-min blocks with brief pauses, delivering on schedule.',
        es: 'B) Ritmo constante: trabajo en bloques de 45 min con pausas cortas, cumpliendo el plazo.',
      },
      C: {
        ru: 'C) Быстрое истощение: через 15-20 минут внимание «плывет», буквы сливаются, требуется огромная воля для продолжения.',
        en: 'C) Rapid cognitive fatigue: after 15-20 mins focus blurs, requiring intense effort to push through.',
        es: 'C) Agotamiento rápido: a los 15-20 min la atención decae, requiriendo un esfuerzo enorme.',
      },
      D: {
        ru: 'D) Сверхвысокая отвлекаемость: каждые 3-5 минут дергаюсь на уведомления, вкладки, фоновую тревогу.',
        en: 'D) Extreme distractibility: twitching to check notifications, browser tabs, background jitter every 3 mins.',
        es: 'D) Distracción extrema: saltando a notificaciones y pestañas cada 3-5 minutos por inquietud.',
      },
      E: {
        ru: 'E) Прокрастинация и мысленный ступор: сижу перед открытым документом, не в силах написать первую строку.',
        en: 'E) Paralytic procrastination: sitting before the open document, unable to produce the first sentence.',
        es: 'E) Procrastinación paralizante: sentado ante el documento, incapaz de escribir la primera línea.',
      },
    },
  },
  {
    id: 4,
    title: {
      ru: 'Э-4: Паттерны дыхания и соматическое напряжение',
      en: 'E-4: Breathing Patterns & Somatic Tension',
      es: 'E-4: Patrones de respiración y tensión somática',
    },
    situation: {
      ru: 'Обратите внимание на свое тело и дыхание прямо сейчас в процессе обычной жизнедеятельности.',
      en: 'Observe your body and respiration right now during ordinary daily activity.',
      es: 'Observa tu cuerpo y respiración ahora mismo durante la actividad cotidiana.',
    },
    question: {
      ru: 'Что вы чаще всего фиксируете на физиологическом уровне?',
      en: 'What do you most often notice on a physiological level?',
      es: '¿Qué notas con mayor frecuencia a nivel fisiológico?',
    },
    options: {
      A: {
        ru: 'A) Свободное диафрагмальное дыхание через нос, расслабленные челюсти, плечи опущены, тело теплое и подвижное.',
        en: 'A) Smooth nasal diaphragmatic breathing, relaxed jaw, dropped shoulders, warm and agile body.',
        es: 'A) Respiración diafragmática nasal libre, mandíbula relajada, hombros sueltos, cuerpo ágil.',
      },
      B: {
        ru: 'B) Ровное спокойное дыхание, умеренный физиологический тонус без выраженных зажимов.',
        en: 'B) Even calm breathing, moderate physiological muscle tone without pronounced constriction.',
        es: 'B) Respiración tranquila y regular, tono muscular moderado sin bloqueos marcados.',
      },
      C: {
        ru: 'C) Тяжелое, поверхностное дыхание, частые непроизвольные вздохи усталости, общее ощущение «севшей батарейки».',
        en: 'C) Heavy, shallow breathing, frequent involuntary sighs of fatigue, feeling like a drained battery.',
        es: 'C) Respiración pesada y superficial, suspiros frecuentes de cansancio, batería agotada.',
      },
      D: {
        ru: 'D) Задержки дыхания (апноэ экранов), дыхание верхушками легких через рот, сжатые челюсти, ком в горле.',
        en: 'D) Breath-holding (screen apnea), shallow upper-chest mouth breathing, clenched jaw, tight throat.',
        es: 'D) Apnea de pantalla, respiración torácica bucal, mandíbula apretada, nudo en la garganta.',
      },
      E: {
        ru: 'E) Замедленное, почти неощутимое дыхание, холодные конечности, сниженная чувствительность тела.',
        en: 'E) Sluggish, barely perceptible breathing, cold extremities, diminished bodily sensation.',
        es: 'E) Respiración muy lenta y casi imperceptible, manos/pies fríos, baja sensibilidad corporal.',
      },
    },
  },
  {
    id: 5,
    title: {
      ru: 'Э-5: Скорость восстановления после интенсивного рабочего дня',
      en: 'E-5: Recovery Velocity After an Intense Workday',
      es: 'E-5: Velocidad de recuperación tras un día intenso',
    },
    situation: {
      ru: 'Закончился насыщенный рабочий день с большим количеством контактов и решений.',
      en: 'An eventful workday packed with meetings, decisions, and interactions has concluded.',
      es: 'Terminó un día laboral intenso con muchas reuniones, decisiones y contactos.',
    },
    question: {
      ru: 'Как протекает ваш вечер и процесс восстановления?',
      en: 'How does your evening and recovery process unfold?',
      es: '¿Cómo transcurre tu tarde y tu proceso de recuperación?',
    },
    options: {
      A: {
        ru: 'A) Быстро переключаюсь на спорт, семью или хобби; энергии хватает на яркий вечер, сон глубокий.',
        en: 'A) Quickly switch to sports, family, hobbies; plenty of energy for a vibrant evening, deep sleep.',
        es: 'A) Cambio rápido a deporte o familia; energía suficiente para una tarde activa, sueño profundo.',
      },
      B: {
        ru: 'B) Спокойный отдых за ужином и книгой/фильмом; к ночи чувствую здоровую усталость и легко засыпаю.',
        en: 'B) Relaxed evening with dinner and book/movie; healthy fatigue by bedtime, falling asleep easily.',
        es: 'B) Descanso tranquilo con cena y lectura; fatiga saludable por la noche y fácil conciliación.',
      },
      C: {
        ru: 'C) Падаю без сил на диван, не могу даже говорить с близкими; выходные уходят исключительно на попытку выжить.',
        en: 'C) Collapse onto the couch with zero capacity to speak; weekends are purely spent trying to survive.',
        es: 'C) Caigo desplomado en el sofá sin ganas de hablar; el fin de semana es solo para sobrevivir.',
      },
      D: {
        ru: 'D) Не могу «выключить голову»: кручу в мыслях диалоги, бессонница, просыпаюсь в 3-4 утра от адреналина.',
        en: 'D) Unable to turn off thoughts: looping work dialogs, insomnia, waking up at 3-4 AM in alert mode.',
        es: 'D) No puedo apagar la mente: rumiación constante, insomnio, despertar a las 3-4 AM con alerta.',
      },
      E: {
        ru: 'E) Часами бездумно листаю короткие видео/соцсети, находясь в полусне, не испытывая ни отдыха, ни удовольствия.',
        en: 'E) Mindlessly scroll short videos for hours in a daze, experiencing neither relaxation nor joy.',
        es: 'E) Desplazamiento infinito de vídeos en redes durante horas sin descansar ni disfrutar.',
      },
    },
  },
  {
    id: 6,
    title: {
      ru: 'Э-6: Качество дофаминовой мотивации и аппетит к целям',
      en: 'E-6: Dopaminergic Motivation & Goal Appetite',
      es: 'E-6: Motivación dopaminérgica y apetito por metas',
    },
    situation: {
      ru: 'Вам предлагают перспективную возможность, сулящую значительный рост дохода и статуса через 3-6 месяцев.',
      en: 'You are offered a promising opportunity promising substantial income and status growth in 3-6 months.',
      es: 'Te ofrecen una oportunidad prometedora con gran crecimiento de ingresos y estatus en 3-6 meses.',
    },
    question: {
      ru: 'Какова ваша первая спонтанная внутренняя реакция?',
      en: 'What is your immediate spontaneous internal reaction?',
      es: '¿Cuál es tu reacción interna inmediata y espontánea?',
    },
    options: {
      A: {
        ru: 'A) Внутренний огонь: «Отличный вызов! Берусь немедленно и масштабирую результат».',
        en: 'A) Inner fire: "Terrific challenge! I jump in immediately to scale the upside."',
        es: 'A) Fuego interior: "¡Gran desafío! Entro de inmediato para escalar el resultado."',
      },
      B: {
        ru: 'B) Здравый расчет: оцениваю ресурсы, трудозатраты и взвешенно соглашаюсь на выгодных условиях.',
        en: 'B) Sound calculation: evaluate resources, ROI, and deliberately agree on favorable terms.',
        es: 'B) Cálculo sereno: evalúo recursos y acepto deliberadamente con buenas condiciones.',
      },
      C: {
        ru: 'C) Усталость и отторжение: «Господи, только не новые обязательства, мне бы с текущим справиться».',
        en: 'C) Weariness and recoil: "Please, no new burdens, I can barely keep up with current duties."',
        es: 'C) Fatiga y rechazo: "Por favor, más obligaciones no, apenas puedo con lo actual."',
      },
      D: {
        ru: 'D) Тревожный синдром самозванца: «А вдруг не справлюсь, опозорюсь, потеряю контроль и подведу всех?».',
        en: 'D) Anxious imposter syndrome: "What if I fail, lose control, make a fool of myself, and let everyone down?".',
        es: 'D) Ansiedad e impostor: "¿Y si fallo, pierdo el control y defraudo a todo el mundo?".',
      },
      E: {
        ru: 'E) Безразличие: ощущение, что любые цели бессмысленны и все равно ничего кардинально не изменится.',
        en: 'E) Indifference: feeling that any ambition is futile and nothing will fundamentally change anyway.',
        es: 'E) Indiferencia: sensación de que cualquier meta es inútil y nada cambiará de todos modos.',
      },
    },
  },
  {
    id: 7,
    title: {
      ru: 'Э-7: Автономность и устойчивость личных границ',
      en: 'E-7: Autonomy & Boundary Resilience',
      es: 'E-7: Autonomía y firmeza de límites personales',
    },
    situation: {
      ru: 'Коллега, партнер или клиент пытается навязать вам неоплачиваемую работу или нарушить ваши договоренности.',
      en: 'A colleague, partner, or client attempts to impose unpaid work or breach your explicit agreements.',
      es: 'Un colega, socio o cliente intenta imponerte trabajo no remunerado o violar acuerdos previos.',
    },
    question: {
      ru: 'Как вы реагируете и защищаете свой ресурс?',
      en: 'How do you respond and defend your resources?',
      es: '¿Cómo respondes y defiendes tus recursos?',
    },
    options: {
      A: {
        ru: 'A) Спокойно и жестко ставлю на место: «Это выходит за рамки условий. Либо доплата, либо исключаем».',
        en: 'A) Calmly and firmly set boundaries: "This exceeds agreed scope. Either extra budget, or we exclude it."',
        es: 'A) Firme y sereno: "Esto excede el acuerdo. O se abona aparte o queda fuera."',
      },
      B: {
        ru: 'B) Корректно напоминаю регламент и предлагаю конструктивный альтернативный вариант без эмоций.',
        en: 'B) Politely reference the protocol and propose a constructive, unemotional alternative.',
        es: 'B) Recuerdo amablemente el protocolo y propongo una alternativa constructiva sin drama.',
      },
      C: {
        ru: 'C) Сдаюсь из-за нехватки сил спорить: делаю молча через раздражение и злость на себя.',
        en: 'C) Capitulate due to lack of energy to argue: do it silently harboring resentment and self-anger.',
        es: 'C) Cedo por falta de energía para discutir: lo hago en silencio con rabia hacia mí mismo.',
      },
      D: {
        ru: 'D) Взрываюсь агрессией или впадаю в паническое чувство вины и долгие мучительные самооправдания.',
        en: 'D) Flare up with reactive aggression or spiral into panic guilt and agonizing overthinking.',
        es: 'D) Exploto con agresión reactiva o caigo en culpa y rumiación dolorosa.',
      },
      E: {
        ru: 'E) Ухожу от ответа («страусиная позиция»): игнорирую сообщения, откладываю контакт, надеясь, что само рассосется.',
        en: 'E) Ostrich avoidance: ghost messages, delay contact, hoping the conflict disappears on its own.',
        es: 'E) Evasión del avestruz: ignoro mensajes y pospongo con la esperanza de que pase solo.',
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
