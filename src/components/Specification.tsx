import { useTheme } from '../context/ThemeContext';

interface SpecificationProps {
  onBack: () => void;
}

export default function Specification({ onBack }: SpecificationProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-200' : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 text-gray-800'
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/60'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
          }`}>← Калькулятор</button>
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Спецификация</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
              isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
            }`}>{isDark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-lg'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Научный Калькулятор v1.0.5</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Полнофункциональное веб-приложение для математических вычислений, конвертации единиц, работы с комплексными числами и визуализации функций.
          </p>

          {/* Раздел 1: Основные функции */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Основные функции калькулятора</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Арифметические операции:</h4>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Сложение, вычитание, умножение, деление</li>
                <li>Возведение в степень (x², x³, xⁿ)</li>
                <li>Извлечение корня (√, ³√)</li>
                <li>Процент (%)</li>
                <li>Факториал (n!)</li>
                <li>Модуль числа (|x|)</li>
                <li>Обратное число (1/x)</li>
              </ul>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Тригонометрические функции:</h4>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>sin, cos, tan (прямые)</li>
                <li>sin⁻¹, cos⁻¹, tan⁻¹ (обратные, через режим 2nd)</li>
                <li>Переключение DEG/RAD</li>
              </ul>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Логарифмы:</h4>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>ln — натуральный логарифм</li>
                <li>log — десятичный логарифм</li>
                <li>EXP — экспоненциальная запись (×10ⁿ)</li>
              </ul>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Память:</h4>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>MC — очистить память</li>
                <li>MR — вызвать из памяти</li>
                <li>M+ — прибавить к памяти</li>
                <li>MS — сохранить в память</li>
              </ul>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Константы:</h4>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>π — число Пи</li>
                <li>e — число Эйлера</li>
              </ul>
            </div>
          </section>

          {/* Раздел 2: Клавиатурный ввод */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Клавиатурный ввод</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Поддержка ввода с физической клавиатуры с визуальной подсветкой нажатых кнопок:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Цифры и операторы:</h4>
                  <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>0-9</kbd> — цифры</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>+ - * /</kbd> — операторы</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>.</kbd> — десятичная точка</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>^</kbd> — степень</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>!</kbd> — факториал</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>%</kbd> — процент</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Управление:</h4>
                  <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>Enter</kbd> — вычислить</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>Escape</kbd> — очистить (C)</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>Delete</kbd> — очистить ввод (CE)</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>Backspace</kbd> — удалить символ</li>
                    <li><kbd className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>( )</kbd> — скобки</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Раздел 3: Конвертер единиц */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. Конвертер единиц</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                10 категорий с 70+ единицами измерения:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Физические величины:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>📏 Длина (м, км, см, мм, миль, ярды и др.)</li>
                    <li>⚖️ Масса (кг, г, мг, тонны, фунты и др.)</li>
                    <li>⏱️ Время (с, мин, ч, дни, недели и др.)</li>
                    <li>🌡️ Температура (°C, °F, K)</li>
                    <li>🧪 Объём (л, мл, м³, галлоны и др.)</li>
                    <li>📐 Площадь (м², км², га, акры и др.)</li>
                    <li>🚀 Скорость (м/с, км/ч, узлы и др.)</li>
                    <li>🎈 Давление (Па, бар, атм, psi и др.)</li>
                    <li>⚡ Энергия (Дж, кДж, кал, кВт·ч и др.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>💱 Валюта:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>USD — доллар США</li>
                    <li>EUR — евро</li>
                    <li>RUB — российский рубль</li>
                    <li>GBP — фунт стерлингов</li>
                    <li>JPY — японская иена</li>
                    <li>CNY — китайский юань</li>
                    <li>CHF — швейцарский франк</li>
                    <li>CAD — канадский доллар</li>
                    <li>AUD — австралийский доллар</li>
                    <li>TRY — турецкая лира</li>
                  </ul>
                </div>
              </div>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>API курсов валют:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Источник: exchangerate-api.com (бесплатный API)</li>
                <li>Автоматическая загрузка при открытии конвертера</li>
                <li>Кэширование на 24 часа в localStorage</li>
                <li>Резервный режим при недоступности API</li>
                <li>Отображение даты и времени обновления</li>
                <li>Кнопка принудительного обновления</li>
              </ul>
            </div>
          </section>

          {/* Раздел 4: Комплексные числа */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Комплексные числа</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Полная поддержка мнимых чисел с визуализацией на диаграмме Аргана:
              </p>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Формат ввода:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>3 + 4i</code> — алгебраическая форма</li>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>-2.5i</code> — чисто мнимое</li>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>7</code> — действительное</li>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>1 - i</code> — с единичным коэффициентом</li>
              </ul>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Операции (14 функций):</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Сложение (z₁ + z₂)</li>
                  <li>Вычитание (z₁ − z₂)</li>
                  <li>Умножение (z₁ × z₂)</li>
                  <li>Деление (z₁ ÷ z₂)</li>
                  <li>Степень (zⁿ)</li>
                  <li>Корень (√z)</li>
                  <li>Экспонента (eᶻ)</li>
                </ul>
                <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Логарифм (ln z)</li>
                  <li>Синус (sin z)</li>
                  <li>Косинус (cos z)</li>
                  <li>Тангенс (tan z)</li>
                  <li>Модуль (|z|)</li>
                  <li>Аргумент (arg z)</li>
                  <li>Сопряжённое (z̄)</li>
                </ul>
              </div>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Пользовательские выражения:</h4>
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Поддержка произвольных функций от z с рекурсивным парсером:
              </p>
              <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>z^2 + 1</code></li>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>exp(z * i)</code></li>
                <li><code className={`px-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>sin(z) + cos(z)</code></li>
              </ul>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Визуализация:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Диаграмма Аргана на canvas</li>
                <li>Цветовая кодировка: z₁ (синий), z₂ (жёлтый), результат (зелёный)</li>
                <li>Векторы от начала координат</li>
                <li>Автоматическое масштабирование</li>
              </ul>
            </div>
          </section>

          {/* Раздел 5: Графики функций */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Графики функций</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Интерактивная визуализация математических функций на координатной плоскости:
              </p>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Возможности:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>До 6 функций одновременно с уникальными цветами</li>
                <li>Перетаскивание мышью для навигации</li>
                <li>Масштабирование колесом мыши (5–500 px/ед)</li>
                <li>Перекрестие с координатами при наведении</li>
                <li>Автообнаружение разрывов (tan, 1/x)</li>
                <li>10 готовых пресетов</li>
              </ul>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Поддерживаемые функции:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Тригонометрические: sin, cos, tan</li>
                  <li>Обратные: asin, acos, atan</li>
                  <li>Степенные: x^n, sqrt, abs</li>
                </ul>
                <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>Логарифмические: ln, log, exp</li>
                  <li>Константы: pi, e</li>
                  <li>Операторы: + - * / ^, скобки</li>
                </ul>
              </div>

              <h4 className={`font-medium mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Пресеты:</h4>
              <div className={`flex flex-wrap gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>sin(x)</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>cos(x)</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>tan(x)</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>x²</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>x³</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>√x</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>1/x</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>eˣ</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>ln(x)</code>
                <code className={`px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>|x|</code>
              </div>
            </div>
          </section>

          {/* Раздел 6: Темы оформления */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Темы оформления</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Поддержка светлой и тёмной тем с сохранением выбора:
              </p>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🌙 Тёмная тема (по умолчанию):</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Тёмный градиентный фон (gray-900 → slate-900)</li>
                <li>Полупрозрачные карточки с backdrop-blur</li>
                <li>Светлый текст на тёмном фоне</li>
                <li>Акцентные цвета: indigo, cyan, emerald, amber</li>
              </ul>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>☀️ Светлая тема:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>Светлый градиентный фон (slate-100 → gray-50 → blue-50)</li>
                <li>Белые карточки с лёгкими тенями</li>
                <li>Тёмный текст на светлом фоне</li>
                <li>Адаптированные акцентные цвета</li>
              </ul>

              <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Техническая реализация:</h4>
              <ul className={`list-disc list-inside space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>React Context (ThemeContext) для управления состоянием</li>
                <li>Сохранение в localStorage</li>
                <li>Плавные переходы (transition-colors duration-300)</li>
                <li>Кнопка переключения ☀️/🌙 в шапке</li>
              </ul>
            </div>
          </section>

          {/* Раздел 7: Технологии */}
          <section className="mb-8">
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Технологии</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Стек:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>React 18</li>
                    <li>TypeScript 5</li>
                    <li>Vite 6</li>
                    <li>Tailwind CSS 4</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Структура:</h4>
                  <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>context/ — ThemeContext</li>
                    <li>components/ — UI компоненты</li>
                    <li>utils/ — утилиты (complex, exchangeRates)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Раздел 8: История версий */}
          <section>
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. История версий</h3>
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <div className="space-y-3 text-sm">
                <div>
                  <div className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>v1.0.5 — Темы оформления</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Светлая и тёмная темы</li>
                    <li>Сохранение выбора в localStorage</li>
                  </ul>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>v1.0.4 — API курсов валют</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Интеграция с exchangerate-api.com</li>
                    <li>Кэширование на 24 часа</li>
                  </ul>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>v1.0.3 — Комплексные числа и графики</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Модуль комплексных чисел с диаграммой Аргана</li>
                    <li>Графики функций с интерактивной визуализацией</li>
                  </ul>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>v1.0.2 — Конвертер единиц</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>10 категорий, 70+ единиц измерения</li>
                  </ul>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>v1.0.1 — Клавиатурный ввод</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Поддержка физической клавиатуры</li>
                  </ul>
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>v1.0.0 — Базовый калькулятор</div>
                  <ul className={`list-disc list-inside ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Научный калькулятор с тригонометрией и логарифмами</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
