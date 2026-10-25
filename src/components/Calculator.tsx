import { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

type AngleMode = 'deg' | 'rad';

interface CalculatorProps {
  onOpenSpec: () => void;
  onOpenConverter: () => void;
  onOpenComplex: () => void;
  onOpenGraph: () => void;
}

function Calculator({ onOpenSpec, onOpenConverter, onOpenComplex, onOpenGraph }: CalculatorProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState(0);
  const [isSecond, setIsSecond] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const keyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toRadians = useCallback((value: number): number => {
    return angleMode === 'deg' ? (value * Math.PI) / 180 : value;
  }, [angleMode]);

  const fromRadians = useCallback((value: number): number => {
    return angleMode === 'deg' ? (value * 180) / Math.PI : value;
  }, [angleMode]);

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const calculateResult = useCallback((expr: string): number => {
    let processed = expr;
    processed = processed.replace(/π/g, String(Math.PI));
    processed = processed.replace(/e(?![x])/g, String(Math.E));

    processed = processed.replace(/sin⁻¹\(([^)]+)\)/g, (_, val) => String(fromRadians(Math.asin(parseFloat(val)))));
    processed = processed.replace(/cos⁻¹\(([^)]+)\)/g, (_, val) => String(fromRadians(Math.acos(parseFloat(val)))));
    processed = processed.replace(/tan⁻¹\(([^)]+)\)/g, (_, val) => String(fromRadians(Math.atan(parseFloat(val)))));
    processed = processed.replace(/sin\(([^)]+)\)/g, (_, val) => String(Math.sin(toRadians(parseFloat(val)))));
    processed = processed.replace(/cos\(([^)]+)\)/g, (_, val) => String(Math.cos(toRadians(parseFloat(val)))));
    processed = processed.replace(/tan\(([^)]+)\)/g, (_, val) => String(Math.tan(toRadians(parseFloat(val)))));
    processed = processed.replace(/ln\(([^)]+)\)/g, (_, val) => String(Math.log(parseFloat(val))));
    processed = processed.replace(/log\(([^)]+)\)/g, (_, val) => String(Math.log10(parseFloat(val))));
    processed = processed.replace(/√\(([^)]+)\)/g, (_, val) => String(Math.sqrt(parseFloat(val))));
    processed = processed.replace(/³√\(([^)]+)\)/g, (_, val) => String(Math.cbrt(parseFloat(val))));
    processed = processed.replace(/abs\(([^)]+)\)/g, (_, val) => String(Math.abs(parseFloat(val))));
    processed = processed.replace(/\^/g, '**');
    processed = processed.replace(/(\d+(?:\.\d+)?)!/g, (_, val) => String(factorial(parseFloat(val))));
    processed = processed.replace(/×/g, '*');
    processed = processed.replace(/÷/g, '/');

    try {
      const result = new Function(`return ${processed}`)();
      return typeof result === 'number' ? result : NaN;
    } catch {
      return NaN;
    }
  }, [angleMode, toRadians, fromRadians]);

  const handleNumber = (num: string) => {
    if (display === '0' && num !== '.') setDisplay(num);
    else if (num === '.' && display.includes('.')) return;
    else setDisplay(display + num);
  };

  const handleOperator = (op: string) => {
    setExpression(expression + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleFunction = (func: string) => {
    setDisplay(func + '(' + display + ')');
  };

  const handleEquals = () => {
    const fullExpression = expression + display;
    const result = calculateResult(fullExpression);
    if (!isNaN(result) && isFinite(result)) {
      const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(10)).toString();
      setHistory(prev => [...prev.slice(-9), `${fullExpression} = ${resultStr}`]);
      setDisplay(resultStr);
      setExpression('');
    } else {
      setDisplay('Ошибка');
    }
  };

  const handleClear = () => { setDisplay('0'); setExpression(''); };
  const handleClearEntry = () => setDisplay('0');
  const handleBackspace = () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  const handleNegate = () => {
    if (display !== '0') setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };
  const handlePercent = () => setDisplay(String(parseFloat(display) / 100));
  const handleSquare = () => setDisplay('(' + display + ')^2');
  const handleCube = () => setDisplay('(' + display + ')^3');
  const handlePower = () => { setExpression(expression + display + '^'); setDisplay('0'); };
  const handleReciprocal = () => {
    const value = parseFloat(display);
    setDisplay(value !== 0 ? String(1 / value) : 'Ошибка');
  };
  const handleMemoryStore = () => setMemory(parseFloat(display));
  const handleMemoryRecall = () => setDisplay(String(memory));
  const handleMemoryAdd = () => setMemory(memory + parseFloat(display));
  const handleMemoryClear = () => setMemory(0);
  const handleExp = () => { setExpression(expression + display + '×10^'); setDisplay('0'); };

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const flashKey = (k: string) => {
        setLastKey(k);
        if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
        keyTimeoutRef.current = setTimeout(() => setLastKey(null), 200);
      };

      if (/^[0-9]$/.test(key)) { e.preventDefault(); handleNumber(key); flashKey(key); return; }
      if (key === '.' || key === ',') { e.preventDefault(); handleNumber('.'); flashKey('.'); return; }
      if (key === '+') { e.preventDefault(); handleOperator('+'); flashKey('+'); return; }
      if (key === '-') { e.preventDefault(); handleOperator('−'); flashKey('-'); return; }
      if (key === '*') { e.preventDefault(); handleOperator('×'); flashKey('*'); return; }
      if (key === '/') { e.preventDefault(); handleOperator('÷'); flashKey('/'); return; }
      if (key === 'Enter' || key === '=') { e.preventDefault(); handleEquals(); flashKey('Enter'); return; }
      if (key === 'Escape') { e.preventDefault(); handleClear(); flashKey('Escape'); return; }
      if (key === 'Backspace') { e.preventDefault(); handleBackspace(); flashKey('Backspace'); return; }
      if (key === 'Delete') { e.preventDefault(); handleClearEntry(); flashKey('Delete'); return; }
      if (key === '%') { e.preventDefault(); handlePercent(); flashKey('%'); return; }
      if (key === '(') { e.preventDefault(); setDisplay(display + '('); flashKey('('); return; }
      if (key === ')') { e.preventDefault(); setDisplay(display + ')'); flashKey(')'); return; }
      if (key === '^') { e.preventDefault(); handlePower(); flashKey('^'); return; }
      if (key === '!') { e.preventDefault(); setDisplay(display + '!'); flashKey('!'); return; }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
    };
  }, [display, expression, angleMode, memory, isSecond]);

  const Shortcut = ({ keys, action }: { keys: string; action: string }) => (
    <div className="flex items-center justify-between gap-2">
      <kbd className={`px-1.5 py-0.5 rounded font-mono text-[10px] border whitespace-nowrap ${
        isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/40' : 'bg-gray-200 text-gray-700 border-gray-300'
      }`}>{keys}</kbd>
      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{action}</span>
    </div>
  );

  const Button = ({ label, onClick, className = '', span = 1, keyId }: {
    label: string; onClick: () => void; className?: string; span?: number; keyId?: string;
  }) => {
    const isActive = keyId && lastKey === keyId;
    return (
      <button onClick={onClick} className={`
        ${span === 2 ? 'col-span-2' : ''}
        h-14 rounded-xl font-medium text-sm transition-all duration-150
        active:scale-95 active:brightness-90 hover:brightness-110
        ${isActive ? 'scale-95 brightness-125 ring-2 ring-indigo-400/50' : ''}
        ${className}
      `}>{label}</button>
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50'
    }`}>
      <div className="w-full max-w-lg">
        <div className={`rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
          isDark ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700/50' : 'bg-white/90 backdrop-blur-xl border-gray-200/80 shadow-lg'
        }`}>
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white/80' : 'text-gray-800'}`}>Научный Калькулятор</h1>
            <div className="flex items-center gap-1.5">
              <button onClick={onOpenComplex} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
                isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
              }`} title="Комплексные числа">ℂ</button>
              <button onClick={onOpenGraph} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
                isDark ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-200'
              }`} title="Графики функций">📈</button>
              <button onClick={onOpenConverter} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
                isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30' : 'bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200'
              }`} title="Конвертер единиц">🔄</button>
              <button onClick={onOpenSpec} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
                isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
              }`} title="Спецификация">📄</button>
              <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
                isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30 hover:bg-indigo-500/30'
              }`} title="Сменить тему">{isDark ? '☀️' : '🌙'}</button>
              <button onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                angleMode === 'deg'
                  ? isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200'
                  : isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>{angleMode === 'deg' ? 'DEG' : 'RAD'}</button>
              <button onClick={() => setIsSecond(!isSecond)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                isSecond
                  ? isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'
                  : isDark ? 'bg-gray-600/50 text-gray-400 border-gray-600/30' : 'bg-gray-200 text-gray-600 border-gray-300'
              }`}>2nd</button>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
              isDark ? 'bg-gray-900/70 border-gray-700/30' : 'bg-gray-100/80 border-gray-200/60'
            }`}>
              <div className={`text-sm h-6 text-right overflow-hidden font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {expression || '\u00A0'}
              </div>
              <div className={`text-3xl text-right font-light mt-1 overflow-x-auto scrollbar-hide font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {display}
              </div>
              {memory !== 0 && (
                <div className={`text-xs text-right mt-1 ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>M = {memory}</div>
              )}
            </div>
          </div>

          <div className="px-4 pb-5">
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              <Button label="MC" onClick={handleMemoryClear} className={`text-xs ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`} />
              <Button label="MR" onClick={handleMemoryRecall} className={`text-xs ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`} />
              <Button label="M+" onClick={handleMemoryAdd} className={`text-xs ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`} />
              <Button label="MS" onClick={handleMemoryStore} className={`text-xs ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`} />
              <Button label="1/x" onClick={handleReciprocal} className={`text-xs ${isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`} />
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              <Button label={isSecond ? 'sin⁻¹' : 'sin'} onClick={() => handleFunction(isSecond ? 'sin⁻¹' : 'sin')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label={isSecond ? 'cos⁻¹' : 'cos'} onClick={() => handleFunction(isSecond ? 'cos⁻¹' : 'cos')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label={isSecond ? 'tan⁻¹' : 'tan'} onClick={() => handleFunction(isSecond ? 'tan⁻¹' : 'tan')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="π" onClick={() => handleNumber(String(Math.PI))} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="e" onClick={() => handleNumber(String(Math.E))} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              <Button label="x²" onClick={handleSquare} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="x³" onClick={handleCube} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="xⁿ" onClick={handlePower} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label={isSecond ? '³√' : '√'} onClick={() => handleFunction(isSecond ? '³√' : '√')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="|x|" onClick={() => handleFunction('abs')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-3">
              <Button label="ln" onClick={() => handleFunction('ln')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="log" onClick={() => handleFunction('log')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="n!" onClick={() => setDisplay(display + '!')} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="EXP" onClick={handleExp} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
              <Button label="%" onClick={handlePercent} className={`text-xs border ${isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`} />
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              <Button label="CE" onClick={handleClearEntry} keyId="Delete" className={`border ${isDark ? 'bg-red-900/30 text-red-400 border-red-800/30' : 'bg-red-100 text-red-600 border-red-200'}`} />
              <Button label="C" onClick={handleClear} keyId="Escape" className={`border ${isDark ? 'bg-red-900/30 text-red-400 border-red-800/30' : 'bg-red-100 text-red-600 border-red-200'}`} />
              <Button label="⌫" onClick={handleBackspace} keyId="Backspace" className={`border ${isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-300'}`} />
              <Button label="(" onClick={() => setDisplay(display + '(')} keyId="(" className={`border ${isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-300'}`} />
              <Button label=")" onClick={() => setDisplay(display + ')')} keyId=")" className={`border ${isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-300'}`} />

              <Button label="7" onClick={() => handleNumber('7')} keyId="7" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="8" onClick={() => handleNumber('8')} keyId="8" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="9" onClick={() => handleNumber('9')} keyId="9" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="÷" onClick={() => handleOperator('÷')} keyId="/" className={isDark ? 'bg-amber-600/80 text-white' : 'bg-blue-500 text-white'} />
              <Button label="±" onClick={handleNegate} className={`border ${isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-300'}`} />

              <Button label="4" onClick={() => handleNumber('4')} keyId="4" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="5" onClick={() => handleNumber('5')} keyId="5" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="6" onClick={() => handleNumber('6')} keyId="6" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="×" onClick={() => handleOperator('×')} keyId="*" className={isDark ? 'bg-amber-600/80 text-white' : 'bg-blue-500 text-white'} />
              <Button label="mod" onClick={() => handleOperator('%')} className={`border ${isDark ? 'bg-gray-700/60 text-gray-300 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-300'}`} />

              <Button label="1" onClick={() => handleNumber('1')} keyId="1" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="2" onClick={() => handleNumber('2')} keyId="2" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="3" onClick={() => handleNumber('3')} keyId="3" className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="−" onClick={() => handleOperator('−')} keyId="-" className={isDark ? 'bg-amber-600/80 text-white' : 'bg-blue-500 text-white'} />
              <Button label="=" onClick={handleEquals} keyId="Enter" className="bg-blue-600 text-white row-span-2 h-full" />

              <Button label="0" onClick={() => handleNumber('0')} keyId="0" className={`${isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} col-span-2`} span={2} />
              <Button label="." onClick={() => handleNumber('.')} keyId="." className={isDark ? 'bg-gray-700/80 text-white' : 'bg-gray-200 text-gray-800'} />
              <Button label="+" onClick={() => handleOperator('+')} keyId="+" className={isDark ? 'bg-amber-600/80 text-white' : 'bg-blue-500 text-white'} />
            </div>
          </div>

          {history.length > 0 && (
            <div className="px-6 pb-4">
              <div className={`rounded-xl p-3 border transition-colors duration-300 ${
                isDark ? 'bg-gray-900/50 border-gray-700/20' : 'bg-gray-100/50 border-gray-200/40'
              }`}>
                <div className={`text-xs mb-2 font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>История вычислений</div>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {history.map((item, index) => (
                    <div key={index} className={`text-xs font-mono text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 px-2">
          <div className={`rounded-xl p-3 border transition-colors duration-300 ${
            isDark ? 'bg-gray-800/40 border-gray-700/20' : 'bg-white/60 border-gray-200/40'
          }`}>
            <div className={`text-[10px] uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <span>⌨️</span> Горячие клавиши
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <Shortcut keys="0-9" action="Цифры" />
              <Shortcut keys="+ − × ÷" action="Операторы" />
              <Shortcut keys="Enter / =" action="Вычислить" />
              <Shortcut keys="Escape" action="Очистить (C)" />
              <Shortcut keys="Backspace" action="Удалить символ" />
              <Shortcut keys="Delete" action="Очистить ввод (CE)" />
              <Shortcut keys="( )" action="Скобки" />
              <Shortcut keys="^" action="Степень" />
              <Shortcut keys="!" action="Факториал" />
              <Shortcut keys="% / ." action="Процент / Точка" />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className={`text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>v1.0.5</span>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
