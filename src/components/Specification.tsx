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
          <div className="text-xs text-gray-500 font-mono">v1.0.2</div>
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
              <h1 className="text-3xl font-bold text-white">Научный Калькулятор + Конвертер</h1>
              <p className="text-gray-400 text-sm mt-1">Техническая спецификация продукта</p>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <MetaCard label="Версия" value="1.0.4" />
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
            <TOCItem num="7" title="Конвертер единиц измерения" />
            <TOCItem num="8" title="Комплексные числа" />
            <TOCItem num="9" title="Графики функций" />
            <TOCItem num="10" title="Требования к совместимости" />
            <TOCItem num="11" title="Дорожная карта" />
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

          <h3>2.8 Клавиатурный ввод <span className="text-emerald-400 text-xs ml-2 font-normal">✨ NEW v1.0.1</span></h3>
          <p>
            Приложение поддерживает полноценный ввод с физической клавиатуры. При нажатии клавиш
            соответствующие кнопки на экране визуально подсвечиваются (эффект flash-анимации).
            Индикатор <strong>⌨️ KB</strong> в шапке показывает активность клавиатурного ввода.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Клавиша</th>
                  <th>Действие</th>
                  <th>Эквивалент кнопки</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>0</code> — <code>9</code></td><td>Ввод цифр</td><td>Кнопки 0-9</td></tr>
                <tr><td><code>.</code> или <code>,</code></td><td>Десятичная точка</td><td>Кнопка .</td></tr>
                <tr><td><code>+</code></td><td>Сложение</td><td>Кнопка +</td></tr>
                <tr><td><code>-</code></td><td>Вычитание</td><td>Кнопка −</td></tr>
                <tr><td><code>*</code></td><td>Умножение</td><td>Кнопка ×</td></tr>
                <tr><td><code>/</code></td><td>Деление</td><td>Кнопка ÷</td></tr>
                <tr><td><code>Enter</code> или <code>=</code></td><td>Вычислить результат</td><td>Кнопка =</td></tr>
                <tr><td><code>Escape</code></td><td>Полная очистка</td><td>Кнопка C</td></tr>
                <tr><td><code>Delete</code></td><td>Очистить ввод</td><td>Кнопка CE</td></tr>
                <tr><td><code>Backspace</code></td><td>Удалить последний символ</td><td>Кнопка ⌫</td></tr>
                <tr><td><code>(</code> и <code>)</code></td><td>Скобки</td><td>Кнопки ( )</td></tr>
                <tr><td><code>^</code></td><td>Возведение в степень</td><td>Кнопка xⁿ</td></tr>
                <tr><td><code>%</code></td><td>Процент</td><td>Кнопка %</td></tr>
                <tr><td><code>!</code></td><td>Факториал</td><td>Кнопка n!</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            <strong>Примечание:</strong> Клавиша <code>x</code> без Shift не интерпретируется как умножение,
            чтобы избежать конфликтов при наборе текста. Используйте <code>*</code> для умножения.
          </p>
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
        {/* Section 7 - Конвертер единиц */}
        <Section num="7" title="Конвертер единиц измерения">
          <p>
            В версии <strong>1.0.2</strong> добавлен полнофункциональный конвертер единиц измерения,
            доступный через кнопку <strong>🔄 CONV</strong> в шапке калькулятора. Конвертер поддерживает
            10 категорий с более чем 70 единицами измерения.
          </p>

          <h3>7.1 Категории конвертера</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Единиц</th>
                  <th>Основные единицы</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>📏 Длина</td><td>11</td><td>м, км, см, мм, мкм, нм, миля, ярд, фут, дюйм, морская миля</td></tr>
                <tr><td>⚖️ Масса</td><td>7</td><td>кг, г, мг, тонна, фунт, унция, карат</td></tr>
                <tr><td>⏱️ Время</td><td>8</td><td>с, мс, мин, ч, день, неделя, месяц, год</td></tr>
                <tr><td>🌡️ Температура</td><td>3</td><td>°C, °F, K</td></tr>
                <tr><td>🧪 Объём</td><td>8</td><td>л, мл, м³, см³, галлон, пинта, чашка, жидкая унция</td></tr>
                <tr><td>📐 Площадь</td><td>6</td><td>м², км², см², гектар, акр, фут²</td></tr>
                <tr><td>🚀 Скорость</td><td>5</td><td>м/с, км/ч, миль/ч, узел, фут/с</td></tr>
                <tr><td>🎈 Давление</td><td>7</td><td>Па, кПа, МПа, бар, атм, мм рт.ст., psi</td></tr>
                <tr><td>⚡ Энергия</td><td>7</td><td>Дж, кДж, кал, ккал, Вт·ч, кВт·ч, эВ</td></tr>
                <tr><td>💱 Валюта</td><td>10</td><td>USD, EUR, RUB, GBP, JPY, CNY, CHF, CAD, AUD, TRY</td></tr>
              </tbody>
            </table>
          </div>

          <h3>7.2 Алгоритм конвертации</h3>
          <p>
            Конвертация выполняется через базовую единицу каждой категории. Каждая единица имеет
            две функции: <code>toBase</code> (конвертация в базовую) и <code>fromBase</code> (конвертация из базовой).
          </p>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 font-mono text-sm my-4">
            <div className="text-gray-400">// Алгоритм конвертации</div>
            <div className="text-emerald-400">result = toUnit.fromBase(fromUnit.toBase(value))</div>
            <div className="text-gray-400 mt-2">// Пример: 5 миль → км</div>
            <div className="text-emerald-400">base = 5 × 1609.344 = 8046.72 м</div>
            <div className="text-emerald-400">result = 8046.72 / 1000 = 8.04672 км</div>
          </div>

          <h3>7.3 Интерфейс конвертера</h3>
          <ul>
            <li>Сетка категорий: 2 колонки на мобильных, 5 колонок на десктопе</li>
            <li>Кнопка <strong>⇄</strong> для быстрой смены направления конвертации</li>
            <li>Блок «Быстрые конвертации» с предустановленными значениями (1, 5, 10, 100, 1000)</li>
            <li>Автоматическое форматирование: обычные числа или научная нотация</li>
            <li>Предупреждение об ориентировочных курсах валют</li>
          </ul>

          <h3>7.4 Курсы валют <span className="text-emerald-400 text-xs ml-2 font-normal">✨ NEW v1.0.4</span></h3>
          <p>
            В версии <strong>1.0.4</strong> реализована интеграция с API для получения актуальных
            курсов валют. Курсы загружаются автоматически при открытии конвертера и кэшируются
            на 24 часа в localStorage.
          </p>
          
          <h4 className="text-sm font-semibold text-gray-300 mt-4 mb-2">API интеграция:</h4>
          <ul>
            <li><strong>Источник:</strong> exchangerate-api.com (бесплатный API без регистрации)</li>
            <li><strong>Базовая валюта:</strong> USD (доллар США)</li>
            <li><strong>Частота обновления:</strong> ежедневно</li>
            <li><strong>Кэширование:</strong> 24 часа в localStorage</li>
            <li><strong>Таймаут запроса:</strong> 5 секунд</li>
            <li><strong>Резервный режим:</strong> при недоступности API используются кэшированные или fallback-курсы</li>
          </ul>

          <h4 className="text-sm font-semibold text-gray-300 mt-4 mb-2">Поддерживаемые валюты:</h4>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Валюта</th>
                  <th>Код</th>
                  <th>Символ</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Доллар США</td><td>USD</td><td>$</td></tr>
                <tr><td>Евро</td><td>EUR</td><td>€</td></tr>
                <tr><td>Российский рубль</td><td>RUB</td><td>₽</td></tr>
                <tr><td>Фунт стерлингов</td><td>GBP</td><td>£</td></tr>
                <tr><td>Японская иена</td><td>JPY</td><td>¥</td></tr>
                <tr><td>Китайский юань</td><td>CNY</td><td>¥</td></tr>
                <tr><td>Швейцарский франк</td><td>CHF</td><td>Fr</td></tr>
                <tr><td>Канадский доллар</td><td>CAD</td><td>C$</td></tr>
                <tr><td>Австралийский доллар</td><td>AUD</td><td>A$</td></tr>
                <tr><td>Турецкая лира</td><td>TRY</td><td>₺</td></tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-sm font-semibold text-gray-300 mt-4 mb-2">Интерфейс:</h4>
          <ul>
            <li>Индикатор загрузки курсов при первом открытии</li>
            <li>Отображение даты курсов и времени последнего обновления</li>
            <li>Кнопка «🔄 Обновить» для принудительного обновления курсов</li>
            <li>Сообщение об ошибке при недоступности API с автоматическим переходом на резервные курсы</li>
          </ul>
        </Section>

        {/* Section 8 - Комплексные числа */}
        <Section num="8" title="Комплексные числа">
          <p>
            В версии <strong>1.0.3</strong> добавлен полнофункциональный модуль для работы
            с комплексными числами, доступный через кнопку <strong>ℂ CMPX</strong>.
            Модуль поддерживает все основные операции и функции над комплексными числами
            с визуализацией на диаграмме Аргана.
          </p>

          <h3>8.1 Формат представления</h3>
          <p>
            Комплексное число представляется в алгебраической форме <code>z = a + bi</code>,
            где <code>a</code> — действительная часть (Re), <code>b</code> — мнимая часть (Im),
            <code>i</code> — мнимая единица.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Формат ввода</th>
                  <th>Пример</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Полная форма</td><td><code>3 + 4i</code></td><td>Действительная + мнимая часть</td></tr>
                <tr><td>Чисто мнимое</td><td><code>-2.5i</code></td><td>Только мнимая часть</td></tr>
                <tr><td>Действительное</td><td><code>7</code></td><td>Только действительная часть</td></tr>
                <tr><td>Единичный коэффициент</td><td><code>1 - i</code></td><td>Коэффициент 1 можно опустить</td></tr>
              </tbody>
            </table>
          </div>

          <h3>8.2 Операции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Операция</th>
                  <th>Обозначение</th>
                  <th>Формула</th>
                  <th>Тип</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Сложение</td><td>z₁ + z₂</td><td>(a₁+a₂) + (b₁+b₂)i</td><td>Бинарная</td></tr>
                <tr><td>Вычитание</td><td>z₁ − z₂</td><td>(a₁−a₂) + (b₁−b₂)i</td><td>Бинарная</td></tr>
                <tr><td>Умножение</td><td>z₁ × z₂</td><td>(a₁a₂−b₁b₂) + (a₁b₂+a₂b₁)i</td><td>Бинарная</td></tr>
                <tr><td>Деление</td><td>z₁ ÷ z₂</td><td>(z₁·z̄₂) / |z₂|²</td><td>Бинарная</td></tr>
                <tr><td>Степень</td><td>z₁ ^ z₂</td><td>exp(z₂ · ln(z₁))</td><td>Бинарная</td></tr>
                <tr><td>Квадратный корень</td><td>√z</td><td>√r · e^(iθ/2)</td><td>Унарная</td></tr>
                <tr><td>Экспонента</td><td>exp(z)</td><td>eᵃ(cos b + i sin b)</td><td>Унарная</td></tr>
                <tr><td>Натуральный логарифм</td><td>ln(z)</td><td>ln|z| + i·arg(z)</td><td>Унарная</td></tr>
                <tr><td>Синус</td><td>sin(z)</td><td>sin(a)cosh(b) + i·cos(a)sinh(b)</td><td>Унарная</td></tr>
                <tr><td>Косинус</td><td>cos(z)</td><td>cos(a)cosh(b) − i·sin(a)sinh(b)</td><td>Унарная</td></tr>
                <tr><td>Тангенс</td><td>tan(z)</td><td>sin(z) / cos(z)</td><td>Унарная</td></tr>
                <tr><td>Модуль</td><td>|z|</td><td>√(a² + b²)</td><td>Унарная</td></tr>
                <tr><td>Аргумент</td><td>arg(z)</td><td>atan2(b, a)</td><td>Унарная</td></tr>
                <tr><td>Сопряжённое</td><td>z̄</td><td>a − bi</td><td>Унарная</td></tr>
              </tbody>
            </table>
          </div>

          <h3>8.3 Пользовательские функции</h3>
          <p>
            Поддерживается ввод произвольных выражений от <code>z</code> с использованием
            всех доступных операций и функций. Парсер реализован как рекурсивный спуск
            с поддержкой приоритетов операций.
          </p>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 font-mono text-sm my-4">
            <div className="text-gray-400">// Примеры выражений:</div>
            <div className="text-emerald-400">z^2 + 1</div>
            <div className="text-emerald-400">exp(z * i)</div>
            <div className="text-emerald-400">sin(z) + cos(z)</div>
            <div className="text-emerald-400">sqrt(z) * conj(z)</div>
          </div>

          <h3>8.4 Визуализация — диаграмма Аргана</h3>
          <p>
            Каждое комплексное число отображается как точка (или вектор) на комплексной плоскости.
            Цветовая кодировка: <span className="text-blue-400">z₁ (синий)</span>,{' '}
            <span className="text-amber-400">z₂ (жёлтый)</span>,{' '}
            <span className="text-emerald-400">результат (зелёный)</span>.
          </p>
          <ul>
            <li>Автоматическое масштабирование под значения</li>
            <li>Сетка координат с подписями</li>
            <li>Векторы от начала координат к точкам</li>
            <li>Canvas-рендеринг с поддержкой Retina (devicePixelRatio)</li>
          </ul>
        </Section>

        {/* Section 9 - Графики функций */}
        <Section num="9" title="Графики функций">
          <p>
            В версии <strong>1.0.3</strong> добавлен модуль визуализации математических функций
            на координатной плоскости, доступный через кнопку <strong>📈 GRAPH</strong>.
            Поддерживается одновременное отображение нескольких функций с интерактивным
            масштабированием и навигацией.
          </p>

          <h3>9.1 Поддерживаемые функции</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Категория</th>
                  <th>Функции</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Тригонометрические</td><td><code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code></td></tr>
                <tr><td>Обратные тригонометрические</td><td><code>asin(x)</code>, <code>acos(x)</code>, <code>atan(x)</code></td></tr>
                <tr><td>Степенные</td><td><code>x^n</code>, <code>sqrt(x)</code>, <code>abs(x)</code></td></tr>
                <tr><td>Логарифмические</td><td><code>ln(x)</code>, <code>log(x)</code>, <code>exp(x)</code></td></tr>
                <tr><td>Константы</td><td><code>pi</code> (π), <code>e</code></td></tr>
                <tr><td>Операторы</td><td><code>+ − * / ^</code>, скобки <code>( )</code></td></tr>
              </tbody>
            </table>
          </div>

          <h3>9.2 Интерактивность</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Действие</th>
                  <th>Результат</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Перетаскивание мышью</td><td>Перемещение по координатной плоскости</td></tr>
                <tr><td>Колесо мыши</td><td>Масштабирование (от 5 до 500 px/ед)</td></tr>
                <tr><td>Наведение курсора</td><td>Перекрестие с координатами и значениями функций</td></tr>
                <tr><td>Кнопка «Сбросить вид»</td><td>Возврат к исходному масштабу и позиции</td></tr>
              </tbody>
            </table>
          </div>

          <h3>9.3 Множественные функции</h3>
          <ul>
            <li>До 6 функций одновременно с уникальными цветами</li>
            <li>Индивидуальное включение/выключение каждой функции</li>
            <li>Быстрые пресеты (sin, cos, tan, x², x³, √x, 1/x, eˣ, ln, |x|)</li>
            <li>Автоматическое обнаружение разрывов (для tan, 1/x)</li>
          </ul>

          <h3>9.4 Алгоритм отрисовки</h3>
          <ol>
            <li>Для каждого пикселя canvas вычисляется x в математических координатах</li>
            <li>Выражение парсится и вычисляется через <code>Function constructor</code></li>
            <li>При обнаружении скачка {'>'} 100 единиц — разрыв (не соединять точки)</li>
            <li>Координатная сетка адаптируется к масштабу (шаг 0.25 / 0.5 / 1 / 5 / 10)</li>
          </ol>
        </Section>

        <Section num="10" title="Требования к совместимости">
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
        <Section num="11" title="Дорожная карта (Roadmap)">
          <h3>Планируемые улучшения:</h3>
          <div className="space-y-3">
            <RoadmapItem
              status="done"
              title="Клавиатурный ввод"
              desc="Поддержка ввода с физической клавиатуры: цифры 0-9, операторы +−×÷, Enter/= для вычисления, Escape для очистки, Backspace для удаления, скобки, степень (^), факториал (!), процент (%) — с визуальной подсветкой нажатых кнопок"
            />
            <RoadmapItem
              status="done"
              title="Комплексные числа"
              desc="Полная поддержка мнимых чисел: арифметические операции (+−×÷), тригонометрия (sin/cos/tan), экспонента/логарифм, степень/корень, модуль/аргумент/сопряжённое, пользовательские выражения f(z), диаграмма Аргана с визуализацией"
            />
            <RoadmapItem
              status="done"
              title="Графики функций"
              desc="Интерактивная визуализация на canvas: до 6 функций одновременно, перетаскивание/масштабирование, перекрестие с координатами, автообнаружение разрывов, пресеты, поддержка sin/cos/tan/sqrt/exp/ln/abs и произвольных выражений"
            />
            <RoadmapItem
              status="done"
              title="Конвертер единиц"
              desc="10 категорий (длина, масса, время, температура, объём, площадь, скорость, давление, энергия, валюта), 70+ единиц СИ, конвертер валют с 10 основными валютами мира, быстрые конвертации, автоформатирование"
            />
            <RoadmapItem
              status="done"
              title="API курсов валют"
              desc="Автоматическая загрузка актуальных курсов через exchangerate-api.com, кэширование на 24 часа в localStorage, резервный режим при недоступности API, отображение даты и времени обновления, кнопка принудительного обновления"
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
            Спецификация научного калькулятора v1.0.4
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
