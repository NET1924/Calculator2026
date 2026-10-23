interface SpecificationProps {
  onBack: () => void;
}

function Specification({ onBack }: SpecificationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all text-sm font-medium"
            >
              ← Калькулятор
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">Техническая документация</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">v1.0.0</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              🧮
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Научный Калькулятор</h1>
              <p className="text-gray-400 text-sm mt-1">Техническая спецификация продукта</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <MetaCard label="Версия" value="1.0.0" />
            <MetaCard label="Платформа" value="Web (SPA)" />
            <MetaCard label="Стек" value="React + Vite" />
            <MetaCard label="Стили" value="Tailwind CSS" />
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="mb-16 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">§</span> Содержание
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <TOCItem num="1" title="Общее описание" />
            <TOCItem num="2" title="Функциональные требования" />
            <TOCItem num="3" title="Интерфейс пользователя" />
            <TOCItem num="4" title="Математические функции" />
            <TOCItem num="5" title="Архитектура и технологии" />
            <TOCItem num="6" title="Обработка ошибок" />
            <TOCItem num="7" title="Требования к совместимости" />
            <TOCItem num="8" title="Дорожная карта" />
          </div>
        </nav>

        {/* Section 1 */}
        <Section num="1" title="Общее описание">
          <p>
            <strong>Научный калькулятор</strong> — это веб-приложение (Single Page Application), реализующее
            полнофункциональный научный калькулятор с поддержкой тригонометрических, логарифмических,
            степенных и других математических операций. Приложение предназначено для использования
            студентами, инженерами и специалистами, которым необходим быстрый доступ к вычислительным
            инструментам без установки дополнительного программного обеспечения.
          </p>
          <h3>Цели продукта:</h3>
          <ul>
            <li>Предоставить полнофункциональный научный калькулятор в браузере</li>
            <li>Обеспечить интуитивно понятный пользовательский интерфейс</li>
            <li>Поддержать все основные математические операции и функции</li>
            <li>Обеспечить адаптивный дизайн для мобильных и десктопных устройств</li>
            <li>Работать без серверной части (полностью клиентское приложение)</li>
          </ul>
          <h3>Целевая аудитория:</h3>
          <ul>
            <li>Студенты математических и инженерных специальностей</li>
            <li>Инженеры и научные работники</li>
            <li>Школьники старших классов</li>
            <li>Любые пользователи, нуждающиеся в быстрых математических вычислениях</li>
          </ul>
        </Section>

        {/* Section 2 */}
        <Section num="2" title="Функциональные требования">
          <h3>2.1 Базовые арифметические операции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Операция</th>
                  <th>Обозначение</th>
                  <th>Описание</th>
                  <th>Пример</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Сложение</td><td>+</td><td>Сумма двух чисел</td><td>2 + 3 = 5</td></tr>
                <tr><td>Вычитание</td><td>−</td><td>Разность двух чисел</td><td>5 − 3 = 2</td></tr>
                <tr><td>Умножение</td><td>×</td><td>Произведение двух чисел</td><td>4 × 3 = 12</td></tr>
                <tr><td>Деление</td><td>÷</td><td>Частное двух чисел</td><td>12 ÷ 4 = 3</td></tr>
                <tr><td>Остаток</td><td>mod</td><td>Остаток от деления</td><td>7 mod 3 = 1</td></tr>
                <tr><td>Процент</td><td>%</td><td>Процент от числа</td><td>200% = 2</td></tr>
                <tr><td>Смена знака</td><td>±</td><td>Инвертирование знака</td><td>±5 → −5</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.2 Тригонометрические функции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Функция</th>
                  <th>Обозначение</th>
                  <th>Описание</th>
                  <th>Диапазон</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Синус</td><td>sin(x)</td><td>Синус угла</td><td>Все действительные числа</td></tr>
                <tr><td>Косинус</td><td>cos(x)</td><td>Косинус угла</td><td>Все действительные числа</td></tr>
                <tr><td>Тангенс</td><td>tan(x)</td><td>Тангенс угла</td><td>x ≠ π/2 + πn</td></tr>
                <tr><td>Арксинус</td><td>sin⁻¹(x)</td><td>Обратный синус</td><td>[−1, 1]</td></tr>
                <tr><td>Арккосинус</td><td>cos⁻¹(x)</td><td>Обратный косинус</td><td>[−1, 1]</td></tr>
                <tr><td>Арктангенс</td><td>tan⁻¹(x)</td><td>Обратный тангенс</td><td>Все действительные числа</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.3 Степенные и корневые функции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Функция</th>
                  <th>Обозначение</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Квадрат</td><td>x²</td><td>Возведение в квадрат</td></tr>
                <tr><td>Куб</td><td>x³</td><td>Возведение в куб</td></tr>
                <tr><td>Степень</td><td>xⁿ</td><td>Возведение в произвольную степень</td></tr>
                <tr><td>Квадратный корень</td><td>√(x)</td><td>Извлечение квадратного корня</td></tr>
                <tr><td>Кубический корень</td><td>³√(x)</td><td>Извлечение кубического корня</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.4 Логарифмические функции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Функция</th>
                  <th>Обозначение</th>
                  <th>Основание</th>
                  <th>Область определения</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Натуральный логарифм</td><td>ln(x)</td><td>e ≈ 2.718</td><td>x {">"} 0</td></tr>
                <tr><td>Десятичный логарифм</td><td>log(x)</td><td>10</td><td>x {">"} 0</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.5 Прочие функции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Функция</th>
                  <th>Обозначение</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Факториал</td><td>n!</td><td>Произведение всех натуральных чисел от 1 до n</td></tr>
                <tr><td>Модуль</td><td>|x|</td><td>Абсолютное значение числа</td></tr>
                <tr><td>Обратное число</td><td>1/x</td><td>Обратная величина (x⁻¹)</td></tr>
                <tr><td>Экспонента</td><td>EXP</td><td>Научная запись (×10ⁿ)</td></tr>
                <tr><td>Константа π</td><td>π</td><td>≈ 3.14159265358979</td></tr>
                <tr><td>Константа e</td><td>e</td><td>≈ 2.71828182845905</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.6 Операции с памятью</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Кнопка</th>
                  <th>Действие</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>MC</td><td>Memory Clear</td><td>Очистка памяти</td></tr>
                <tr><td>MR</td><td>Memory Recall</td><td>Вызов значения из памяти</td></tr>
                <tr><td>M+</td><td>Memory Add</td><td>Прибавить текущее значение к памяти</td></tr>
                <tr><td>MS</td><td>Memory Store</td><td>Сохранить текущее значение в память</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.7 Режимы работы</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Режим</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>DEG</td><td>Тригонометрические функции работают в градусах</td></tr>
                <tr><td>RAD</td><td>Тригонометрические функции работают в радианах</td></tr>
                <tr><td>2nd</td><td>Активация вторичных функций (обратные тригонометрические, кубический корень)</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Section 3 */}
        <Section num="3" title="Интерфейс пользователя">
          <h3>3.1 Структура экрана</h3>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 font-mono text-xs leading-relaxed text-gray-400 my-4">
            <pre>{`┌─────────────────────────────────────────────┐
│  Научный Калькулятор    [SPEC] [DEG] [2nd]  │  ← Header
├─────────────────────────────────────────────┤
│                                             │
│  expression: 2 + 3 ×                        │  ← Строка выражения
│  display:        5                          │  ← Основной дисплей
│  M = 42                                     │  ← Индикатор памяти
│                                             │
├─────────────────────────────────────────────┤
│  [MC]  [MR]  [M+]  [MS]  [1/x]             │  ← Ряд памяти
├─────────────────────────────────────────────┤
│  [sin] [cos] [tan] [ π ] [ e ]             │  ← Тригонометрия
│  [x²]  [x³]  [xⁿ]  [ √ ] [|x|]            │  ← Степени/корни
│  [ln]  [log] [n!]  [EXP] [ % ]             │  ← Логарифмы
├─────────────────────────────────────────────┤
│  [CE]  [C]   [⌫]   [(]   [)]               │  ← Управление
│  [7]   [8]   [9]   [÷]   [±]               │
│  [4]   [5]   [6]   [×]   [mod]             │
│  [1]   [2]   [3]   [−]   [=]               │
│  [0]       [.]   [+]                       │  ← Цифры и операции
├─────────────────────────────────────────────┤
│  История вычислений                         │
│  2 + 3 = 5                                  │
│  sin(30) = 0.5                              │  ← История
└─────────────────────────────────────────────┘`}</pre>
          </div>

          <h3>3.2 Цветовая схема</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
            <ColorSwatch color="bg-gray-800" name="Фон корпуса" hex="#1f2937" />
            <ColorSwatch color="bg-gray-700" name="Цифровые кнопки" hex="#374151" />
            <ColorSwatch color="bg-amber-600" name="Операторы" hex="#d97706" />
            <ColorSwatch color="bg-blue-600" name="Кнопка =" hex="#2563eb" />
            <ColorSwatch color="bg-indigo-900/40" name="Научные функции" hex="#312e81" />
            <ColorSwatch color="bg-red-900/30" name="Очистка" hex="#7f1d1d" />
          </div>

          <h3>3.3 Адаптивность</h3>
          <ul>
            <li>Максимальная ширина контейнера: <code>512px</code> (max-w-lg)</li>
            <li>Адаптивная сетка кнопок: 5 колонок</li>
            <li>Поддержка мобильных устройств (touch-friendly кнопки высотой 56px)</li>
            <li>Масштабирование при нажатии: <code>scale(0.95)</code></li>
          </ul>
        </Section>

        {/* Section 4 */}
        <Section num="4" title="Математические функции — детальное описание">
          <h3>4.1 Парсинг выражений</h3>
          <p>
            Калькулятор использует посимвольный парсинг выражений с регулярными выражениями.
            Выражение преобразуется из пользовательского формата в валидное JavaScript-выражение,
            которое затем выполняется через <code>Function constructor</code>.
          </p>

          <h3>4.2 Алгоритм вычисления</h3>
          <ol>
            <li>Пользователь вводит число и нажимает оператор</li>
            <li>Текущее число и оператор добавляются в строку выражения</li>
            <li>Дисплей очищается для ввода следующего числа</li>
            <li>При нажатии <code>=</code> полное выражение вычисляется</li>
            <li>Результат отображается на дисплее</li>
            <li>Выражение и результат сохраняются в историю</li>
          </ol>

          <h3>4.3 Обработка тригонометрии</h3>
          <p>
            В режиме <strong>DEG</strong> все входные значения тригонометрических функций
            автоматически конвертируются из градусов в радианы перед вычислением.
            Результаты обратных функций конвертируются обратно из радиан в градусы.
          </p>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 font-mono text-sm my-4">
            <div className="text-gray-400">// Конвертация DEG → RAD</div>
            <div className="text-emerald-400">toRadians(value) = value × π / 180</div>
            <div className="text-gray-400 mt-2">// Конвертация RAD → DEG</div>
            <div className="text-emerald-400">fromRadians(value) = value × 180 / π</div>
          </div>

          <h3>4.4 Факториал и гамма-функция</h3>
          <p>
            Для целых чисел используется итеративный алгоритм факториала.
            Для нецелых чисел применяется <strong>гамма-функция</strong> (Lanczos approximation)
            с 7 коэффициентами, обеспечивающая точность до ~15 значащих цифр.
          </p>
          <ul>
            <li>Максимальное целое значение: <code>n ≤ 170</code> (далее — Infinity)</li>
            <li>Отрицательные целые: возвращает <code>NaN</code></li>
            <li>Нецелые значения: гамма(n + 1)</li>
          </ul>

          <h3>4.5 Точность вычислений</h3>
          <ul>
            <li>Используются стандартные 64-битные числа с плавающей точкой (IEEE 754)</li>
            <li>Результаты округляются до 10 значащих цифр при отображении</li>
            <li>Целые результаты отображаются без десятичной части</li>
          </ul>
        </Section>

        {/* Section 5 */}
        <Section num="5" title="Архитектура и технологии">
          <h3>5.1 Технологический стек</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Технология</th>
                  <th>Версия</th>
                  <th>Назначение</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>React</td><td>18.x</td><td>UI-фреймворк</td></tr>
                <tr><td>TypeScript</td><td>5.x</td><td>Типизация</td></tr>
                <tr><td>Vite</td><td>6.x</td><td>Сборка и dev-сервер</td></tr>
                <tr><td>Tailwind CSS</td><td>4.x</td><td>Утилитарные стили</td></tr>
              </tbody>
            </table>
          </div>

          <h3>5.2 Структура компонентов</h3>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 font-mono text-sm my-4">
            <pre className="text-gray-300">{`src/
├── App.tsx                    # Точка входа, маршрутизация
├── components/
│   ├── Calculator.tsx         # Основной компонент калькулятора
│   └── Specification.tsx      # Страница спецификации
├── index.css                  # Глобальные стили
└── main.tsx                   # Инициализация React`}</pre>
          </div>

          <h3>5.3 Управление состоянием</h3>
          <p>
            Приложение использует локальное состояние React (<code>useState</code>) без
            внешних хранилищ. Состояние включает:
          </p>
          <ul>
            <li><code>display</code> — текущее отображаемое значение</li>
            <li><code>expression</code> — накопленное выражение</li>
            <li><code>angleMode</code> — режим углов (deg/rad)</li>
            <li><code>memory</code> — значение в памяти</li>
            <li><code>isSecond</code> — состояние кнопки 2nd</li>
            <li><code>history</code> — массив последних вычислений (до 10)</li>
          </ul>

          <h3>5.4 Производительность</h3>
          <ul>
            <li>Размер бандла (gzip): ~50 KB JavaScript + ~5 KB CSS</li>
            <li>Время первой загрузки: {'<'} 1 секунда</li>
            <li>Отсутствие внешних API-запросов</li>
            <li>Все вычисления выполняются на клиенте</li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section num="6" title="Обработка ошибок">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Ситуация</th>
                  <th>Поведение</th>
                  <th>Отображение</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Деление на ноль</td><td>Возврат Infinity или NaN</td><td>«Ошибка»</td></tr>
                <tr><td>Корень из отрицательного числа</td><td>NaN</td><td>«Ошибка»</td></tr>
                <tr><td>Логарифм неположительного числа</td><td>NaN</td><td>«Ошибка»</td></tr>
                <tr><td>Факториал отрицательного числа</td><td>NaN</td><td>«Ошибка»</td></tr>
                <tr><td>Факториал {'>'} 170</td><td>Infinity</td><td>«Infinity»</td></tr>
                <tr><td>Арксинус/арккосинус вне [-1, 1]</td><td>NaN</td><td>«Ошибка»</td></tr>
                <tr><td>Некорректное выражение</td><td>Поймано try/catch</td><td>«Ошибка»</td></tr>
                <tr><td>Повторная десятичная точка</td><td>Игнорируется</td><td>Без изменений</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Section 7 */}
        <Section num="7" title="Требования к совместимости">
          <h3>7.1 Браузеры</h3>
          <ul>
            <li>Chrome 90+ (рекомендуется)</li>
            <li>Firefox 90+</li>
            <li>Safari 15+</li>
            <li>Edge 90+</li>
            <li>Opera 76+</li>
          </ul>

          <h3>7.2 Устройства</h3>
          <ul>
            <li>Десктоп: минимальное разрешение 320×480</li>
            <li>Планшеты: полная поддержка</li>
            <li>Смартфоны: адаптивная вёрстка, touch-friendly</li>
          </ul>

          <h3>7.3 Зависимости</h3>
          <ul>
            <li>JavaScript ES2020+</li>
            <li>CSS3 (Grid, Flexbox, backdrop-filter)</li>
            <li>Не требует серверной части или базы данных</li>
          </ul>
        </Section>

        {/* Section 8 */}
        <Section num="8" title="Дорожная карта (Roadmap)">
          <h3>Планируемые улучшения:</h3>
          <div className="space-y-3">
            <RoadmapItem
              status="planned"
              title="Клавиатурный ввод"
              desc="Поддержка ввода с физической клавиатуры (цифры, операторы, Enter, Escape)"
            />
            <RoadmapItem
              status="planned"
              title="Комплексные числа"
              desc="Поддержка мнимых чисел и операций с ними"
            />
            <RoadmapItem
              status="planned"
              title="Графики функций"
              desc="Визуализация математических функций на координатной плоскости"
            />
            <RoadmapItem
              status="planned"
              title="Конвертер единиц"
              desc="Перевод между различными единицами измерения"
            />
            <RoadmapItem
              status="planned"
              title="Матричные операции"
              desc="Сложение, умножение, определитель, обратная матрица"
            />
            <RoadmapItem
              status="planned"
              title="Сохранение истории"
              desc="Персистентное хранение истории в localStorage"
            />
            <RoadmapItem
              status="planned"
              title="Темная/светлая тема"
              desc="Переключение между цветовыми темами"
            />
            <RoadmapItem
              status="planned"
              title="PWA"
              desc="Установка как нативное приложение на мобильные устройства"
            />
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">
            Спецификация научного калькулятора v1.0.0
          </p>
          <p className="text-gray-600 text-xs mt-2">
            React 18 • TypeScript 5 • Vite 6 • Tailwind CSS 4
          </p>
        </footer>
      </main>
    </div>
  );
}

// Sub-components

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14" id={`section-${num}`}>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-bold border border-indigo-500/30">
          {num}
        </span>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
      <div className="text-gray-500 text-xs uppercase tracking-wider">{label}</div>
      <div className="text-white font-semibold mt-1">{value}</div>
    </div>
  );
}

function TOCItem({ num, title }: { num: string; title: string }) {
  return (
    <a
      href={`#section-${num}`}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/30 transition-colors group"
    >
      <span className="text-indigo-400 text-sm font-mono group-hover:text-indigo-300">{num}.</span>
      <span className="text-gray-300 text-sm group-hover:text-white">{title}</span>
    </a>
  );
}

function ColorSwatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${color} border border-gray-600/50`}></div>
      <div>
        <div className="text-gray-300 text-xs">{name}</div>
        <div className="text-gray-500 text-xs font-mono">{hex}</div>
      </div>
    </div>
  );
}

function RoadmapItem({ status, title, desc }: { status: string; title: string; desc: string }) {
  const statusConfig = {
    planned: { icon: '📋', bg: 'bg-gray-700/30', border: 'border-gray-600/30', label: 'Запланировано' },
    inProgress: { icon: '🔧', bg: 'bg-amber-900/20', border: 'border-amber-700/30', label: 'В работе' },
    done: { icon: '✅', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', label: 'Готово' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;

  return (
    <div className={`${config.bg} rounded-xl p-4 border ${config.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{config.icon}</span>
        <span className="text-white font-medium text-sm">{title}</span>
        <span className="text-gray-500 text-xs ml-auto">{config.label}</span>
      </div>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

export default Specification;
