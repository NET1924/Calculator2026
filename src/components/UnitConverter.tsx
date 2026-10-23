import { useState, useMemo } from 'react';

interface UnitConverterProps {
  onBack: () => void;
  onOpenSpec: () => void;
}

type Category = {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
};

type Unit = {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

const categories: Category[] = [
  {
    id: 'length',
    name: 'Длина',
    icon: '📏',
    units: [
      { id: 'm', name: 'Метр', symbol: 'м', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Километр', symbol: 'км', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', name: 'Сантиметр', symbol: 'см', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', name: 'Миллиметр', symbol: 'мм', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'um', name: 'Микрометр', symbol: 'мкм', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 'nm', name: 'Нанометр', symbol: 'нм', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
      { id: 'mi', name: 'Миля', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', name: 'Ярд', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', name: 'Фут', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', name: 'Дюйм', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'nmi', name: 'Морская миля', symbol: 'nmi', toBase: v => v * 1852, fromBase: v => v / 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Масса',
    icon: '⚖️',
    units: [
      { id: 'kg', name: 'Килограмм', symbol: 'кг', toBase: v => v, fromBase: v => v },
      { id: 'g', name: 'Грамм', symbol: 'г', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', name: 'Миллиграмм', symbol: 'мг', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 't', name: 'Тонна', symbol: 'т', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', name: 'Фунт', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'oz', name: 'Унция', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: 'ct', name: 'Карат', symbol: 'ct', toBase: v => v * 0.0002, fromBase: v => v / 0.0002 },
    ],
  },
  {
    id: 'time',
    name: 'Время',
    icon: '⏱️',
    units: [
      { id: 's', name: 'Секунда', symbol: 'с', toBase: v => v, fromBase: v => v },
      { id: 'ms', name: 'Миллисекунда', symbol: 'мс', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'min', name: 'Минута', symbol: 'мин', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'h', name: 'Час', symbol: 'ч', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'd', name: 'День', symbol: 'дн', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: 'w', name: 'Неделя', symbol: 'нед', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: 'mo', name: 'Месяц (30 дней)', symbol: 'мес', toBase: v => v * 2592000, fromBase: v => v / 2592000 },
      { id: 'y', name: 'Год (365 дней)', symbol: 'год', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
    ],
  },
  {
    id: 'temperature',
    name: 'Температура',
    icon: '🌡️',
    units: [
      { id: 'c', name: 'Цельсий', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Фаренгейт', symbol: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'k', name: 'Кельвин', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'volume',
    name: 'Объём',
    icon: '🧪',
    units: [
      { id: 'l', name: 'Литр', symbol: 'л', toBase: v => v, fromBase: v => v },
      { id: 'ml', name: 'Миллилитр', symbol: 'мл', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'm3', name: 'Кубический метр', symbol: 'м³', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm3', name: 'Кубический сантиметр', symbol: 'см³', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'gal', name: 'Галлон (US)', symbol: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'pt', name: 'Пинта (US)', symbol: 'pt', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { id: 'cup', name: 'Чашка', symbol: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { id: 'floz', name: 'Жидкая унция', symbol: 'fl oz', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    ],
  },
  {
    id: 'area',
    name: 'Площадь',
    icon: '📐',
    units: [
      { id: 'm2', name: 'Квадратный метр', symbol: 'м²', toBase: v => v, fromBase: v => v },
      { id: 'km2', name: 'Квадратный километр', symbol: 'км²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'cm2', name: 'Квадратный сантиметр', symbol: 'см²', toBase: v => v / 10000, fromBase: v => v * 10000 },
      { id: 'ha', name: 'Гектар', symbol: 'га', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: 'ac', name: 'Акр', symbol: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { id: 'ft2', name: 'Квадратный фут', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    ],
  },
  {
    id: 'speed',
    name: 'Скорость',
    icon: '🚀',
    units: [
      { id: 'ms', name: 'Метр в секунду', symbol: 'м/с', toBase: v => v, fromBase: v => v },
      { id: 'kmh', name: 'Километр в час', symbol: 'км/ч', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'Миля в час', symbol: 'миль/ч', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'kn', name: 'Узел', symbol: 'уз', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
      { id: 'fts', name: 'Фут в секунду', symbol: 'фт/с', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    ],
  },
  {
    id: 'pressure',
    name: 'Давление',
    icon: '🎈',
    units: [
      { id: 'pa', name: 'Паскаль', symbol: 'Па', toBase: v => v, fromBase: v => v },
      { id: 'kpa', name: 'Килопаскаль', symbol: 'кПа', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'mpa', name: 'Мегапаскаль', symbol: 'МПа', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'bar', name: 'Бар', symbol: 'бар', toBase: v => v * 100000, fromBase: v => v / 100000 },
      { id: 'atm', name: 'Атмосфера', symbol: 'атм', toBase: v => v * 101325, fromBase: v => v / 101325 },
      { id: 'mmhg', name: 'мм ртутного столба', symbol: 'мм рт.ст.', toBase: v => v * 133.322, fromBase: v => v / 133.322 },
      { id: 'psi', name: 'Фунт на кв. дюйм', symbol: 'psi', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    ],
  },
  {
    id: 'energy',
    name: 'Энергия',
    icon: '⚡',
    units: [
      { id: 'j', name: 'Джоуль', symbol: 'Дж', toBase: v => v, fromBase: v => v },
      { id: 'kj', name: 'Килоджоуль', symbol: 'кДж', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cal', name: 'Калория', symbol: 'кал', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: 'kcal', name: 'Килокалория', symbol: 'ккал', toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: 'wh', name: 'Ватт-час', symbol: 'Вт·ч', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'kwh', name: 'Киловатт-час', symbol: 'кВт·ч', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
      { id: 'ev', name: 'Электронвольт', symbol: 'эВ', toBase: v => v * 1.602e-19, fromBase: v => v / 1.602e-19 },
    ],
  },
  {
    id: 'currency',
    name: 'Валюта',
    icon: '💱',
    units: [
      { id: 'usd', name: 'Доллар США', symbol: '$', toBase: v => v, fromBase: v => v },
      { id: 'eur', name: 'Евро', symbol: '€', toBase: v => v * 1.08, fromBase: v => v / 1.08 },
      { id: 'rub', name: 'Российский рубль', symbol: '₽', toBase: v => v / 92.5, fromBase: v => v * 92.5 },
      { id: 'gbp', name: 'Фунт стерлингов', symbol: '£', toBase: v => v * 1.27, fromBase: v => v / 1.27 },
      { id: 'jpy', name: 'Японская иена', symbol: '¥', toBase: v => v / 156.5, fromBase: v => v * 156.5 },
      { id: 'cny', name: 'Китайский юань', symbol: '¥', toBase: v => v / 7.25, fromBase: v => v * 7.25 },
      { id: 'chf', name: 'Швейцарский франк', symbol: 'Fr', toBase: v => v * 1.13, fromBase: v => v / 1.13 },
      { id: 'cad', name: 'Канадский доллар', symbol: 'C$', toBase: v => v * 0.74, fromBase: v => v / 0.74 },
      { id: 'aud', name: 'Австралийский доллар', symbol: 'A$', toBase: v => v * 0.66, fromBase: v => v / 0.66 },
      { id: 'try', name: 'Турецкая лира', symbol: '₺', toBase: v => v / 34.2, fromBase: v => v * 34.2 },
    ],
  },
];

function UnitConverter({ onBack, onOpenSpec }: UnitConverterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [inputValue, setInputValue] = useState<string>('1');

  const currentCategory = useMemo(() => 
    categories.find(c => c.id === selectedCategory) || categories[0],
    [selectedCategory]
  );

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    const from = currentCategory.units.find(u => u.id === fromUnit);
    const to = currentCategory.units.find(u => u.id === toUnit);
    
    if (!from || !to) return '';
    
    const baseValue = from.toBase(value);
    const converted = to.fromBase(baseValue);
    
    return formatNumber(converted);
  }, [inputValue, fromUnit, toUnit, currentCategory]);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.0001 || Math.abs(num) > 1e9) {
      return num.toExponential(6);
    }
    return parseFloat(num.toFixed(10)).toString();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const cat = categories.find(c => c.id === categoryId);
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
            <button
              onClick={onOpenSpec}
              className="px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all text-sm font-medium"
            >
              📄 SPEC
            </button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white">Конвертер единиц</h1>
            <span className="text-[10px] text-gray-500 font-mono">v1.0.2</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Category selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Converter card */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            {/* From */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Из</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-4 bg-gray-900/70 border border-gray-700/50 rounded-xl text-2xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Введите значение"
              />
            </div>

            {/* Swap button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={handleSwap}
                className="w-12 h-12 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all flex items-center justify-center text-xl"
                title="Поменять местами"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">В</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/70 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {currentCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <div className="w-full px-4 py-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/30 rounded-xl text-2xl text-cyan-300 font-mono min-h-[64px] flex items-center justify-end">
                {result || '0'}
              </div>
            </div>
          </div>

          {/* Result summary */}
          <div className="mt-6 pt-6 border-t border-gray-700/30">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">Результат конвертации</div>
              <div className="text-3xl font-bold text-white">
                {inputValue || '0'}{' '}
                <span className="text-gray-400 text-xl">
                  {currentCategory.units.find(u => u.id === fromUnit)?.symbol}
                </span>
                {' = '}
                <span className="text-cyan-400">{result || '0'}</span>{' '}
                <span className="text-cyan-400/70 text-xl">
                  {currentCategory.units.find(u => u.id === toUnit)?.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick conversions */}
        <div className="mt-6 bg-gray-800/30 rounded-2xl p-6 border border-gray-700/20">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Быстрые конвертации
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 5, 10, 100, 1000].map(val => {
              const from = currentCategory.units.find(u => u.id === fromUnit);
              const to = currentCategory.units.find(u => u.id === toUnit);
              if (!from || !to) return null;
              
              const baseValue = from.toBase(val);
              const converted = to.fromBase(baseValue);
              
              return (
                <div
                  key={val}
                  className="flex items-center justify-between px-4 py-2 bg-gray-900/30 rounded-lg border border-gray-700/20 hover:bg-gray-900/50 transition-colors cursor-pointer"
                  onClick={() => setInputValue(String(val))}
                >
                  <span className="text-gray-400 text-sm">
                    {val} {from.symbol}
                  </span>
                  <span className="text-cyan-400 text-sm font-mono">
                    = {formatNumber(converted)} {to.symbol}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency note */}
        {selectedCategory === 'currency' && (
          <div className="mt-6 bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <div className="text-amber-300 text-sm font-medium mb-1">Примечание о курсах валют</div>
                <p className="text-amber-200/70 text-xs leading-relaxed">
                  Курсы валют указаны ориентировочно и могут отличаться от актуальных рыночных курсов.
                  Для точных расчётов используйте официальные данные банков.
                  Курсы обновлены: январь 2026.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UnitConverter;
