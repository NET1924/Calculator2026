import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchExchangeRates, convertCurrency, formatDate, getTimeSinceUpdate } from '../utils/exchangeRates';

interface UnitConverterProps {
  onBack: () => void;
}

type Category = {
  id: string;
  name: string;
  icon: string;
  units: { id: string; name: string; symbol: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
};

const categories: Category[] = [
  {
    id: 'length', name: 'Длина', icon: '📏',
    units: [
      { id: 'm', name: 'Метр', symbol: 'м', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Километр', symbol: 'км', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Сантиметр', symbol: 'см', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Миллиметр', symbol: 'мм', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mi', name: 'Миля', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', name: 'Ярд', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', name: 'Фут', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', name: 'Дюйм', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ],
  },
  {
    id: 'mass', name: 'Масса', icon: '⚖️',
    units: [
      { id: 'kg', name: 'Килограмм', symbol: 'кг', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Грамм', symbol: 'г', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Миллиграмм', symbol: 'мг', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 't', name: 'Тонна', symbol: 'т', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', name: 'Фунт', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'oz', name: 'Унция', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    ],
  },
  {
    id: 'time', name: 'Время', icon: '⏱️',
    units: [
      { id: 's', name: 'Секунда', symbol: 'с', toBase: v => v, fromBase: v => v },
      { id: 'ms', name: 'Миллисекунда', symbol: 'мс', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'min', name: 'Минута', symbol: 'мин', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'h', name: 'Час', symbol: 'ч', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'd', name: 'День', symbol: 'дн', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: 'w', name: 'Неделя', symbol: 'нед', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: 'y', name: 'Год', symbol: 'год', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
    ],
  },
  {
    id: 'temperature', name: 'Температура', icon: '🌡️',
    units: [
      { id: 'c', name: 'Цельсий', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Фаренгейт', symbol: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'k', name: 'Кельвин', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'volume', name: 'Объём', icon: '🧪',
    units: [
      { id: 'l', name: 'Литр', symbol: 'л', toBase: v => v, fromBase: v => v },
      { id: 'ml', name: 'Миллилитр', symbol: 'мл', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'm3', name: 'Кубический метр', symbol: 'м³', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'gal', name: 'Галлон (US)', symbol: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'pt', name: 'Пинта (US)', symbol: 'pt', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    ],
  },
  {
    id: 'area', name: 'Площадь', icon: '📐',
    units: [
      { id: 'm2', name: 'Квадратный метр', symbol: 'м²', toBase: v => v, fromBase: v => v },
      { id: 'km2', name: 'Квадратный километр', symbol: 'км²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'ha', name: 'Гектар', symbol: 'га', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: 'ac', name: 'Акр', symbol: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    ],
  },
  {
    id: 'speed', name: 'Скорость', icon: '🚀',
    units: [
      { id: 'ms', name: 'Метр в секунду', symbol: 'м/с', toBase: v => v, fromBase: v => v },
      { id: 'kmh', name: 'Километр в час', symbol: 'км/ч', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Миля в час', symbol: 'миль/ч', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'kn', name: 'Узел', symbol: 'уз', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  {
    id: 'pressure', name: 'Давление', icon: '🎈',
    units: [
      { id: 'pa', name: 'Паскаль', symbol: 'Па', toBase: v => v, fromBase: v => v },
      { id: 'kpa', name: 'Килопаскаль', symbol: 'кПа', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'bar', name: 'Бар', symbol: 'бар', toBase: v => v * 100000, fromBase: v => v / 100000 },
      { id: 'atm', name: 'Атмосфера', symbol: 'атм', toBase: v => v * 101325, fromBase: v => v / 101325 },
      { id: 'psi', name: 'Фунт на кв. дюйм', symbol: 'psi', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    ],
  },
  {
    id: 'energy', name: 'Энергия', icon: '⚡',
    units: [
      { id: 'j', name: 'Джоуль', symbol: 'Дж', toBase: v => v, fromBase: v => v },
      { id: 'kj', name: 'Килоджоуль', symbol: 'кДж', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cal', name: 'Калория', symbol: 'кал', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: 'kcal', name: 'Килокалория', symbol: 'ккал', toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: 'kwh', name: 'Киловатт-час', symbol: 'кВт·ч', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
    ],
  },
  {
    id: 'currency', name: 'Валюта', icon: '💱',
    units: [
      { id: 'USD', name: 'Доллар США', symbol: '$', toBase: v => v, fromBase: v => v },
      { id: 'EUR', name: 'Евро', symbol: '€', toBase: v => v, fromBase: v => v },
      { id: 'RUB', name: 'Российский рубль', symbol: '₽', toBase: v => v, fromBase: v => v },
      { id: 'GBP', name: 'Фунт стерлингов', symbol: '£', toBase: v => v, fromBase: v => v },
      { id: 'JPY', name: 'Японская иена', symbol: '¥', toBase: v => v, fromBase: v => v },
      { id: 'CNY', name: 'Китайский юань', symbol: '¥', toBase: v => v, fromBase: v => v },
      { id: 'CHF', name: 'Швейцарский франк', symbol: 'Fr', toBase: v => v, fromBase: v => v },
      { id: 'CAD', name: 'Канадский доллар', symbol: 'C$', toBase: v => v, fromBase: v => v },
      { id: 'AUD', name: 'Австралийский доллар', symbol: 'A$', toBase: v => v, fromBase: v => v },
      { id: 'TRY', name: 'Турецкая лира', symbol: '₺', toBase: v => v, fromBase: v => v },
    ],
  },
];

export default function UnitConverter({ onBack }: UnitConverterProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('1');
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
      setRatesLoading(true);
      try {
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error loading exchange rates:', error);
      } finally {
        setRatesLoading(false);
      }
    };
    loadRates();
  }, []);

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.0001 || Math.abs(num) > 1e9) return num.toExponential(6);
    return parseFloat(num.toFixed(10)).toString();
  };

  const result = (() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    if (selectedCategory === 'currency' && exchangeRates) {
      const converted = convertCurrency(value, fromUnit, toUnit, exchangeRates);
      return isNaN(converted) ? '' : formatNumber(converted);
    }
    const from = currentCategory.units.find(u => u.id === fromUnit);
    const to = currentCategory.units.find(u => u.id === toUnit);
    if (!from || !to) return '';
    return formatNumber(to.fromBase(from.toBase(value)));
  })();

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    const cat = categories.find(c => c.id === id);
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].id);
      setToUnit(cat.units[1].id);
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200' : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 text-gray-800'
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/60'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
          }`}>← Калькулятор</button>
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Конвертер единиц</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
              isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
            }`}>{isDark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? isDark ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                : isDark ? 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50' : 'bg-white/80 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}>
              <span className="mr-2">{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>

        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-lg'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            <div className="md:col-span-5 space-y-3">
              <label className={`text-xs uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Из</label>
              <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isDark ? 'bg-gray-900/70 border border-gray-700/50 text-white' : 'bg-white border border-gray-300 text-gray-900'
              }`}>
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                ))}
              </select>
              <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className={`w-full px-4 py-4 rounded-xl text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isDark ? 'bg-gray-900/70 border border-gray-700/50 text-white' : 'bg-white border border-gray-300 text-gray-900'
              }`} />
            </div>
            <div className="md:col-span-1 flex justify-center">
              <button onClick={handleSwap} className={`w-12 h-12 rounded-full transition-all flex items-center justify-center text-xl ${
                isDark ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30' : 'bg-cyan-100 text-cyan-700 border border-cyan-300 hover:bg-cyan-200'
              }`}>⇄</button>
            </div>
            <div className="md:col-span-5 space-y-3">
              <label className={`text-xs uppercase tracking-wider font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>В</label>
              <select value={toUnit} onChange={e => setToUnit(e.target.value)} className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isDark ? 'bg-gray-900/70 border border-gray-700/50 text-white' : 'bg-white border border-gray-300 text-gray-900'
              }`}>
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                ))}
              </select>
              <div className={`w-full px-4 py-4 rounded-xl text-2xl font-mono min-h-[64px] flex items-center justify-end ${
                isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/30 text-cyan-300' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 text-cyan-700'
              }`}>{result || '0'}</div>
            </div>
          </div>
          <div className={`mt-6 pt-6 border-t text-center ${isDark ? 'border-gray-700/30' : 'border-gray-200'}`}>
            <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Результат конвертации</div>
            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {inputValue || '0'} <span className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentCategory.units.find(u => u.id === fromUnit)?.symbol}</span>
              {' = '}
              <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>{result || '0'}</span>
              {' '}
              <span className={`text-xl ${isDark ? 'text-cyan-400/70' : 'text-cyan-600/70'}`}>{currentCategory.units.find(u => u.id === toUnit)?.symbol}</span>
            </div>
          </div>
        </div>

        {selectedCategory === 'currency' && (
          <div className={`mt-6 rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/30' : 'bg-white/80 border-gray-200'}`}>
            {ratesLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin text-xl">💱</div>
                <div>
                  <div className={`text-sm font-medium ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>Загрузка курсов...</div>
                </div>
              </div>
            ) : exchangeRates ? (
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <div className={`text-sm font-medium mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Актуальные курсы валют</div>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    📅 Дата: {formatDate(exchangeRates.date)} | 🕐 Обновлено: {getTimeSinceUpdate(exchangeRates.lastUpdated)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
