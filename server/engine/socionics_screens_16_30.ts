import { SocionicsScreen } from '../../src/types/socionics.js';

export const SCREENS_16_TO_30: SocionicsScreen[] = [
  // БЛОК 6: ПРИНЯТИЕ РЕШЕНИЙ И ОТВЕТСТВЕННОСТЬ (продолжение)
  {
    id: 16,
    blockId: 6,
    blockTitle: {
      ru: 'БЛОК 6: ПРИНЯТИЕ РЕШЕНИЙ И ОТВЕТСТВЕННОСТЬ',
      en: 'BLOCK 6: DECISION MAKING AND RESPONSIBILITY',
      es: 'BLOQUE 6: TOMA DE DECISIONES Y RESPONSABILIDAD',
    },
    title: {
      ru: 'Ошибка другого человека',
      en: 'Another Person’s Mistake',
      es: 'Error de otra persona',
    },
    situation: {
      ru: 'Кто-то, с кем вы взаимодействуете, допустил ошибку, которая влияет на вас.',
      en: 'Someone you collaborate with made a mistake that impacts you.',
      es: 'Alguien con quien interactúas ha cometido un error que te afecta.',
    },
    question: {
      ru: 'Какова ваша первая внутренняя реакция?',
      en: 'What is your immediate internal reaction?',
      es: '¿Cuál es tu primera reacción interna?',
    },
    options: {
      A: {
        ru: 'Пытаюсь понять, почему это произошло — что привело к ошибке',
        en: 'I try to understand why this happened — what led to the error',
        es: 'Intento entender por qué ocurrió esto: qué condujo al error',
      },
      B: {
        ru: 'Думаю о том, кто должен был это контролировать и как предотвратить подобное в будущем',
        en: 'I think about who was supposed to control this and how to prevent similar issues in the future',
        es: 'Pienso en quién debía haberlo supervisado y cómo prevenir algo similar en el futuro',
      },
      C: {
        ru: 'Оцениваю, насколько это ухудшило мою ситуацию и что я потерял',
        en: 'I assess how much this worsened my situation and what I lost',
        es: 'Evalúo en qué medida empeoró mi situación y qué he perdido',
      },
      D: {
        ru: 'Смотрю, что можно сделать прямо сейчас, чтобы исправить ситуацию',
        en: 'I see what can be done right now to fix the situation',
        es: 'Miro qué se puede hacer ahora mismo para solucionar la situación',
      },
      E: {
        ru: 'Раздражаюсь, если ошибка повторяется, но быстро забываю, если это единичный случай',
        en: 'I get irritated if the mistake repeats, but quickly forget it if it is an isolated incident',
        es: 'Me irrito si el error se repite, pero lo olvido rápido si es un caso aislado',
      },
    },
  },
  {
    id: 17,
    blockId: 6,
    blockTitle: {
      ru: 'БЛОК 6: ПРИНЯТИЕ РЕШЕНИЙ И ОТВЕТСТВЕННОСТЬ',
      en: 'BLOCK 6: DECISION MAKING AND RESPONSIBILITY',
      es: 'BLOQUE 6: TOMA DE DECISIONES Y RESPONSABILIDAD',
    },
    title: {
      ru: 'Своя ошибка',
      en: 'Your Own Mistake',
      es: 'Error propio',
    },
    situation: {
      ru: 'Вы сами допустили ошибку, которая повлияла на других.',
      en: 'You made a mistake yourself that affected others.',
      es: 'Tú mismo has cometido un error que afectó a otros.',
    },
    question: {
      ru: 'Что вы чувствуете?',
      en: 'What do you feel?',
      es: '¿Qué sientes?',
    },
    options: {
      A: {
        ru: 'Пытаюсь понять, почему это произошло и как избежать в будущем',
        en: 'I try to analyze why it happened and how to avoid it in the future',
        es: 'Intento entender por qué sucedió y cómo evitarlo en el futuro',
      },
      B: {
        ru: 'Чувствую ответственность — я должен был контролировать лучше',
        en: 'I feel accountable — I should have maintained better oversight',
        es: 'Siento responsabilidad: debí haberlo controlado mejor',
      },
      C: {
        ru: 'Думаю о том, как это повлияло на мой статус или репутацию',
        en: 'I think about how this impacted my status or reputation',
        es: 'Pienso en cómo esto ha afectado a mi estatus o reputación',
      },
      D: {
        ru: 'Сразу начинаю исправлять — что можно сделать прямо сейчас',
        en: 'I immediately jump into correction mode — what can be fixed right now',
        es: 'Empiezo a corregirlo de inmediato: qué se puede hacer ahora mismo',
      },
      E: {
        ru: 'Расстраиваюсь, но быстро забываю — ошибки случаются у всех',
        en: 'I get upset briefly, but move on quickly — mistakes happen to everyone',
        es: 'Me disgusta, pero lo olvido rápido: los errores le ocurren a cualquiera',
      },
    },
  },

  // БЛОК 7: ВАШ ИСКРЕННИЙ ВЫБОР
  {
    id: 18,
    blockId: 7,
    blockTitle: {
      ru: 'БЛОК 7: ВАШ ИСКРЕННИЙ ВЫБОР',
      en: 'BLOCK 7: YOUR GENUINE CHOICE',
      es: 'BLOQUE 7: TU ELECCIÓN SINCERA',
    },
    title: {
      ru: 'Никто не узнает',
      en: 'No One Will Ever Know',
      es: 'Nadie se enterará',
    },
    situation: {
      ru: 'Представьте, что вы делаете что-то, и никто никогда не узнает о вашем выборе. Никто не оценит и не осудит.',
      en: 'Imagine you are doing something, and no one will ever know about your choice. Nobody will judge or praise you.',
      es: 'Imagina que estás haciendo algo y nadie se enterará jamás de tu elección. Nadie te juzgará ni elogiará.',
    },
    question: {
      ru: 'Как это влияет на ваше поведение?',
      en: 'How does this affect your behavior?',
      es: '¿Cómo influye esto en tu comportamiento?',
    },
    options: {
      A: {
        ru: 'Никак — я всё равно буду делать то, что считаю правильным или интересным',
        en: 'Not at all — I will still do what I consider right or meaningful',
        es: 'En nada: seguiré haciendo lo que considero correcto o interesante',
      },
      B: {
        ru: 'Становлюсь менее ответственным — зачем стараться, если никто не видит',
        en: 'I become less strict with responsibility — why exert effort if no one sees it',
        es: 'Me vuelvo menos riguroso: para qué esforzarse si nadie lo ve',
      },
      C: {
        ru: 'Делаю то, что мне действительно нравится, без оглядки на ожидания',
        en: 'I do what I truly enjoy without being constrained by expectations',
        es: 'Hago lo que realmente me gusta, sin fijarme en las expectativas ajenas',
      },
      D: {
        ru: 'Работаю менее интенсивно — незачем напрягаться',
        en: 'I work with less intensity — no need to strain myself',
        es: 'Trabajo con menor intensidad: no hay por qué esforzarse en exceso',
      },
      E: {
        ru: 'Веду себя так же, как обычно — привычки сильнее обстоятельств',
        en: 'I behave just as usual — habits are stronger than circumstances',
        es: 'Me comporto igual que siempre: los hábitos son más fuertes que las circunstancias',
      },
    },
  },
  {
    id: 19,
    blockId: 7,
    blockTitle: {
      ru: 'БЛОК 7: ВАШ ИСКРЕННИЙ ВЫБОР',
      en: 'BLOCK 7: YOUR GENUINE CHOICE',
      es: 'BLOQUE 7: TU ELECCIÓN SINCERA',
    },
    title: {
      ru: 'Тайная выгода',
      en: 'Secret Benefit',
      es: 'Beneficio secreto',
    },
    situation: {
      ru: 'Вы можете сделать что-то, что принесёт вам пользу, но никто не узнает, что это сделали вы.',
      en: 'You can do something that brings you personal benefit, but no one will ever know it was you.',
      es: 'Puedes hacer algo que te beneficie personalmente, pero nadie sabrá jamás que lo hiciste tú.',
    },
    question: {
      ru: 'Сделаете ли вы это?',
      en: 'Will you do it?',
      es: '¿Lo harías?',
    },
    options: {
      A: {
        ru: 'Да, если это соответствует моим принципам или интересно мне',
        en: 'Yes, if it aligns with my personal principles or is intellectually engaging',
        es: 'Sí, si coincide con mis principios o me resulta interesante',
      },
      B: {
        ru: 'Да, но только если это укрепит мою позицию или влияние',
        en: 'Yes, but only if it consolidates my position or influence',
        es: 'Sí, pero solo si fortalece mi posición o influencia',
      },
      C: {
        ru: 'Да, если это принесёт мне реальную выгоду',
        en: 'Yes, if it delivers tangible benefit to me',
        es: 'Sí, si me aporta un beneficio real',
      },
      D: {
        ru: 'Да, если это можно сделать физически и быстро',
        en: 'Yes, if it can be accomplished physically and swiftly',
        es: 'Sí, si se puede hacer físicamente y de forma rápida',
      },
      E: {
        ru: 'Зависит от того, насколько это мне интересно или важно',
        en: 'It depends entirely on how interesting or important it is to me',
        es: 'Depende de cuán interesante o importante sea para mí',
      },
    },
  },

  // БЛОК 8: ОБУЧЕНИЕ И РАЗВИТИЕ
  {
    id: 20,
    blockId: 8,
    blockTitle: {
      ru: 'БЛОК 8: ОБУЧЕНИЕ И РАЗВИТИЕ',
      en: 'BLOCK 8: LEARNING AND DEVELOPMENT',
      es: 'BLOQUE 8: APRENDIZAJE Y DESARROLLO',
    },
    title: {
      ru: 'Обучение новому',
      en: 'Learning Something New',
      es: 'Aprender algo nuevo',
    },
    situation: {
      ru: 'Вам нужно освоить что-то совершенно новое.',
      en: 'You need to master something completely new.',
      es: 'Necesitas dominar algo completamente nuevo.',
    },
    question: {
      ru: 'Как вы подходите к обучению?',
      en: 'How do you approach learning?',
      es: '¿Cómo enfocas el aprendizaje?',
    },
    options: {
      A: {
        ru: 'Сначала изучаю теорию и принципы, чтобы понять суть',
        en: 'First I study the theory and fundamental principles to grasp the core essence',
        es: 'Primero estudio la teoría y los principios para comprender la esencia',
      },
      B: {
        ru: 'Ищу наставника или авторитетного источника',
        en: 'I seek a skilled mentor or an authoritative source',
        es: 'Busco un mentor o una fuente de autoridad confiable',
      },
      C: {
        ru: 'Пробую на практике — что мне это даст',
        en: 'I try it out in practice to see what tangible value it provides',
        es: 'Pruebo en la práctica para ver qué provecho me aporta',
      },
      D: {
        ru: 'Делаю руками — так лучше запоминается',
        en: 'I learn by hands-on execution — it is retained much better that way',
        es: 'Hago trabajo práctico con las manos: así se memoriza mejor',
      },
      E: {
        ru: 'Учуся по мере необходимости — зачем учить то, что не пригодится',
        en: 'I learn strictly on a need-to-know basis — why study what will not be used',
        es: 'Aprendo a medida que lo necesito: para qué aprender lo que no se va a usar',
      },
    },
  },
  {
    id: 21,
    blockId: 8,
    blockTitle: {
      ru: 'БЛОК 8: ОБУЧЕНИЕ И РАЗВИТИЕ',
      en: 'BLOCK 8: LEARNING AND DEVELOPMENT',
      es: 'BLOQUE 8: APRENDIZAJE Y DESARROLLO',
    },
    title: {
      ru: 'Отношение к рутине',
      en: 'Attitude Towards Routine',
      es: 'Actitud hacia la rutina',
    },
    situation: {
      ru: 'Вам предстоит долго выполнять однообразную работу.',
      en: 'You are faced with performing repetitive, monotonous work for an extended period.',
      es: 'Te enfrentas a realizar un trabajo monótono y repetitivo durante un tiempo prolongado.',
    },
    question: {
      ru: 'Как вы к этому относитесь?',
      en: 'How do you feel about this?',
      es: '¿Cómo te posicionas ante ello?',
    },
    options: {
      A: {
        ru: 'Могу найти смысл даже в рутине — это часть большего процесса',
        en: 'I can find meaning even in routine — it is part of a larger, systemic process',
        es: 'Puedo encontrar sentido incluso en la rutina: es parte de un proceso más amplio',
      },
      B: {
        ru: 'Выполняю дисциплинированно — это моя задача',
        en: 'I execute it with strict discipline — it is my assigned task',
        es: 'Lo realizo con disciplina: es mi tarea y mi deber',
      },
      C: {
        ru: 'Делаю, если это приносит конкретную пользу',
        en: 'I do it if it yields measurable, concrete utility',
        es: 'Lo hago si genera un beneficio o utilidad concreta',
      },
      D: {
        ru: 'Предпочитаю физическую рутину — она успокаивает',
        en: 'I prefer physical routine — it is calming and grounding',
        es: 'Prefiero la rutina física: resulta relajante y tranquilizadora',
      },
      E: {
        ru: 'Стараюсь избежать или делегировать — рутина меня угнетает',
        en: 'I try to avoid or delegate it — repetitive routine depresses me',
        es: 'Procuro evitarlo o delegarlo: la rutina me agobia profundamente',
      },
    },
  },

  // БЛОК 9: КОНТРОЛЬНЫЕ ВОПРОСЫ
  {
    id: 22,
    blockId: 9,
    blockTitle: {
      ru: 'БЛОК 9: КОНТРОЛЬНЫЕ ВОПРОСЫ',
      en: 'BLOCK 9: CONTROL SCENARIOS',
      es: 'BLOQUE 9: CASOS DE CONTROL',
    },
    title: {
      ru: 'Незавершённая книга',
      en: 'Unfinished Book',
      es: 'Libro sin terminar',
    },
    situation: {
      ru: 'Вы начали читать книгу, но она вам не очень понравилась. Прошла неделя.',
      en: 'You started reading a book, but did not enjoy it much. A week has passed.',
      es: 'Empezaste a leer un libro, pero no te gustó demasiado. Ha pasado una semana.',
    },
    question: {
      ru: 'Что вы сделаете?',
      en: 'What will you do?',
      es: '¿Qué harás?',
    },
    options: {
      A: {
        ru: 'Дочитаю, чтобы понять идею автора до конца',
        en: 'I will finish reading it to understand the author’s full conceptual thesis',
        es: 'Lo terminaré de leer para comprender la idea del autor hasta el final',
      },
      B: {
        ru: 'Отложу — нет смысла тратить время на то, что не работает',
        en: 'I will set it aside — no point wasting time on what is not delivering value',
        es: 'Lo dejaré a un lado: no tiene sentido perder el tiempo en lo que no aporta',
      },
      C: {
        ru: 'Вернусь, если будет настроение — чтение должно приносить удовольствие',
        en: 'I will return to it if the mood strikes — reading ought to bring enjoyment',
        es: 'Volveré a él si me apetece: la lectura debe proporcionar placer',
      },
      D: {
        ru: 'Брошу совсем — зачем держать незавершённое дело',
        en: 'I drop it completely — why carry an unresolved open loop',
        es: 'Lo abandonaré del todo: para qué mantener un asunto pendiente',
      },
      E: {
        ru: 'Забуду о ней — есть более важные вещи',
        en: 'I will simply forget about it — there are far more pressing matters',
        es: 'Me olvidaré de él: hay cosas mucho más importantes',
      },
    },
  },
  {
    id: 23,
    blockId: 9,
    blockTitle: {
      ru: 'БЛОК 9: КОНТРОЛЬНЫЕ ВОПРОСЫ',
      en: 'BLOCK 9: CONTROL SCENARIOS',
      es: 'BLOQUE 9: CASOS DE CONTROL',
    },
    title: {
      ru: 'Спор 2',
      en: 'Discussion 2',
      es: 'Debate 2',
    },
    situation: {
      ru: 'Вы обсуждаете с кем-то сложную тему, и собеседник не согласен с вами.',
      en: 'You are discussing a complex topic with someone, and they disagree with you.',
      es: 'Estás debatiendo un tema complejo con alguien y tu interlocutor no está de acuerdo contigo.',
    },
    question: {
      ru: 'Что вы делаете?',
      en: 'What do you do?',
      es: '¿Qué haces?',
    },
    options: {
      A: {
        ru: 'Пытаюсь найти общие основания для понимания',
        en: 'I seek shared fundamental principles for mutual understanding',
        es: 'Intento encontrar bases comunes para el entendimiento mutuo',
      },
      B: {
        ru: 'Уважаю мнение того, кто более опытен или авторитетен',
        en: 'I defer to and respect the viewpoint of whoever is more experienced or authoritative',
        es: 'Respeto la opinión de quien tiene más experiencia o autoridad',
      },
      C: {
        ru: 'Аргументирую свою позицию, чтобы убедить',
        en: 'I formulate structured arguments to persuade them',
        es: 'Argumento mi postura para convencerle',
      },
      D: {
        ru: 'Привожу конкретные примеры из жизни',
        en: 'I cite practical, real-life examples',
        es: 'Aporto ejemplos concretos de la vida real',
      },
      E: {
        ru: 'Если спор становится бесполезным, переключаюсь на другую тему',
        en: 'If the debate becomes fruitless, I switch to another topic',
        es: 'Si el debate se vuelve estéril, cambio a otro tema',
      },
    },
  },
  {
    id: 24,
    blockId: 9,
    blockTitle: {
      ru: 'БЛОК 9: КОНТРОЛЬНЫЕ ВОПРОСЫ',
      en: 'BLOCK 9: CONTROL SCENARIOS',
      es: 'BLOQUE 9: CASOS DE CONTROL',
    },
    title: {
      ru: 'Изменение планов 2',
      en: 'Change of Plans 2',
      es: 'Cambio de planes 2',
    },
    situation: {
      ru: 'Вы собрались делать одно, но вдруг поняли, что есть лучший вариант.',
      en: 'You set out to do one thing, but suddenly realize there is a clearly superior alternative.',
      es: 'Te disponías a hacer una cosa, pero de pronto te das cuenta de que existe una opción mejor.',
    },
    question: {
      ru: 'Что вы делаете?',
      en: 'What do you do?',
      es: '¿Qué haces?',
    },
    options: {
      A: {
        ru: 'Переключаюсь на новый вариант — если он интереснее, зачем терять возможность',
        en: 'I pivot to the new option — if it is more promising, why miss the opportunity',
        es: 'Cambio a la nueva opción: si es más interesante, por qué perder la oportunidad',
      },
      B: {
        ru: 'Продолжаю старый план — изменения только мешают',
        en: 'I stick to the original plan — sudden modifications only create disruption',
        es: 'Sigo con el plan original: los cambios imprevistos solo entorpecen',
      },
      C: {
        ru: 'Быстро оцениваю, что выгоднее, и выбираю',
        en: 'I quickly calculate which option is more advantageous and choose accordingly',
        es: 'Evalúo rápidamente qué es más ventajoso y elijo en consecuencia',
      },
      D: {
        ru: 'Делаю то, что можно сделать быстрее и проще',
        en: 'I execute whichever option is faster and simpler',
        es: 'Hago lo que se pueda realizar de forma más rápida y sencilla',
      },
      E: {
        ru: 'Легко меняю планы — я не привязываюсь к ним',
        en: 'I alter plans effortlessly — I do not get attached to rigid itineraries',
        es: 'Cambio de planes sin dificultad: no me apego a esquemas rígidos',
      },
    },
  },

  // БЛОК 10: ЦЕННОСТНЫЕ ПРИОРИТЕТЫ
  {
    id: 25,
    blockId: 10,
    blockTitle: {
      ru: 'БЛОК 10: ЦЕННОСТНЫЕ ПРИОРИТЕТЫ',
      en: 'BLOCK 10: VALUE PRIORITIES',
      es: 'BLOQUE 10: PRIORIDADES DE VALOR',
    },
    title: {
      ru: 'Свободный день',
      en: 'Free Day',
      es: 'Día libre',
    },
    situation: {
      ru: 'У вас неожиданно появился полностью свободный день без обязательств.',
      en: 'You unexpectedly have an entirely free day with zero obligations.',
      es: 'Inesperadamente tienes un día completamente libre y sin obligaciones.',
    },
    question: {
      ru: 'Как вы его проведёте?',
      en: 'How will you spend it?',
      es: '¿Cómo lo pasarás?',
    },
    options: {
      A: {
        ru: 'Займусь чем-то, что давно хотел изучить или обдумать',
        en: 'I will engage in something I have long wanted to study or contemplate',
        es: 'Me dedicaré a algo que llevaba tiempo queriendo estudiar o reflexionar',
      },
      B: {
        ru: 'Наведу порядок в делах, которые откладывал',
        en: 'I will bring order to pending organizational tasks I had put off',
        es: 'Pondré en orden los asuntos y tareas que tenía pospuestos',
      },
      C: {
        ru: 'Сделаю что-то приятное для себя — развлечение, хобби, отдых',
        en: 'I will do something delightful for myself — entertainment, hobby, genuine relaxation',
        es: 'Haré algo placentero para mí: entretenimiento, afición o descanso',
      },
      D: {
        ru: 'Займусь физической работой — что-то починю, построю, переставлю',
        en: 'I will do hands-on physical work — repair, build, or rearrange something',
        es: 'Me dedicaré al trabajo físico: reparar, construir o reorganizar cosas',
      },
      E: {
        ru: 'Пойду туда, куда давно собирался, но не было времени',
        en: 'I will visit places I planned to go for a long time but lacked the time',
        es: 'Iré al lugar al que quería ir desde hace tiempo pero no tenía ocasión',
      },
    },
  },
  {
    id: 26,
    blockId: 10,
    blockTitle: {
      ru: 'БЛОК 10: ЦЕННОСТНЫЕ ПРИОРИТЕТЫ',
      en: 'BLOCK 10: VALUE PRIORITIES',
      es: 'BLOQUE 10: PRIORIDADES DE VALOR',
    },
    title: {
      ru: 'Хорошо прожитый день',
      en: 'A Well-Spent Day',
      es: 'Un día bien vivido',
    },
    situation: {
      ru: 'Вас просят описать, что для вас значит "хорошо прожитый день".',
      en: 'You are asked to describe what a "well-spent day" means to you.',
      es: 'Te piden que describas qué significa para ti un "día bien vivido".',
    },
    question: {
      ru: 'Что вы скажете?',
      en: 'What will you say?',
      es: '¿Qué responderás?',
    },
    options: {
      A: {
        ru: 'День, когда я понял что-то важное или нашёл новые смыслы',
        en: 'A day when I discovered profound insights or found new meaning',
        es: 'Un día en el que comprendí algo fundamental o encontré nuevos significados',
      },
      B: {
        ru: 'День, когда я выполнил свои обязанности и поддержал порядок',
        en: 'A day when I fulfilled my duties and upheld structural order',
        es: 'Un día en el que cumplí con mis deberes y mantuve el orden',
      },
      C: {
        ru: 'День, когда я достиг чего-то конкретного и получил удовольствие',
        en: 'A day when I accomplished tangible goals and enjoyed the results',
        es: 'Un día en el que alcancé metas concretas y disfruté del resultado',
      },
      D: {
        ru: 'День, когда я много сделал руками и чувствую физическую усталость',
        en: 'A day when I produced substantial hands-on output and feel healthy physical fatigue',
        es: 'Un día en el que trabajé mucho con las manos y siento un cansancio físico saludable',
      },
      E: {
        ru: 'День, когда я был свободен и делал то, что хотел',
        en: 'A day when I was truly free and did whatever I desired',
        es: 'Un día en el que fui plenamente libre e hice lo que quise',
      },
    },
  },
  {
    id: 27,
    blockId: 10,
    blockTitle: {
      ru: 'БЛОК 10: ЦЕННОСТНЫЕ ПРИОРИТЕТЫ',
      en: 'BLOCK 10: VALUE PRIORITIES',
      es: 'BLOQUE 10: PRIORIDADES DE VALOR',
    },
    title: {
      ru: 'Главное в жизни',
      en: 'The Most Essential in Life',
      es: 'Lo principal en la vida',
    },
    situation: {
      ru: 'Вас спрашивают, что для вас важнее всего в жизни.',
      en: 'You are asked what matters most to you in life.',
      es: 'Te preguntan qué es lo más importante para ti en la vida.',
    },
    question: {
      ru: 'Что вы ответите?',
      en: 'What will you answer?',
      es: '¿Qué responderás?',
    },
    options: {
      A: {
        ru: 'Понимание себя и мира, поиск смысла',
        en: 'Understanding oneself and the universe, the quest for meaning',
        es: 'Comprenderse a uno mismo y al mundo, la búsqueda de sentido',
      },
      B: {
        ru: 'Влияние на людей и события, создание порядка',
        en: 'Influence over people and events, establishing order and governance',
        es: 'Influencia sobre las personas y acontecimientos, creación de orden',
      },
      C: {
        ru: 'Достижение целей, получение результата, качество жизни',
        en: 'Achieving goals, producing results, and high quality of life',
        es: 'Alcanzar objetivos, obtener resultados y calidad de vida',
      },
      D: {
        ru: 'Физическое благополучие, здоровье, комфорт',
        en: 'Physical well-being, health, and comfort',
        es: 'Bienestar físico, salud y confort',
      },
      E: {
        ru: 'Свобода делать то, что хочешь, когда хочешь',
        en: 'Freedom to do what you want, whenever you want',
        es: 'Libertad para hacer lo que quieras, cuando quieras',
      },
    },
  },

  // БЛОК 11: ДОПОЛНИТЕЛЬНЫЕ ДИАГНОСТИЧЕСКИЕ СИТУАЦИИ
  {
    id: 28,
    blockId: 11,
    blockTitle: {
      ru: 'БЛОК 11: ДОПОЛНИТЕЛЬНЫЕ ДИАГНОСТИЧЕСКИЕ СИТУАЦИИ',
      en: 'BLOCK 11: ADDITIONAL DIAGNOSTIC SCENARIOS',
      es: 'BLOQUE 11: SITUACIONES DIAGNÓSTICAS ADICIONALES',
    },
    title: {
      ru: 'Ожидание',
      en: 'Waiting',
      es: 'Espera',
    },
    situation: {
      ru: 'Вам приходится долго ждать (в очереди, на встрече, в дороге).',
      en: 'You have to endure a long wait (in line, for a meeting, during travel).',
      es: 'Te toca esperar durante un largo rato (en una cola, una reunión, de viaje).',
    },
    question: {
      ru: 'Чем вы занимаетесь?',
      en: 'What do you occupy yourself with?',
      es: '¿En qué te ocupas?',
    },
    options: {
      A: {
        ru: 'Думаю о чём-то своём, размышляю, планирую',
        en: 'I delve into my own thoughts, contemplate, or plan ahead',
        es: 'Pienso en mis cosas, reflexiono o planifico',
      },
      B: {
        ru: 'Раздражаюсь, что время уходит впустую',
        en: 'I get irritated that time is being squandered',
        es: 'Me irrito porque el tiempo se pierde en vano',
      },
      C: {
        ru: 'Занимаюсь чем-то полезным — читаю, работаю, общаюсь',
        en: 'I engage in something productive — reading, working, or conversing',
        es: 'Hago algo útil: leer, trabajar o comunicarme',
      },
      D: {
        ru: 'Смотрю по сторонам, наблюдаю за людьми и обстановкой',
        en: 'I look around, observing people and the environment',
        es: 'Miro a mi alrededor, observando a las personas y el entorno',
      },
      E: {
        ru: 'Ничего не делаю — просто жду, это нормально',
        en: 'I do nothing — I just wait, that is perfectly normal',
        es: 'No hago nada: simplemente espero, es normal',
      },
    },
  },
  {
    id: 29,
    blockId: 11,
    blockTitle: {
      ru: 'БЛОК 11: ДОПОЛНИТЕЛЬНЫЕ ДИАГНОСТИЧЕСКИЕ СИТУАЦИИ',
      en: 'BLOCK 11: ADDITIONAL DIAGNOSTIC SCENARIOS',
      es: 'BLOQUE 11: SITUACIONES DIAGNÓSTICAS ADICIONALES',
    },
    title: {
      ru: 'Подарок',
      en: 'Gift',
      es: 'Regalo',
    },
    situation: {
      ru: 'Вам нужно выбрать подарок для близкого человека.',
      en: 'You need to choose a gift for someone close to you.',
      es: 'Tienes que elegir un regalo para una persona cercana.',
    },
    question: {
      ru: 'Как вы это делаете?',
      en: 'How do you do it?',
      es: '¿Cómo lo haces?',
    },
    options: {
      A: {
        ru: 'Думаю о том, что будет для него значимым и интересным',
        en: 'I think about what will be deeply meaningful and inspiring for them',
        es: 'Pienso en lo que será significativo e interesante para esa persona',
      },
      B: {
        ru: 'Выбираю что-то статусное или полезное, что подчеркнёт мои чувства',
        en: 'I select something prestigious or useful that underscores my appreciation',
        es: 'Elijo algo de estatus o útil que resalte mis sentimientos',
      },
      C: {
        ru: 'Покупаю то, что ему точно понравится и пригодится',
        en: 'I buy what they will definitely love and make practical use of',
        es: 'Compro lo que sé con certeza que le gustará y le resultará útil',
      },
      D: {
        ru: 'Делаю что-то своими руками — это ценнее',
        en: 'I create something with my own hands — it carries greater personal value',
        es: 'Hago algo con mis propias manos: tiene mayor valor',
      },
      E: {
        ru: 'Даю деньги или сертификат — пусть сам выберет',
        en: 'I give money or a gift certificate — letting them choose for themselves',
        es: 'Doy dinero o una tarjeta de regalo: que elija por sí mismo',
      },
    },
  },
  {
    id: 30,
    blockId: 11,
    blockTitle: {
      ru: 'БЛОК 11: ДОПОЛНИТЕЛЬНЫЕ ДИАГНОСТИЧЕСКИЕ СИТУАЦИИ',
      en: 'BLOCK 11: ADDITIONAL DIAGNOSTIC SCENARIOS',
      es: 'BLOQUE 11: SITUACIONES DIAGNÓSTICAS ADICIONALES',
    },
    title: {
      ru: 'Финальный экран',
      en: 'Final Question',
      es: 'Pregunta final',
    },
    situation: {
      ru: 'Если бы вы могли изменить одну вещь в своей жизни прямо сейчас.',
      en: 'If you could change one thing in your life right now.',
      es: 'Si pudieras cambiar una sola cosa en tu vida ahora mismo.',
    },
    question: {
      ru: 'Что бы это было?',
      en: 'What would that be?',
      es: '¿Qué sería?',
    },
    options: {
      A: {
        ru: 'Больше времени на размышления и поиск смысла',
        en: 'More time for reflection and the pursuit of deeper meaning',
        es: 'Más tiempo para reflexionar y buscar sentido',
      },
      B: {
        ru: 'Больше влияния и контроля над ситуацией',
        en: 'More influence and greater command over situations',
        es: 'Más influencia y control sobre las situaciones',
      },
      C: {
        ru: 'Больше достижений и конкретных результатов',
        en: 'More achievements and concrete, measurable results',
        es: 'Más logros y resultados concretos',
      },
      D: {
        ru: 'Больше физического комфорта и здоровья',
        en: 'More physical comfort, vitality, and well-being',
        es: 'Más confort físico y salud',
      },
      E: {
        ru: 'Больше свободы делать то, что хочу',
        en: 'More freedom to do whatever I desire',
        es: 'Más libertad para hacer lo que quiero',
      },
    },
  },
];
