import { SocionicsScreen } from '../../src/types/socionics.js';

export const SCREENS_1_TO_15: SocionicsScreen[] = [
  // БЛОК 1: РЕАКЦИЯ НА НЕОПРЕДЕЛЁННОСТЬ И НОВОЕ
  {
    id: 1,
    blockId: 1,
    blockTitle: {
      ru: 'БЛОК 1: РЕАКЦИЯ НА НЕОПРЕДЕЛЁННОСТЬ И НОВОЕ',
      en: 'BLOCK 1: REACTION TO UNCERTAINTY AND THE NEW',
      es: 'BLOQUE 1: REACCIÓN A LA INCERTIDUMBRE Y LO NUEVO',
    },
    title: {
      ru: 'Незнакомое место',
      en: 'Unfamiliar Place',
      es: 'Lugar desconocido',
    },
    situation: {
      ru: 'Вы оказались в новом городе, где никогда не были. У вас есть свободный вечер.',
      en: 'You find yourself in a new city you have never been to. You have a free evening.',
      es: 'Te encuentras en una ciudad nueva en la que nunca has estado. Tienes una tarde libre.',
    },
    question: {
      ru: 'Что вы сделаете в первую очередь?',
      en: 'What will you do first?',
      es: '¿Qué harás en primer lugar?',
    },
    options: {
      A: {
        ru: 'Пойду туда, где обещают что-то интересное и необычное — может быть, откроется что-то неожиданное',
        en: 'I will go where something interesting and unusual is promised — maybe something unexpected will open up',
        es: 'Iré a donde prometan algo interesante e inusual: tal vez se abra algo inesperado',
      },
      B: {
        ru: 'Постараюсь понять структуру города — где центр, где ключевые районы, как всё связано',
        en: 'I will try to understand the city structure — where the center is, key districts, and how it is all connected',
        es: 'Intentaré entender la estructura de la ciudad: dónde está el centro, los distritos clave y cómo se conecta todo',
      },
      C: {
        ru: 'Найду место, где можно хорошо провести время — ресторан, развлечение, что-то приятное',
        en: 'I will find a place where I can have a good time — a restaurant, entertainment, something pleasant',
        es: 'Buscaré un lugar donde pasar un buen rato: un restaurante, entretenimiento o algo agradable',
      },
      D: {
        ru: 'Просто пойду гулять и смотреть, что происходит вокруг, без конкретного плана',
        en: 'I will just go for a walk and observe what is happening around, with no specific plan',
        es: 'Simplemente saldré a pasear y ver qué ocurre alrededor, sin un plan concreto',
      },
      E: {
        ru: 'Постараюсь найти местных жителей, чтобы они рассказали мне что-то важное о городе',
        en: 'I will try to find locals so they can tell me something important about the city',
        es: 'Intentaré encontrar a habitantes locales para que me cuenten algo importante sobre la ciudad',
      },
    },
  },
  {
    id: 2,
    blockId: 1,
    blockTitle: {
      ru: 'БЛОК 1: РЕАКЦИЯ НА НЕОПРЕДЕЛЁННОСТЬ И НОВОЕ',
      en: 'BLOCK 1: REACTION TO UNCERTAINTY AND THE NEW',
      es: 'BLOQUE 1: REACCIÓN A LA INCERTIDUMBRE Y LO NUEVO',
    },
    title: {
      ru: 'Новая информация',
      en: 'New Information',
      es: 'Nueva información',
    },
    situation: {
      ru: 'Вам рассказали о чём-то совершенно новом, чего вы раньше не знали.',
      en: 'You were told about something completely new that you did not know before.',
      es: 'Te contaron sobre algo completamente nuevo que no sabías antes.',
    },
    question: {
      ru: 'Какова ваша первая реакция?',
      en: 'What is your first reaction?',
      es: '¿Cuál es tu primera reacción?',
    },
    options: {
      A: {
        ru: 'Сразу начинаю думать о том, как это можно применить и какие возможности это открывает',
        en: 'I immediately start thinking about how this can be applied and what opportunities it opens up',
        es: 'Inmediatamente empiezo a pensar en cómo se puede aplicar y qué oportunidades abre',
      },
      B: {
        ru: 'Пытаюсь понять логику — как это устроено, какие принципы лежат в основе',
        en: 'I try to grasp the logic — how it works, what principles underlie it',
        es: 'Intento comprender la lógica: cómo funciona y qué principios subyacen',
      },
      C: {
        ru: 'Думаю о том, как это повлияет на людей и какие эмоции вызовет',
        en: 'I think about how this will affect people and what emotions it will evoke',
        es: 'Pienso en cómo afectará a las personas y qué emociones provocará',
      },
      D: {
        ru: 'Оцениваю, насколько это практично и выполнимо в реальных условиях',
        en: 'I evaluate how practical and feasible this is in real-world conditions',
        es: 'Evalúo cuán práctico y realizable es en condiciones reales',
      },
      E: {
        ru: 'Запоминаю факт, но не углубляюсь, если это не касается меня напрямую',
        en: 'I memorize the fact, but do not dive deeper if it does not concern me directly',
        es: 'Memorizo el dato, pero no profundizo si no me concierne directamente',
      },
    },
  },
  {
    id: 3,
    blockId: 1,
    blockTitle: {
      ru: 'БЛОК 1: РЕАКЦИЯ НА НЕОПРЕДЕЛЁННОСТЬ И НОВОЕ',
      en: 'BLOCK 1: REACTION TO UNCERTAINTY AND THE NEW',
      es: 'BLOQUE 1: REACCIÓN A LA INCERTIDUMBRE Y LO NUEVO',
    },
    title: {
      ru: 'Неожиданное изменение',
      en: 'Unexpected Change',
      es: 'Cambio inesperado',
    },
    situation: {
      ru: 'Вы планировали день, но обстоятельства резко изменились.',
      en: 'You had planned your day, but circumstances changed abruptly.',
      es: 'Habías planeado el día, pero las circunstancias cambiaron bruscamente.',
    },
    question: {
      ru: 'Как вы реагируете?',
      en: 'How do you react?',
      es: '¿Cómo reaccionas?',
    },
    options: {
      A: {
        ru: 'Вижу в этом возможность — может быть, это знак, что нужно делать что-то другое',
        en: 'I see an opportunity in this — perhaps it is a sign to do something else',
        es: 'Veo en esto una oportunidad: tal vez sea una señal para hacer otra cosa',
      },
      B: {
        ru: 'Раздражаюсь, потому что нарушен порядок и структура',
        en: 'I get annoyed because order and structure have been disrupted',
        es: 'Me irrito porque se rompió el orden y la estructura',
      },
      C: {
        ru: 'Быстро ищу альтернативу — что ещё можно сделать с пользой',
        en: 'I quickly search for an alternative — what else can be done usefully',
        es: 'Busco rápidamente una alternativa: qué más puedo hacer con provecho',
      },
      D: {
        ru: 'Переключаюсь на то, что можно сделать физически прямо сейчас',
        en: 'I switch to what can be done physically right now',
        es: 'Paso a hacer lo que se puede hacer físicamente ahora mismo',
      },
      E: {
        ru: 'Легко принимаю изменения — планы всё равно редко сбываются точно',
        en: 'I easily accept changes — plans rarely turn out exact anyway',
        es: 'Acepto los cambios con facilidad: los planes rara vez se cumplen con exactitud de todos modos',
      },
    },
  },

  // БЛОК 2: ОТНОШЕНИЕ К СТРУКТУРАМ И СИСТЕМАМ
  {
    id: 4,
    blockId: 2,
    blockTitle: {
      ru: 'БЛОК 2: ОТНОШЕНИЕ К СТРУКТУРАМ И СИСТЕМАМ',
      en: 'BLOCK 2: ATTITUDE TOWARDS STRUCTURES AND SYSTEMS',
      es: 'BLOQUE 2: ACTITUD HACIA LAS ESTRUCTURAS Y SISTEMAS',
    },
    title: {
      ru: 'Группа людей',
      en: 'Group of People',
      es: 'Grupo de personas',
    },
    situation: {
      ru: 'Вы оказались в новой группе людей, которые работают над общей задачей.',
      en: 'You find yourself in a new group of people working on a shared task.',
      es: 'Te encuentras en un nuevo grupo de personas que trabajan en una tarea común.',
    },
    question: {
      ru: 'Что вы замечаете в первую очередь?',
      en: 'What do you notice first?',
      es: '¿Qué notas en primer lugar?',
    },
    options: {
      A: {
        ru: 'Какие идеи обсуждаются и насколько они глубоки и интересны',
        en: 'What ideas are being discussed and how profound and interesting they are',
        es: 'Qué ideas se debaten y cuán profundas e interesantes son',
      },
      B: {
        ru: 'Кто здесь лидер, кто подчиняется, как распределены роли и власть',
        en: 'Who the leader is, who follows, how roles and power are distributed',
        es: 'Quién es el líder, quién obedece, cómo se distribuyen los roles y el poder',
      },
      C: {
        ru: 'Кто из участников наиболее полезен и эффективен',
        en: 'Which participants are the most useful and effective',
        es: 'Quiénes de los participantes son los más útiles y eficaces',
      },
      D: {
        ru: 'Как люди взаимодействуют физически — кто что делает, как двигаются',
        en: 'How people interact physically — who is doing what, how they move',
        es: 'Cómo interactúan físicamente las personas: quién hace qué, cómo se mueven',
      },
      E: {
        ru: 'Насколько приятна атмосфера в группе, какие эмоции царят',
        en: 'How pleasant the group atmosphere is, what emotions prevail',
        es: 'Cuán agradable es el ambiente en el grupo, qué emociones reinan',
      },
    },
  },
  {
    id: 5,
    blockId: 2,
    blockTitle: {
      ru: 'БЛОК 2: ОТНОШЕНИЕ К СТРУКТУРАМ И СИСТЕМАМ',
      en: 'BLOCK 2: ATTITUDE TOWARDS STRUCTURES AND SYSTEMS',
      es: 'BLOQUE 2: ACTITUD HACIA LAS ESTRUCTURAS Y SISTEMAS',
    },
    title: {
      ru: 'Сложная система',
      en: 'Complex System',
      es: 'Sistema complejo',
    },
    situation: {
      ru: 'Вам нужно разобраться в сложной системе (правила игры, программа, организация).',
      en: 'You need to understand a complex system (game rules, software program, organization).',
      es: 'Necesitas entender un sistema complejo (reglas de un juego, programa, organización).',
    },
    question: {
      ru: 'Как вы подходите к этому?',
      en: 'How do you approach this?',
      es: '¿Cómo lo abordas?',
    },
    options: {
      A: {
        ru: 'Сначала пытаюсь увидеть общую картину и логику, как всё связано',
        en: 'First I try to see the big picture and logic, how everything is connected',
        es: 'Primero intento ver el panorama general y la lógica, cómo se conecta todo',
      },
      B: {
        ru: 'Изучаю детали и конкретные правила, как это работает на практике',
        en: 'I study details and specific rules, how it works in practice',
        es: 'Estudio los detalles y las reglas concretas, cómo funciona en la práctica',
      },
      C: {
        ru: 'Ищу того, кто уже разбирается, и учусь у него',
        en: 'I look for someone who already understands it and learn from them',
        es: 'Busco a alguien que ya lo domine y aprendo de él',
      },
      D: {
        ru: 'Пробую действовать сразу, понимая по ходу дела',
        en: 'I try to act right away, figuring things out as I go along',
        es: 'Intento actuar de inmediato, comprendiendo sobre la marcha',
      },
      E: {
        ru: 'Если это не обязательно, откладываю — зачем тратить время на сложное',
        en: 'If it is not mandatory, I postpone it — why waste time on complicated things',
        es: 'Si no es obligatorio, lo pospongo: para qué perder el tiempo en cosas complicadas',
      },
    },
  },
  {
    id: 6,
    blockId: 2,
    blockTitle: {
      ru: 'БЛОК 2: ОТНОШЕНИЕ К СТРУКТУРАМ И СИСТЕМАМ',
      en: 'BLOCK 2: ATTITUDE TOWARDS STRUCTURES AND SYSTEMS',
      es: 'BLOQUE 2: ACTITUD HACIA LAS ESTRUCTURAS Y SISTEMAS',
    },
    title: {
      ru: 'Иерархия',
      en: 'Hierarchy',
      es: 'Jerarquía',
    },
    situation: {
      ru: 'Вы видите, что в организации есть чёткая иерархия и субординация.',
      en: 'You see that an organization has a strict hierarchy and chain of command.',
      es: 'Ves que en la organización hay una jerarquía y subordinación claras.',
    },
    question: {
      ru: 'Как вы к этому относитесь?',
      en: 'How do you feel about this?',
      es: '¿Cómo te posicionas ante esto?',
    },
    options: {
      A: {
        ru: 'Уважаю порядок, если он логичен и справедлив',
        en: 'I respect order if it is logical and fair',
        es: 'Respeto el orden si es lógico y justo',
      },
      B: {
        ru: 'Пытаюсь понять, кто реально имеет влияние, а не только формальный статус',
        en: 'I try to understand who holds real influence, not just formal status',
        es: 'Intento entender quién tiene influencia real, no solo estatus formal',
      },
      C: {
        ru: 'Подчиняюсь правилам, но ищу способы оптимизировать процессы',
        en: 'I comply with the rules, but look for ways to optimize processes',
        es: 'Cumplo las normas, pero busco formas de optimizar los procesos',
      },
      D: {
        ru: 'Чувствую дискомфорт, если иерархия слишком жёсткая',
        en: 'I feel discomfort if hierarchy is overly rigid',
        es: 'Siento incomodidad si la jerarquía es demasiado estricta',
      },
      E: {
        ru: 'Не обращаю внимания, если это не мешает мне делать своё дело',
        en: 'I pay no attention to it as long as it does not hinder me from doing my work',
        es: 'No le presto atención si no me impide hacer mi trabajo',
      },
    },
  },

  // БЛОК 3: ОТНОШЕНИЕ К ЛЮДЯМ И ОТНОШЕНИЯМ
  {
    id: 7,
    blockId: 3,
    blockTitle: {
      ru: 'БЛОК 3: ОТНОШЕНИЕ К ЛЮДЯМ И ОТНОШЕНИЯМ',
      en: 'BLOCK 3: ATTITUDE TOWARDS PEOPLE AND RELATIONSHIPS',
      es: 'BLOQUE 3: ACTITUD HACIA LAS PERSONAS Y RELACIONES',
    },
    title: {
      ru: 'Конфликт в группе',
      en: 'Conflict in a Group',
      es: 'Conflicto en el grupo',
    },
    situation: {
      ru: 'В группе людей начинается спор о чём-то важном. Мнения разделяются.',
      en: 'In a group of people, a dispute arises over something important. Opinions divide.',
      es: 'En un grupo de personas surge una discusión sobre algo importante. Las opiniones se dividen.',
    },
    question: {
      ru: 'Как вы обычно ведёте себя?',
      en: 'How do you usually behave?',
      es: '¿Cómo sueles comportarte?',
    },
    options: {
      A: {
        ru: 'Пытаюсь понять суть спора, найти общие принципы, на которых все могут согласиться',
        en: 'I try to understand the core of the dispute, finding common principles everyone can agree on',
        es: 'Intento entender la esencia de la discusión y encontrar principios comunes en los que todos coincidan',
      },
      B: {
        ru: 'Замечаю, кто из участников более авторитетен или убедителен, и ориентируюсь на это',
        en: 'I notice who among participants is more authoritative or persuasive, and orient myself by that',
        es: 'Noto quién de los participantes es más autoritario o convincente y me oriento por eso',
      },
      C: {
        ru: 'Слушаю разные точки зрения, чтобы выбрать наиболее практичную для себя',
        en: 'I listen to different viewpoints to choose the most practical one for myself',
        es: 'Escucho diferentes puntos de vista para elegir el más práctico para mí',
      },
      D: {
        ru: 'Если спор становится слишком абстрактным, пытаюсь перевести его в конкретные примеры',
        en: 'If the dispute gets too abstract, I try to bring it down to concrete examples',
        es: 'Si la discusión se vuelve demasiado abstracta, intento llevarla a ejemplos concretos',
      },
      E: {
        ru: 'Участвую, если тема мне интересна, иначе переключаюсь на что-то другое',
        en: 'I participate if the topic interests me; otherwise, I switch to something else',
        es: 'Participo si el tema me interesa; de lo contrario, cambio a otra cosa',
      },
    },
  },
  {
    id: 8,
    blockId: 3,
    blockTitle: {
      ru: 'БЛОК 3: ОТНОШЕНИЕ К ЛЮДЯМ И ОТНОШЕНИЯМ',
      en: 'BLOCK 3: ATTITUDE TOWARDS PEOPLE AND RELATIONSHIPS',
      es: 'BLOQUE 3: ACTITUD HACIA LAS PERSONAS Y RELACIONES',
    },
    title: {
      ru: 'Эмоции другого',
      en: 'Emotions of Another',
      es: 'Emociones del otro',
    },
    situation: {
      ru: 'Кто-то рядом с вами явно расстроен или взволнован.',
      en: 'Someone next to you is visibly upset or agitated.',
      es: 'Alguien cerca de ti está claramente disgustado o alterado.',
    },
    question: {
      ru: 'Какова ваша первая реакция?',
      en: 'What is your first reaction?',
      es: '¿Cuál es tu primera reacción?',
    },
    options: {
      A: {
        ru: 'Пытаюсь понять, что именно его беспокоит и почему',
        en: 'I try to understand what exactly is bothering them and why',
        es: 'Intento entender qué le preocupa exactamente y por qué',
      },
      B: {
        ru: 'Чувствую его состояние и стараюсь создать атмосферу, в которой ему станет легче',
        en: 'I feel their state and try to create an atmosphere where they will feel better',
        es: 'Siento su estado e intento crear un ambiente en el que se sienta aliviado',
      },
      C: {
        ru: 'Думаю о том, как я могу помочь практически — что сделать, чтобы исправить ситуацию',
        en: 'I think about how I can help practically — what actions to take to fix the situation',
        es: 'Pienso en cómo puedo ayudar prácticamente: qué hacer para solucionar la situación',
      },
      D: {
        ru: 'Пытаюсь отвлечь его, переключить внимание на что-то позитивное',
        en: 'I try to distract them, shifting their focus to something positive',
        es: 'Intento distraerle, cambiando su atención hacia algo positivo',
      },
      E: {
        ru: 'Чувствую дискомфорт, но не знаю, как реагировать — стараюсь не вмешиваться',
        en: 'I feel discomfort and do not know how to react — I try not to interfere',
        es: 'Siento incomodidad y no sé cómo reaccionar: intento no intervenir',
      },
    },
  },

  // БЛОК 4: ОТНОШЕНИЕ К ВРЕМЕНИ И ЗАВЕРШЁННОСТИ
  {
    id: 9,
    blockId: 4,
    blockTitle: {
      ru: 'БЛОК 4: ОТНОШЕНИЕ К ВРЕМЕНИ И ЗАВЕРШЁННОСТИ',
      en: 'BLOCK 4: ATTITUDE TOWARDS TIME AND COMPLETION',
      es: 'BLOQUE 4: ACTITUD HACIA EL TIEMPO Y LA FINALIZACIÓN',
    },
    title: {
      ru: 'Незавершённое дело',
      en: 'Unfinished Task',
      es: 'Asunto pendiente',
    },
    situation: {
      ru: 'Вы начали что-то делать (мастерить, готовить, собирать), но прервались. Прошло несколько дней.',
      en: 'You started doing something (crafting, cooking, assembling), but were interrupted. Several days have passed.',
      es: 'Empezaste a hacer algo (manualidades, cocinar, montar), pero te interrumpiste. Pasaron varios días.',
    },
    question: {
      ru: 'Когда вы вспоминаете об этом, что вы чувствуете?',
      en: 'When you recall it, what do you feel?',
      es: 'Cuando te acuerdas de ello, ¿qué sientes?',
    },
    options: {
      A: {
        ru: 'Думаю о том, что я хотел создать и почему это было важно для меня',
        en: 'I think about what I wanted to create and why it was important to me',
        es: 'Pienso en lo que quería crear y por qué era importante para mí',
      },
      B: {
        ru: 'Понимаю, что нужно вернуться и закончить — это незакрытая задача, которая висит',
        en: 'I realize I need to return and finish it — it is an open loop hanging over me',
        es: 'Entiendo que debo volver y terminarlo: es una tarea abierta que sigue pendiente',
      },
      C: {
        ru: 'Вспоминаю, было ли мне интересно это делать, и решаю, стоит ли продолжать',
        en: 'I recall whether I enjoyed doing it, and decide if it is worth continuing',
        es: 'Recuerdo si me resultaba interesante hacerlo y decido si vale la pena continuar',
      },
      D: {
        ru: 'Думаю, что нужно доделать — вещь должна быть готова, иначе зачем начинал',
        en: 'I think it must be finished — the item must be ready, otherwise why start',
        es: 'Pienso que hay que terminarlo: el objeto debe estar listo, si no para qué empezar',
      },
      E: {
        ru: 'Забываю об этом, если не было конкретной причины продолжать',
        en: 'I forget about it unless there was a specific reason to continue',
        es: 'Me olvido de ello si no había una razón concreta para continuar',
      },
    },
  },
  {
    id: 10,
    blockId: 4,
    blockTitle: {
      ru: 'БЛОК 4: ОТНОШЕНИЕ К ВРЕМЕНИ И ЗАВЕРШЁННОСТИ',
      en: 'BLOCK 4: ATTITUDE TOWARDS TIME AND COMPLETION',
      es: 'BLOQUE 4: ACTITUD HACIA EL TIEMPO Y LA FINALIZACIÓN',
    },
    title: {
      ru: 'Дедлайн',
      en: 'Deadline',
      es: 'Plazo límite',
    },
    situation: {
      ru: 'У вас есть задача, которую нужно выполнить к определённому сроку.',
      en: 'You have a task that must be completed by a specific deadline.',
      es: 'Tienes una tarea que debe completarse para una fecha límite determinada.',
    },
    question: {
      ru: 'Как вы к этому подходите?',
      en: 'How do you approach this?',
      es: '¿Cómo lo enfocas?',
    },
    options: {
      A: {
        ru: 'Начинаю заранее, чтобы было время на размышления и возможные изменения',
        en: 'I start early to allow ample time for reflection and possible adjustments',
        es: 'Empiezo con antelación para tener tiempo de reflexionar y hacer posibles cambios',
      },
      B: {
        ru: 'Составляю план и строго следую ему, чтобы всё было готово вовремя',
        en: 'I make a plan and strictly follow it so everything is completed on time',
        es: 'Elaboro un plan y lo sigo con rigor para que todo esté listo a tiempo',
      },
      C: {
        ru: 'Делаю в последнюю очередь самое важное, оставляя время на доработку',
        en: 'I prioritize the most important part at the last stage, leaving room for refinement',
        es: 'Hago lo más importante en el último momento, dejando tiempo para retoques',
      },
      D: {
        ru: 'Работаю интенсивно, но только когда приближается срок — так эффективнее',
        en: 'I work intensely only when the deadline gets close — it is more efficient that way',
        es: 'Trabajo intensamente solo cuando se acerca el plazo: es más eficiente así',
      },
      E: {
        ru: 'Стараюсь закончить как можно раньше, чтобы не думать об этом',
        en: 'I try to finish as early as possible so I do not have to think about it',
        es: 'Procuro terminar lo antes posible para no tener que pensar más en ello',
      },
    },
  },
  {
    id: 11,
    blockId: 4,
    blockTitle: {
      ru: 'БЛОК 4: ОТНОШЕНИЕ К ВРЕМЕНИ И ЗАВЕРШЁННОСТИ',
      en: 'BLOCK 4: ATTITUDE TOWARDS TIME AND COMPLETION',
      es: 'BLOQUE 4: ACTITUD HACIA EL TIEMPO Y LA FINALIZACIÓN',
    },
    title: {
      ru: 'Длительный проект',
      en: 'Long-term Project',
      es: 'Proyecto a largo plazo',
    },
    situation: {
      ru: 'Вам предлагают заняться чем-то, что займёт много времени — несколько месяцев или лет.',
      en: 'You are offered to take on something that will require substantial time — several months or years.',
      es: 'Te ofrecen emprender algo que requerirá mucho tiempo: varios meses o años.',
    },
    question: {
      ru: 'Что вы оцените в первую очередь?',
      en: 'What will you evaluate first?',
      es: '¿Qué evaluarás en primer lugar?',
    },
    options: {
      A: {
        ru: 'Насколько это интересно с точки зрения идей и возможностей для развития',
        en: 'How interesting it is regarding ideas and potential for development',
        es: 'Cuán interesante es desde la perspectiva de ideas y oportunidades de desarrollo',
      },
      B: {
        ru: 'Кто будет участвовать и какова будет моя роль в этом',
        en: 'Who will participate and what my role in it will be',
        es: 'Quién participará y cuál será mi rol en ello',
      },
      C: {
        ru: 'Что я получу для себя — навыки, связи, опыт, конкретный результат',
        en: 'What I will gain personally — skills, network, experience, concrete result',
        es: 'Qué obtendré para mí: habilidades, contactos, experiencia, resultado concreto',
      },
      D: {
        ru: 'Насколько это реально и выполнимо на практике',
        en: 'How realistic and feasible it is in practice',
        es: 'Cuán real y realizable es en la práctica',
      },
      E: {
        ru: 'Понравится ли мне сам процесс этого занятия',
        en: 'Whether I will genuinely enjoy the ongoing process of doing it',
        es: 'Si realmente disfrutaré del proceso mismo de la actividad',
      },
    },
  },

  // БЛОК 5: ФИЗИЧЕСКАЯ АКТИВНОСТЬ И ОЩУЩЕНИЯ
  {
    id: 12,
    blockId: 5,
    blockTitle: {
      ru: 'БЛОК 5: ФИЗИЧЕСКАЯ АКТИВНОСТЬ И ОЩУЩЕНИЯ',
      en: 'BLOCK 5: PHYSICAL ACTIVITY AND SENSATIONS',
      es: 'BLOQUE 5: ACTIVIDAD FÍSICA Y SENSACIONES',
    },
    title: {
      ru: 'Физическая усталость',
      en: 'Physical Fatigue',
      es: 'Fatiga física',
    },
    situation: {
      ru: 'После долгого дня вы чувствуете сильную усталость.',
      en: 'After a long day, you feel profound fatigue.',
      es: 'Tras un largo día, sientes un profundo cansancio.',
    },
    question: {
      ru: 'Что поможет вам восстановиться лучше всего?',
      en: 'What helps you recover best?',
      es: '¿Qué te ayuda a recuperarte mejor?',
    },
    options: {
      A: {
        ru: 'Тишина и возможность подумать, поразмышлять в одиночестве',
        en: 'Silence and the opportunity to reflect and contemplate in solitude',
        es: 'Silencio y la oportunidad de pensar y reflexionar en soledad',
      },
      B: {
        ru: 'Чувство, что день был продуктивным и всё сделано правильно',
        en: 'The feeling that the day was productive and everything was done properly',
        es: 'La sensación de que el día fue productivo y todo se hizo correctamente',
      },
      C: {
        ru: 'Приятное занятие — еда, музыка, общение с близкими',
        en: 'A pleasant activity — good food, music, socializing with loved ones',
        es: 'Una actividad agradable: buena comida, música, conversar con seres queridos',
      },
      D: {
        ru: 'Физическая активность — прогулка, спорт, работа руками',
        en: 'Physical activity — a walk, sports, hands-on crafting',
        es: 'Actividad física: paseo, deporte o trabajo manual',
      },
      E: {
        ru: 'Сон и отдых без лишних мыслей',
        en: 'Sleep and pure rest free of extraneous thoughts',
        es: 'Dormir y descansar sin pensamientos innecesarios',
      },
    },
  },
  {
    id: 13,
    blockId: 5,
    blockTitle: {
      ru: 'БЛОК 5: ФИЗИЧЕСКАЯ АКТИВНОСТЬ И ОЩУЩЕНИЯ',
      en: 'BLOCK 5: PHYSICAL ACTIVITY AND SENSATIONS',
      es: 'BLOQUE 5: ACTIVIDAD FÍSICA Y SENSACIONES',
    },
    title: {
      ru: 'Физическая работа',
      en: 'Physical Work',
      es: 'Trabajo físico',
    },
    situation: {
      ru: 'Вам предстоит выполнить работу, требующую физических усилий.',
      en: 'You are faced with a task that requires substantial physical effort.',
      es: 'Debes realizar una labor que requiere esfuerzo físico.',
    },
    question: {
      ru: 'Как вы к этому относитесь?',
      en: 'How do you view this?',
      es: '¿Cómo lo afrontas?',
    },
    options: {
      A: {
        ru: 'Стараюсь найти способ сделать это эффективнее или делегировать',
        en: 'I try to find a way to make it more efficient or delegate it',
        es: 'Intento encontrar una manera de hacerlo más eficiente o delegarlo',
      },
      B: {
        ru: 'Выполняю дисциплинированно — это моя задача, и я её сделаю',
        en: 'I perform it with discipline — it is my task, and I will complete it',
        es: 'Lo realizo con disciplina: es mi deber y lo cumpliré',
      },
      C: {
        ru: 'Если это приносит конкретную пользу, готов работать',
        en: 'If it yields concrete value, I am ready to work',
        es: 'Si aporta un beneficio concreto, estoy dispuesto a trabajar',
      },
      D: {
        ru: 'Предпочитаю физическую работу — она успокаивает и даёт ощущение результата',
        en: 'I prefer physical work — it calms me and gives a tangible sense of achievement',
        es: 'Prefiero el trabajo físico: me tranquiliza y brinda una sensación tangible de logro',
      },
      E: {
        ru: 'Стараюсь избежать или минимизировать — физическая нагрузка меня утомляет',
        en: 'I try to avoid or minimize it — heavy physical strain exhausts me',
        es: 'Procuro evitarlo o minimizarlo: la carga física me agota',
      },
    },
  },
  {
    id: 14,
    blockId: 5,
    blockTitle: {
      ru: 'БЛОК 5: ФИЗИЧЕСКАЯ АКТИВНОСТЬ И ОЩУЩЕНИЯ',
      en: 'BLOCK 5: PHYSICAL ACTIVITY AND SENSATIONS',
      es: 'BLOQUE 5: ACTIVIDAD FÍSICA Y SENSACIONES',
    },
    title: {
      ru: 'Комфорт и неудобство',
      en: 'Comfort and Inconvenience',
      es: 'Confort e incomodidad',
    },
    situation: {
      ru: 'Вы находитесь в месте, где вам физически некомфортно (жарко, холодно, неудобно сидеть).',
      en: 'You are in a place where you are physically uncomfortable (too hot, cold, uncomfortable seating).',
      es: 'Estás en un lugar donde sientes incomodidad física (calor, frío, asiento incómodo).',
    },
    question: {
      ru: 'Что вы делаете?',
      en: 'What do you do?',
      es: '¿Qué haces?',
    },
    options: {
      A: {
        ru: 'Стараюсь не обращать внимания — думаю о чём-то другом',
        en: 'I try not to pay attention — I focus my thoughts on something else',
        es: 'Intento no prestarle atención: pienso en otra cosa',
      },
      B: {
        ru: 'Терплю, если это необходимо — дискомфорт не должен мешать делу',
        en: 'I endure it if necessary — discomfort should not get in the way of business',
        es: 'Aguanto si es necesario: la incomodidad no debe obstaculizar el trabajo',
      },
      C: {
        ru: 'Ищу способ улучшить ситуацию — открыть окно, переместиться, что-то изменить',
        en: 'I look for ways to improve the situation — open a window, relocate, adjust something',
        es: 'Busco la manera de mejorar la situación: abrir la ventana, cambiar de sitio o ajustar algo',
      },
      D: {
        ru: 'Сразу делаю всё, чтобы стало комфортно — это важно для моей продуктивности',
        en: 'I immediately fix everything to make it comfortable — it is crucial for my productivity',
        es: 'Hago todo de inmediato para estar cómodo: es fundamental para mi productividad',
      },
      E: {
        ru: 'Ухожу, если есть возможность — незачем страдать',
        en: 'I leave if there is an opportunity — there is no point in suffering',
        es: 'Me voy si tengo la oportunidad: no tiene sentido sufrir',
      },
    },
  },

  // БЛОК 6: ПРИНЯТИЕ РЕШЕНИЙ И ОТВЕТСТВЕННОСТЬ
  {
    id: 15,
    blockId: 6,
    blockTitle: {
      ru: 'БЛОК 6: ПРИНЯТИЕ РЕШЕНИЙ И ОТВЕТСТВЕННОСТЬ',
      en: 'BLOCK 6: DECISION MAKING AND RESPONSIBILITY',
      es: 'BLOQUE 6: TOMA DE DECISIONES Y RESPONSABILIDAD',
    },
    title: {
      ru: 'Важное решение',
      en: 'Important Decision',
      es: 'Decisión importante',
    },
    situation: {
      ru: 'Вам нужно принять важное решение, от которого многое зависит.',
      en: 'You must make a critical decision that carries high stakes.',
      es: 'Debes tomar una decisión crucial de la que depende mucho.',
    },
    question: {
      ru: 'Как вы его принимаете?',
      en: 'How do you make it?',
      es: '¿Cómo la tomas?',
    },
    options: {
      A: {
        ru: 'Долго обдумываю все возможные последствия и смыслы',
        en: 'I deliberate at length over all potential consequences and deeper implications',
        es: 'Reflexiono largamente sobre todas las posibles consecuencias y significados',
      },
      B: {
        ru: 'Советуюсь с теми, кому доверяю, и учитываю их мнение',
        en: 'I consult with trusted advisers and take their perspective into account',
        es: 'Pido consejo a personas de confianza y tomo en cuenta su opinión',
      },
      C: {
        ru: 'Оцениваю, что принесёт мне наибольшую выгоду или пользу',
        en: 'I evaluate what will deliver the greatest gain or strategic benefit to me',
        es: 'Evalúo qué me reportará el mayor beneficio o provecho',
      },
      D: {
        ru: 'Делаю то, что кажется наиболее практичным и выполнимым',
        en: 'I choose whatever seems most practical and executable right now',
        es: 'Hago lo que parece más práctico y factible',
      },
      E: {
        ru: 'Действую интуитивно — долго думать только вредит',
        en: 'I act intuitively — overthinking only does harm',
        es: 'Actúo por intuición: pensar demasiado solo perjudica',
      },
    },
  },
];
