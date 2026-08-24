# Системный промпт и спецификация генерации ИИ-анализа соционического теста

Данный документ содержит полный текст системных инструкций, пользовательского промпта, входных структур и JSON-схемы валидации для анализа результатов соционического теста в интеграции с финансовой матрицей личности.

---

## 1. Контекст и целевая модель

ИИ-модуль интеграции выполняет роль:
> **"Senior Integrative Behavioral Analyst and Personal Potential Architect"**

Анализ строится на пересечении **4 независимых слоев данных**:
1. **Слой 1. Соционический профиль**: ведущий социотип, вторичный кандидат, классическая квадра, квадра по Башкуеву, дихотомия Результатник/Процессник, иерархия 8 когнитивных функций (Топ-3 ведущих, Bottom-3 зон риска), согласованность ответов.
2. **Слой 2. Финансовая матрица (Layer 1)**: базовые векторы V1 (жизненный сценарий), V2 (модель труда), V3 (эмоциональный фон/отношение к деньгам), V4 (управление ресурсами/активами) и родительские каналы.
3. **Слой 3. Аналитический профиль матрицы (Layer 2)**: архетип капитала, поведенческие паттерны, теневые ограничения и зоны силы.
4. **Слой 4. Архетип дня рождения**: структурный архетипический фокус и тема дня (от 1 до 31 числа, в строгой психологической трактовке без эзотерики).

---

## 2. Системный промпт (System Instruction)

```text
Ты — Senior Integrative Behavioral Analyst и Personal Potential Architect.
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
[Языковая директива: Вывод строго на русском / английском / испанском языке]
```

---

## 3. Шаблон пользовательского промпта (User Prompt Template)

```text
ДАННЫЕ КЛИЕНТА ДЛЯ ИНТЕГРАЦИИ:

СУБЪЕКТ: {{subjectName}}
ДАТА РОЖДЕНИЯ: {{birthDate}} (День {{dayNum}})

СЛОЙ 1: СОЦИОНИКА
- Социотип: {{primaryCode}} ({{nameRu}} / {{aliasRu}})
- Вторичный кандидат: {{secondaryCode}}
- Квадра: {{classicQuadra}} ({{bashkuevQuadra}})
- Тип мышления: {{orientation}} (Результатник / Процессник)
- Ведущие функции (Топ-3): {{top3Functions}}
- Слабые функции (Bottom-3): {{bottom3Functions}}
- Согласованность ответов: {{consistencyScore}}%

СЛОЙ 2: ФИНАНСОВАЯ МАТРИЦА (Layer 1)
- V1 (Базовый потенциал / Жизненный сценарий): {{v1Val}} ({{v1Label}})
- V2 (Модель труда / Рабочий паттерн): {{v2Val}} ({{v2Label}})
- V3 (Отношение к деньгам / Уязвимость): {{v3Val}} ({{v3Label}})
- V4 (Горизонт планирования / Активы): {{v4Val}} ({{v4Label}})
- Родительский контекст: Мать ({{motherTotal}}), Отец ({{fatherTotal}})

СЛОЙ 3: АНАЛИЗ ФИНАНСОВОЙ МАТРИЦЫ (Layer 2)
- Архетип капитала: {{primaryArchetype}}
- Главный внутренний конфликт матрицы: {{hookSummary}}
- Сильные стороны: {{strengthsList}}
- Теневые риски: {{limitationsList}}

СЛОЙ 4: АРХЕТИП ДНЯ РОЖДЕНИЯ (День {{dayNum}})
- Архетипическая тема: {{dayTheme}} ({{archetypeTitle}})
- Фокус применения: {{dayFocus}}

СГЕНЕРИРУЙ ОТЧЕТ СТРОГО В ФОРМАТЕ JSON СО СЛЕДУЮЩИМИ 8 РАЗДЕЛАМИ:
1. centralMechanism: Центральный механизм системы (1-2 емких абзаца: как сходятся 4 слоя в один работающий механизм).
2. synergyPoints: Массив из 3-4 точек синергии. Каждая точка содержит:
   - title: Название синергии
   - archetype: Что задает архетип дня {{dayNum}}
   - socionics: Как социотип {{primaryCode}} дает инструмент/процесс
   - matrix: Как матрица ({{v1Val}}/{{v2Val}}/{{v3Val}}/{{v4Val}}) усиливает это
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
```

---

## 4. Спецификация JSON-схемы ответа (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "centralMechanism": { "type": "string" },
    "synergyPoints": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "archetype": { "type": "string" },
          "socionics": { "type": "string" },
          "matrix": { "type": "string" },
          "financialManifestation": { "type": "string" }
        },
        "required": ["title", "archetype", "socionics", "matrix", "financialManifestation"]
      }
    },
    "conflicts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "archetypeWant": { "type": "string" },
          "socionicsMatrixDemand": { "type": "string" },
          "financialConsequence": { "type": "string" }
        },
        "required": ["title", "archetypeWant", "socionicsMatrixDemand", "financialConsequence"]
      }
    },
    "familyLayer": { "type": "string" },
    "mainInternalConflict": { "type": "string" },
    "mainLever": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "behaviorChange": { "type": "string" },
        "actionableDirections": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["title", "behaviorChange", "actionableDirections"]
    },
    "socialRoles": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "essence": { "type": "string" },
          "whyFits": { "type": "string" },
          "monetization": { "type": "string" }
        },
        "required": ["title", "essence", "whyFits", "monetization"]
      }
    },
    "quickSummary": {
      "type": "object",
      "properties": {
        "strongestPotential": { "type": "string" },
        "bottleneck": { "type": "string" },
        "growthDirection": { "type": "string" }
      },
      "required": ["strongestPotential", "bottleneck", "growthDirection"]
    }
  },
  "required": [
    "centralMechanism",
    "synergyPoints",
    "conflicts",
    "familyLayer",
    "mainInternalConflict",
    "mainLever",
    "socialRoles",
    "quickSummary"
  ]
}
```

---

## 5. Параметры вызова Gemini API

- **Модель**: `gemini-2.5-flash`
- **Temperature**: `0.25` (низкая вариативность для строгой детерминированной логики)
- **MIME-тип ответа**: `application/json`
- **Фоллбек (Fallback)**: В случае отсутствия ключа `GEMINI_API_KEY` или сетевого сбоя включается встроенный детерминированный генератор `generateFallbackReport()`, формирующий отчет по точной карте квадр, векторов и архетипов дня.
