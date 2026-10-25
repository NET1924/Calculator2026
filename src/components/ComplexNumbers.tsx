import { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Complex, complex, complexAdd, complexSub, complexMul, complexDiv, complexAbs, complexArg, complexConjugate, complexPow, complexSqrt, complexExp, complexLn, complexSin, complexCos, complexTan, complexToString, parseComplex } from '../utils/complex';

interface ComplexNumbersProps {
  onBack: () => void;
}

const operations = [
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

export default function ComplexNumbers({ onBack }: ComplexNumbersProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [z1Input, setZ1Input] = useState('3 + 4i');
  const [z2Input, setZ2Input] = useState('1 - 2i');
  const [operation, setOperation] = useState('add');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const z1 = useMemo(() => parseComplex(z1Input), [z1Input]);
  const z2 = useMemo(() => parseComplex(z2Input), [z2Input]);

  const result = useMemo((): Complex | null => {
    if (!z1) return null;
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
    } catch { return null; }
  }, [z1, z2, operation]);

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

    let maxVal = 5;
    if (z1) maxVal = Math.max(maxVal, Math.abs(z1.re), Math.abs(z1.im));
    if (z2) maxVal = Math.max(maxVal, Math.abs(z2.re), Math.abs(z2.im));
    if (result && isFinite(result.re) && isFinite(result.im)) {
      maxVal = Math.max(maxVal, Math.abs(result.re), Math.abs(result.im));
    }
    const scale = Math.min(w, h) / (maxVal * 2.5);

    ctx.fillStyle = isDark ? '#0f172a' : '#f1f5f9';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 1;
    for (let x = cx % scale; x < w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = cy % scale; y < h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.7)';
    ctx.font = '11px monospace';
    ctx.fillText('Re', w - 25, cy - 5);
    ctx.fillText('Im', cx + 5, 15);

    const drawPoint = (z: Complex, color: string, label: string) => {
      if (!isFinite(z.re) || !isFinite(z.im)) return;
      const x = cx + z.re * scale;
      const y = cy - z.im * scale;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.fillText(label, x + 8, y - 8);
    };

    if (z1) drawPoint(z1, '#60a5fa', 'z₁');
    const op = operations.find(o => o.id === operation);
    if (z2 && op?.binary) drawPoint(z2, '#f59e0b', 'z₂');
    if (result && isFinite(result.re) && isFinite(result.im)) drawPoint(result, '#34d399', 'result');
  }, [z1, z2, result, operation, isDark]);

  const currentOp = operations.find(o => o.id === operation);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200' : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 text-gray-800'
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/60'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
          }`}>← Калькулятор</button>
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Комплексные числа</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
              isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
            }`}>{isDark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={`rounded-2xl p-5 border transition-colors duration-300 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ввод комплексных чисел</h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>z₁ (формат: a + bi)</label>
                  <input type="text" value={z1Input} onChange={e => setZ1Input(e.target.value)} className={`w-full px-4 py-3 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isDark ? 'bg-gray-900/70 border border-blue-700/30 text-white' : 'bg-white border border-blue-300 text-gray-900'
                  }`} placeholder="Например: 3 + 4i" />
                  {z1 && <div className={`text-xs mt-1 font-mono ${isDark ? 'text-blue-400/70' : 'text-blue-600/70'}`}>= {complexToString(z1)} | |z₁| = {complexAbs(z1).toFixed(3)}</div>}
                </div>
                {currentOp?.binary && (
                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>z₂ (формат: a + bi)</label>
                    <input type="text" value={z2Input} onChange={e => setZ2Input(e.target.value)} className={`w-full px-4 py-3 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                      isDark ? 'bg-gray-900/70 border border-amber-700/30 text-white' : 'bg-white border border-amber-300 text-gray-900'
                    }`} placeholder="Например: 1 - 2i" />
                    {z2 && <div className={`text-xs mt-1 font-mono ${isDark ? 'text-amber-400/70' : 'text-amber-600/70'}`}>= {complexToString(z2)} | |z₂| = {complexAbs(z2).toFixed(3)}</div>}
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-5 border transition-colors duration-300 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Операция</h3>
              <div className="grid grid-cols-3 gap-2">
                {operations.map(op => (
                  <button key={op.id} onClick={() => setOperation(op.id)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    operation === op.id
                      ? isDark ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-purple-100 text-purple-700 border border-purple-300'
                      : isDark ? 'bg-gray-900/40 text-gray-400 border border-gray-700/30 hover:bg-gray-700/40' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}>
                    <div className="font-bold">{op.symbol}</div>
                    <div className="text-[10px] opacity-70">{op.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-5 border transition-colors duration-300 ${
              isDark ? 'bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border-emerald-700/30' : 'bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Результат</h3>
              <div className={`text-xs mb-2 font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentOp?.desc}</div>
              {result ? (
                <div>
                  <div className={`text-2xl font-bold font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{complexToString(result)}</div>
                  <div className={`text-xs mt-2 space-y-1 font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div>Re = {result.re.toFixed(6)}</div>
                    <div>Im = {result.im.toFixed(6)}</div>
                    <div>|z| = {complexAbs(result).toFixed(6)}</div>
                    <div>arg = {(complexArg(result) * 180 / Math.PI).toFixed(4)}°</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-400 text-sm">Введите корректные числа</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-2xl p-5 border transition-colors duration-300 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Диаграмма Аргана</h3>
              <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'bg-slate-900 border-gray-700/30' : 'bg-slate-50 border-gray-200'}`}>
                <canvas ref={canvasRef} className="w-full" style={{ height: '400px' }} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>z₁</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>z₂</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Результат</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
