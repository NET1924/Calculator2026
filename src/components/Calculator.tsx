import { useState, useCallback, useEffect, useRef } from 'react';

type AngleMode = 'deg' | 'rad';

interface CalculatorProps {
  onOpenSpec: () => void;
  onOpenConverter: () => void;
  onOpenComplex: () => void;
  onOpenGraph: () => void;
}

function Calculator({ onOpenSpec, onOpenConverter, onOpenComplex, onOpenGraph }: CalculatorProps) {
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
    if (!Number.isInteger(n)) return gamma(n + 1);
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const gamma = (z: number): number => {
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    z -= 1;
    const g = 7;
    const c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.6248882092078712e-7
    ];
    let x = c[0];
    for (let i = 1; i < g + 2; i++) {
      x += c[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  };

  const calculateResult = useCallback((expr: string): number => {
    let processed = expr;

    processed = processed.replace(/π/g, String(Math.PI));
    processed = processed.replace(/e(?![x])/g, String(Math.E));

    processed = processed.replace(/sin⁻¹\(([^)]+)\)/g, (_, val) => {
      const result = Math.asin(parseFloat(val));
      return String(fromRadians(result));
    });
    processed = processed.replace(/cos⁻¹\(([^)]+)\)/g, (_, val) => {
      const result = Math.acos(parseFloat(val));
      return String(fromRadians(result));
    });
    processed = processed.replace(/tan⁻¹\(([^)]+)\)/g, (_, val) => {
      const result = Math.atan(parseFloat(val));
      return String(fromRadians(result));
    });
    processed = processed.replace(/sin\(([^)]+)\)/g, (_, val) => {
      return String(Math.sin(toRadians(parseFloat(val))));
    });
    processed = processed.replace(/cos\(([^)]+)\)/g, (_, val) => {
      return String(Math.cos(toRadians(parseFloat(val))));
    });
    processed = processed.replace(/tan\(([^)]+)\)/g, (_, val) => {
      return String(Math.tan(toRadians(parseFloat(val))));
    });
    processed = processed.replace(/ln\(([^)]+)\)/g, (_, val) => {
      return String(Math.log(parseFloat(val)));
    });
    processed = processed.replace(/log\(([^)]+)\)/g, (_, val) => {
      return String(Math.log10(parseFloat(val)));
    });
    processed = processed.replace(/√\(([^)]+)\)/g, (_, val) => {
      return String(Math.sqrt(parseFloat(val)));
    });
    processed = processed.replace(/³√\(([^)]+)\)/g, (_, val) => {
      return String(Math.cbrt(parseFloat(val)));
    });
    processed = processed.replace(/abs\(([^)]+)\)/g, (_, val) => {
      return String(Math.abs(parseFloat(val)));
    });

    processed = processed.replace(/\^/g, '**');

    processed = processed.replace(/(\d+(?:\.\d+)?)!/g, (_, val) => {
      return String(factorial(parseFloat(val)));
    });

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
    if (display === '0' && num !== '.') {
      setDisplay(num);
    } else if (num === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display + num);
    }
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

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleClearEntry = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleNegate = () => {
    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const handleSquare = () => {
    setDisplay('(' + display + ')^2');
  };

  const handleCube = () => {
    setDisplay('(' + display + ')^3');
  };

  const handlePower = () => {
    setExpression(expression + display + '^');
    setDisplay('0');
  };

  const handleReciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
    } else {
      setDisplay('Ошибка');
    }
  };

  const handleMemoryStore = () => {
    setMemory(parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleExp = () => {
    setExpression(expression + display + '×10^');
    setDisplay('0');
  };

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for calculator keys
      const key = e.key;

      // Digits 0-9
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumber(key);
        flashKey(key);
        return;
      }

      // Decimal point
      if (key === '.' || key === ',') {
        e.preventDefault();
        handleNumber('.');
        flashKey('.');
        return;
      }

      // Operators
      if (key === '+') {
        e.preventDefault();
        handleOperator('+');
        flashKey('+');
        return;
      }
      if (key === '-') {
        e.preventDefault();
        handleOperator('−');
        flashKey('-');
        return;
      }
      if (key === '*' || key === 'x' || key === 'X') {
        // Only treat 'x' as multiply if Shift is not pressed and it's not part of typing
        if (key === '*' || e.shiftKey) {
          e.preventDefault();
          handleOperator('×');
          flashKey('*');
          return;
        }
      }
      if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
        flashKey('/');
        return;
      }

      // Enter or = → equals
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
        flashKey('Enter');
        return;
      }

      // Escape → clear all
      if (key === 'Escape') {
        e.preventDefault();
        handleClear();
        flashKey('Escape');
        return;
      }

      // Backspace → delete last char
      if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        flashKey('Backspace');
        return;
      }

      // Delete → clear entry
      if (key === 'Delete') {
        e.preventDefault();
        handleClearEntry();
        flashKey('Delete');
        return;
      }

      // Percent
      if (key === '%') {
        e.preventDefault();
        handlePercent();
        flashKey('%');
        return;
      }

      // Parentheses
      if (key === '(') {
        e.preventDefault();
        setDisplay(display + '(');
        flashKey('(');
        return;
      }
      if (key === ')') {
        e.preventDefault();
        setDisplay(display + ')');
        flashKey(')');
        return;
      }

      // Power (^)
      if (key === '^') {
        e.preventDefault();
        handlePower();
        flashKey('^');
        return;
      }

      // Factorial (!)
      if (key === '!') {
        e.preventDefault();
        setDisplay(display + '!');
        flashKey('!');
        return;
      }

      // Square root (s key)
      if (key === 's' || key === 'S') {
        e.preventDefault();
        handleFunction('√');
        flashKey('√');
        return;
      }
    };

    const flashKey = (key: string) => {
      setLastKey(key);
      if (keyTimeoutRef.current) {
        clearTimeout(keyTimeoutRef.current);
      }
      keyTimeoutRef.current = setTimeout(() => {
        setLastKey(null);
      }, 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyTimeoutRef.current) {
        clearTimeout(keyTimeoutRef.current);
      }
    };
  }, [display, expression, angleMode, memory, isSecond]);

  const Shortcut = ({ keys, action }: { keys: string; action: string }) => (
    <div className="flex items-center justify-between gap-2">
      <kbd className="px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-300 font-mono text-[10px] border border-gray-600/40 whitespace-nowrap">
        {keys}
      </kbd>
      <span className="text-gray-500 text-[10px]">{action}</span>
    </div>
  );

  const Button = ({
    label,
    onClick,
    className = '',
    span = 1,
    keyId
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    span?: number;
    keyId?: string;
  }) => {
    const isActive = keyId && lastKey === keyId;
    return (
      <button
        onClick={onClick}
        className={`
          ${span === 2 ? 'col-span-2' : ''}
          h-14 rounded-xl font-medium text-sm transition-all duration-150
          active:scale-95 active:brightness-90
          hover:brightness-110
          ${isActive ? 'scale-95 brightness-125 ring-2 ring-indigo-400/50' : ''}
          ${className}
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <h1 className="text-white/80 text-lg font-semibold">Научный Калькулятор</h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenComplex}
                className="w-8 h-8 rounded-lg text-sm font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center"
                title="Комплексные числа"
              >
                ℂ
              </button>
              <button
                onClick={onOpenGraph}
                className="w-8 h-8 rounded-lg text-sm bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30 transition-all flex items-center justify-center"
                title="Графики функций"
              >
                📈
              </button>
              <button
                onClick={onOpenConverter}
                className="w-8 h-8 rounded-lg text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center"
                title="Конвертер единиц"
              >
                🔄
              </button>
              <button
                onClick={onOpenSpec}
                className="w-8 h-8 rounded-lg text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center justify-center"
                title="Открыть спецификацию"
              >
                📄
              </button>
              <button
                onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  angleMode === 'deg'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {angleMode === 'deg' ? 'DEG' : 'RAD'}
              </button>
              <button
                onClick={() => setIsSecond(!isSecond)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSecond
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-600/50 text-gray-400 border border-gray-600/30'
                }`}
              >
                2nd
              </button>
            </div>
          </div>

          {/* Display */}
          <div className="px-6 pb-4">
            <div className="bg-gray-900/70 rounded-2xl p-4 border border-gray-700/30">
              <div className="text-gray-400 text-sm h-6 text-right overflow-hidden font-mono">
                {expression || '\u00A0'}
              </div>
              <div className="text-white text-3xl text-right font-light mt-1 overflow-x-auto scrollbar-hide font-mono">
                {display}
              </div>
              {memory !== 0 && (
                <div className="text-amber-400/70 text-xs text-right mt-1">
                  M = {memory}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="px-4 pb-5">
            {/* Memory row */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              <Button label="MC" onClick={handleMemoryClear} className="bg-gray-700/50 text-gray-300 text-xs" />
              <Button label="MR" onClick={handleMemoryRecall} className="bg-gray-700/50 text-gray-300 text-xs" />
              <Button label="M+" onClick={handleMemoryAdd} className="bg-gray-700/50 text-gray-300 text-xs" />
              <Button label="MS" onClick={handleMemoryStore} className="bg-gray-700/50 text-gray-300 text-xs" />
              <Button label="1/x" onClick={handleReciprocal} className="bg-gray-700/50 text-gray-300 text-xs" />
            </div>

            {/* Scientific functions row 1 */}
            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              <Button
                label={isSecond ? 'sin⁻¹' : 'sin'}
                onClick={() => handleFunction(isSecond ? 'sin⁻¹' : 'sin')}
                className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30"
              />
              <Button
                label={isSecond ? 'cos⁻¹' : 'cos'}
                onClick={() => handleFunction(isSecond ? 'cos⁻¹' : 'cos')}
                className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30"
              />
              <Button
                label={isSecond ? 'tan⁻¹' : 'tan'}
                onClick={() => handleFunction(isSecond ? 'tan⁻¹' : 'tan')}
                className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30"
              />
              <Button label="π" onClick={() => handleNumber(String(Math.PI))} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="e" onClick={() => handleNumber(String(Math.E))} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
            </div>

            {/* Scientific functions row 2 */}
            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              <Button label="x²" onClick={handleSquare} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="x³" onClick={handleCube} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="xⁿ" onClick={handlePower} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button
                label={isSecond ? '³√' : '√'}
                onClick={() => handleFunction(isSecond ? '³√' : '√')}
                className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30"
              />
              <Button label="|x|" onClick={() => handleFunction('abs')} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
            </div>

            {/* Scientific functions row 3 */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              <Button label="ln" onClick={() => handleFunction('ln')} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="log" onClick={() => handleFunction('log')} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="n!" onClick={() => setDisplay(display + '!')} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="EXP" onClick={handleExp} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
              <Button label="%" onClick={handlePercent} className="bg-indigo-900/40 text-indigo-300 text-xs border border-indigo-700/30" />
            </div>

            {/* Main buttons */}
            <div className="grid grid-cols-5 gap-1.5">
              <Button label="CE" onClick={handleClearEntry} keyId="Delete" className="bg-red-900/30 text-red-400 border border-red-800/30" />
              <Button label="C" onClick={handleClear} keyId="Escape" className="bg-red-900/30 text-red-400 border border-red-800/30" />
              <Button label="⌫" onClick={handleBackspace} keyId="Backspace" className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />
              <Button label="(" onClick={() => setDisplay(display + '(')} keyId="(" className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />
              <Button label=")" onClick={() => setDisplay(display + ')')} keyId=")" className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              <Button label="7" onClick={() => handleNumber('7')} keyId="7" className="bg-gray-700/80 text-white" />
              <Button label="8" onClick={() => handleNumber('8')} keyId="8" className="bg-gray-700/80 text-white" />
              <Button label="9" onClick={() => handleNumber('9')} keyId="9" className="bg-gray-700/80 text-white" />
              <Button label="÷" onClick={() => handleOperator('÷')} keyId="/" className="bg-amber-600/80 text-white" />
              <Button label="±" onClick={handleNegate} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              <Button label="4" onClick={() => handleNumber('4')} keyId="4" className="bg-gray-700/80 text-white" />
              <Button label="5" onClick={() => handleNumber('5')} keyId="5" className="bg-gray-700/80 text-white" />
              <Button label="6" onClick={() => handleNumber('6')} keyId="6" className="bg-gray-700/80 text-white" />
              <Button label="×" onClick={() => handleOperator('×')} keyId="*" className="bg-amber-600/80 text-white" />
              <Button label="mod" onClick={() => handleOperator('%')} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              <Button label="1" onClick={() => handleNumber('1')} keyId="1" className="bg-gray-700/80 text-white" />
              <Button label="2" onClick={() => handleNumber('2')} keyId="2" className="bg-gray-700/80 text-white" />
              <Button label="3" onClick={() => handleNumber('3')} keyId="3" className="bg-gray-700/80 text-white" />
              <Button label="−" onClick={() => handleOperator('−')} keyId="-" className="bg-amber-600/80 text-white" />
              <Button label="=" onClick={handleEquals} keyId="Enter" className="bg-blue-600 text-white row-span-2 h-full" />

              <Button label="0" onClick={() => handleNumber('0')} keyId="0" className="bg-gray-700/80 text-white col-span-2" span={2} />
              <Button label="." onClick={() => handleNumber('.')} keyId="." className="bg-gray-700/80 text-white" />
              <Button label="+" onClick={() => handleOperator('+')} keyId="+" className="bg-amber-600/80 text-white" />
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="px-6 pb-4">
              <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/20">
                <div className="text-gray-500 text-xs mb-2 font-medium">История вычислений</div>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {history.map((item, index) => (
                    <div key={index} className="text-gray-400 text-xs font-mono text-right">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 px-2">
          <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/20">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
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

        {/* Version */}
        <div className="mt-4 text-center">
          <span className="text-[10px] text-gray-600 font-mono">v1.0.3</span>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
