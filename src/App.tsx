import { useState, useCallback } from 'react';

type AngleMode = 'deg' | 'rad';

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState(0);
  const [isSecond, setIsSecond] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

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

    // Replace constants
    processed = processed.replace(/π/g, String(Math.PI));
    processed = processed.replace(/e(?![x])/g, String(Math.E));

    // Replace functions
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

    // Replace power operators
    processed = processed.replace(/\^/g, '**');

    // Handle factorial
    processed = processed.replace(/(\d+(?:\.\d+)?)!/g, (_, val) => {
      return String(factorial(parseFloat(val)));
    });

    // Replace × and ÷
    processed = processed.replace(/×/g, '*');
    processed = processed.replace(/÷/g, '/');

    try {
      // Safe evaluation using Function constructor
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

  const Button = ({
    label,
    onClick,
    className = '',
    span = 1
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    span?: number;
  }) => (
    <button
      onClick={onClick}
      className={`
        ${span === 2 ? 'col-span-2' : ''}
        h-14 rounded-xl font-medium text-sm transition-all duration-150
        active:scale-95 active:brightness-90
        hover:brightness-110
        ${className}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Calculator body */}
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <h1 className="text-white/80 text-lg font-semibold">Научный Калькулятор</h1>
            <div className="flex items-center gap-2">
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
              {/* Expression */}
              <div className="text-gray-400 text-sm h-6 text-right overflow-hidden font-mono">
                {expression || '\u00A0'}
              </div>
              {/* Result */}
              <div className="text-white text-3xl text-right font-light mt-1 overflow-x-auto scrollbar-hide font-mono">
                {display}
              </div>
              {/* Memory indicator */}
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
              {/* Row 1 */}
              <Button label="CE" onClick={handleClearEntry} className="bg-red-900/30 text-red-400 border border-red-800/30" />
              <Button label="C" onClick={handleClear} className="bg-red-900/30 text-red-400 border border-red-800/30" />
              <Button label="⌫" onClick={handleBackspace} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />
              <Button label="(" onClick={() => setDisplay(display + '(')} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />
              <Button label=")" onClick={() => setDisplay(display + ')')} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              {/* Row 2 */}
              <Button label="7" onClick={() => handleNumber('7')} className="bg-gray-700/80 text-white" />
              <Button label="8" onClick={() => handleNumber('8')} className="bg-gray-700/80 text-white" />
              <Button label="9" onClick={() => handleNumber('9')} className="bg-gray-700/80 text-white" />
              <Button label="÷" onClick={() => handleOperator('÷')} className="bg-amber-600/80 text-white" />
              <Button label="±" onClick={handleNegate} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              {/* Row 3 */}
              <Button label="4" onClick={() => handleNumber('4')} className="bg-gray-700/80 text-white" />
              <Button label="5" onClick={() => handleNumber('5')} className="bg-gray-700/80 text-white" />
              <Button label="6" onClick={() => handleNumber('6')} className="bg-gray-700/80 text-white" />
              <Button label="×" onClick={() => handleOperator('×')} className="bg-amber-600/80 text-white" />
              <Button label="mod" onClick={() => handleOperator('%')} className="bg-gray-700/60 text-gray-300 border border-gray-600/30" />

              {/* Row 4 */}
              <Button label="1" onClick={() => handleNumber('1')} className="bg-gray-700/80 text-white" />
              <Button label="2" onClick={() => handleNumber('2')} className="bg-gray-700/80 text-white" />
              <Button label="3" onClick={() => handleNumber('3')} className="bg-gray-700/80 text-white" />
              <Button label="−" onClick={() => handleOperator('−')} className="bg-amber-600/80 text-white" />
              <Button label="=" onClick={handleEquals} className="bg-blue-600 text-white row-span-2 h-full" />

              {/* Row 5 */}
              <Button label="0" onClick={() => handleNumber('0')} className="bg-gray-700/80 text-white col-span-2" span={2} />
              <Button label="." onClick={() => handleNumber('.')} className="bg-gray-700/80 text-white" />
              <Button label="+" onClick={() => handleOperator('+')} className="bg-amber-600/80 text-white" />
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
      </div>
    </div>
  );
}

export default App;
