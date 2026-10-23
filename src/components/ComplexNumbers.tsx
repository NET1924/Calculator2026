import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Complex,
  complex,
  complexAdd,
  complexSub,
  complexMul,
  complexDiv,
  complexAbs,
  complexArg,
  complexConjugate,
  complexPow,
  complexSqrt,
  complexExp,
  complexLn,
  complexSin,
  complexCos,
  complexTan,
  complexToString,
  parseComplex,
  evaluateComplexExpr,
} from '../utils/complex';

interface ComplexNumbersProps {
  onBack: () => void;
  onOpenSpec: () => void;
}

type Operation =
  | 'add' | 'sub' | 'mul' | 'div'
  | 'pow' | 'sqrt' | 'exp' | 'ln'
  | 'sin' | 'cos' | 'tan'
  | 'abs' | 'arg' | 'conj'
  | 'custom';

const operations: { id: Operation; label: string; symbol: string; binary: boolean; desc: string }[] = [
  { id: 'add', label: 'Сложение', symbol: '+', binary: true, desc: 'z₁ + z₂' },
  { id: 'sub', label: 'Вычитание', symbol: '−', binary: true, desc: 'z₁ − z₂' },
  { id: 'mul', label: 'Умножение', symbol: '×', binary: true, desc: 'z₁ × z₂' },
  { id: 'div', label: 'Деление', symbol: '÷', binary: true, desc: 'z₁ ÷ z₂' },
  { id: 'pow', label: 'Степень', symbol: '^', binary: true, desc: 'z₁ ^ z₂' },
  { id: 'sqrt', label: 'Корень', symbol: '√', binary: false, desc: '√z' },
  { id: 'exp', label: 'Экспонента', symbol: 'exp', binary: false, desc: 'eᶻ' },
  { id: 'ln', label: 'Логарифм', symbol: 'ln', binary: false, desc: 'ln(z)' },
  { id: 'sin', label: 'Синус', symbol: 'sin', binary: false, desc: 'sin(z)' },
  { id: 'cos', label: 'Косинус', symbol: 'cos', binary: false, desc: 'cos(z)' },
  { id: 'tan', label: 'Тангенс', symbol: 'tan', binary: false, desc: 'tan(z)' },
  { id: 'abs', label: 'Модуль', symbol: '|z|', binary: false, desc: '|z|' },
  { id: 'arg', label: 'Аргумент', symbol: 'arg', binary: false, desc: 'arg(z)' },
  { id: 'conj', label: 'Сопряжённое', symbol: 'z̄', binary: false, desc: 'Re(z) − i·Im(z)' },
];

function ComplexNumbers({ onBack, onOpenSpec }: ComplexNumbersProps) {
  const [z1Input, setZ1Input] = useState('3 + 4i');
  const [z2Input, setZ2Input] = useState('1 - 2i');
  const [operation, setOperation] = useState<Operation>('add');
  const [customExpr, setCustomExpr] = useState('z^2 + 1');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const z1 = useMemo(() => parseComplex(z1Input), [z1Input]);
  const z2 = useMemo(() => parseComplex(z2Input), [z2Input]);

  const result = useMemo((): Complex | null => {
    if (operation === 'custom') {
      if (!z1) return null;
      return evaluateComplexExpr(customExpr, z1);
    }
    
    if (!z1) return null;
    
    const op = operations.find(o => o.id === operation);
    if (!op) return null;
    
    try {
      switch (operation) {
        case 'add': return z2 ? complexAdd(z1, z2) : null;
        case 'sub': return z2 ? complexSub(z1, z2) : null;
        case 'mul': return z2 ? complexMul(z1, z2) : null;
        case 'div': return z2 ? complexDiv(z1, z2) : null;
        case 'pow': return z2 ? complexPow(z1, z2.re) : null;
        case 'sqrt': return complexSqrt(z1);
        case 'exp': return complexExp(z1);
        case 'ln': return complexLn(z1);
        case 'sin': return complexSin(z1);
        case 'cos': return complexCos(z1);
        case 'tan': return complexTan(z1);
        case 'abs': return complex(complexAbs(z1), 0);
        case 'arg': return complex(complexArg(z1), 0);
        case 'conj': return complexConjugate(z1);
        default: return null;
      }
    } catch {
      return null;
    }
  }, [z1, z2, operation, customExpr]);

  // Draw Argand diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    
    // Determine scale
    let maxVal = 5;
    if (z1) maxVal = Math.max(maxVal, Math.abs(z1.re), Math.abs(z1.im));
    if (z2) maxVal = Math.max(maxVal, Math.abs(z2.re), Math.abs(z2.im));
    if (result && isFinite(result.re) && isFinite(result.im)) {
      maxVal = Math.max(maxVal, Math.abs(result.re), Math.abs(result.im));
    }
    const scale = Math.min(w, h) / (maxVal * 2.5);
    
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    const gridStep = scale;
    for (let x = cx % gridStep; x < w; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = cy % gridStep; y < h; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '11px monospace';
    ctx.fillText('Re', w - 25, cy - 5);
    ctx.fillText('Im', cx + 5, 15);
    
    // Tick marks
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.font = '9px monospace';
    for (let i = -Math.floor(maxVal); i <= Math.floor(maxVal); i++) {
      if (i === 0) continue;
      const x = cx + i * scale;
      const y = cy - i * scale;
      ctx.fillText(String(i), x - 5, cy + 12);
      ctx.fillText(String(i) + 'i', cx + 4, y + 3);
    }
    
    // Helper to draw complex point
    const drawPoint = (z: Complex, color: string, label: string) => {
      if (!isFinite(z.re) || !isFinite(z.im)) return;
      const x = cx + z.re * scale;
      const y = cy - z.im * scale;
      
      // Vector from origin
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(label, x + 8, y - 8);
    };
    
    // Draw z1
    if (z1) drawPoint(z1, '#60a5fa', 'z₁');
    
    // Draw z2 (for binary operations)
    const op = operations.find(o => o.id === operation);
    if (z2 && op?.binary) drawPoint(z2, '#f59e0b', 'z₂');
    
    // Draw result
    if (result && isFinite(result.re) && isFinite(result.im)) {
      drawPoint(result, '#34d399', 'result');
    }
  }, [z1, z2, result, operation]);

  const currentOp = operations.find(o => o.id === operation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <h1 className="text-lg font-semibold text-white">Комплексные числа</h1>
            <span className="text-[10px] text-gray-500 font-mono">v1.0.3</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator panel */}
          <div className="space-y-4">
            {/* Inputs */}
            <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Ввод комплексных чисел
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-blue-400 font-medium mb-1 block">z₁ (формат: a + bi)</label>
                  <input
                    type="text"
                    value={z1Input}
                    onChange={(e) => setZ1Input(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/70 border border-blue-700/30 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Например: 3 + 4i"
                  />
                  {z1 && (
                    <div className="text-xs text-blue-400/70 mt-1 font-mono">
                      = {complexToString(z1)} | |z₁| = {complexAbs(z1).toFixed(3)} | arg = {(complexArg(z1) * 180 / Math.PI).toFixed(2)}°
                    </div>
                  )}
                  {z1Input && !z1 && (
                    <div className="text-xs text-red-400 mt-1">Некорректный формат</div>
                  )}
                </div>
                {currentOp?.binary && (
                  <div>
                    <label className="text-xs text-amber-400 font-medium mb-1 block">z₂ (формат: a + bi)</label>
                    <input
                      type="text"
                      value={z2Input}
                      onChange={(e) => setZ2Input(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-amber-700/30 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder="Например: 1 - 2i"
                    />
                    {z2 && (
                      <div className="text-xs text-amber-400/70 mt-1 font-mono">
                        = {complexToString(z2)} | |z₂| = {complexAbs(z2).toFixed(3)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Operations */}
            <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Операция
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {operations.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setOperation(op.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      operation === op.id
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'bg-gray-900/40 text-gray-400 border border-gray-700/30 hover:bg-gray-700/40'
                    }`}
                  >
                    <div className="font-bold">{op.symbol}</div>
                    <div className="text-[10px] opacity-70">{op.label}</div>
                  </button>
                ))}
                <button
                  onClick={() => setOperation('custom')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    operation === 'custom'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'bg-gray-900/40 text-gray-400 border border-gray-700/30 hover:bg-gray-700/40'
                  }`}
                >
                  <div className="font-bold">f(z)</div>
                  <div className="text-[10px] opacity-70">Своя функция</div>
                </button>
              </div>

              {operation === 'custom' && (
                <div className="mt-4">
                  <label className="text-xs text-purple-400 font-medium mb-1 block">
                    Выражение f(z): <span className="text-gray-500">(поддерживаются: sin, cos, tan, exp, ln, sqrt, abs, arg, conj, pow)</span>
                  </label>
                  <input
                    type="text"
                    value={customExpr}
                    onChange={(e) => setCustomExpr(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/70 border border-purple-700/30 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Например: z^2 + 1"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Примеры: <code className="text-purple-400">z^2 + 1</code>, <code className="text-purple-400">exp(z*i)</code>, <code className="text-purple-400">sin(z) + cos(z)</code>
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 rounded-2xl p-5 border border-emerald-700/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Результат
              </h3>
              <div className="text-xs text-gray-400 mb-2 font-mono">
                {currentOp ? currentOp.desc : ''}
              </div>
              {result ? (
                <div>
                  <div className="text-2xl font-bold text-emerald-300 font-mono">
                    {complexToString(result)}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 space-y-1 font-mono">
                    <div>Re = {result.re.toFixed(6)}</div>
                    <div>Im = {result.im.toFixed(6)}</div>
                    <div>|z| = {complexAbs(result).toFixed(6)}</div>
                    <div>arg = {(complexArg(result) * 180 / Math.PI).toFixed(4)}° = {complexArg(result).toFixed(4)} рад</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-sm">
                  {z1 || z2 ? 'Ошибка вычисления' : 'Введите корректные числа'}
                </div>
              )}
            </div>
          </div>

          {/* Visualization panel */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Диаграмма Аргана
              </h3>
              <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-gray-700/30">
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ height: '400px' }}
                />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-gray-400">z₁</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-gray-400">z₂</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-gray-400">Результат</span>
                </div>
              </div>
            </div>

            {/* Reference */}
            <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/20">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Справка по комплексным числам
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div><span className="text-blue-400 font-mono">z = a + bi</span> — алгебраическая форма</div>
                <div><span className="text-blue-400 font-mono">|z| = √(a² + b²)</span> — модуль</div>
                <div><span className="text-blue-400 font-mono">arg(z) = atan2(b, a)</span> — аргумент (фаза)</div>
                <div><span className="text-blue-400 font-mono">z̄ = a − bi</span> — комплексно-сопряжённое</div>
                <div><span className="text-blue-400 font-mono">e^(iθ) = cos θ + i sin θ</span> — формула Эйлера</div>
                <div className="pt-2 border-t border-gray-700/30">
                  <div className="text-gray-500 mb-1">Форматы ввода:</div>
                  <div className="font-mono text-gray-400 space-y-0.5">
                    <div>• <span className="text-emerald-400">3 + 4i</span> — алгебраическая</div>
                    <div>• <span className="text-emerald-400">-2.5i</span> — мнимое</div>
                    <div>• <span className="text-emerald-400">7</span> — действительное</div>
                    <div>• <span className="text-emerald-400">1 - i</span> — с единичным коэффициентом</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ComplexNumbers;
