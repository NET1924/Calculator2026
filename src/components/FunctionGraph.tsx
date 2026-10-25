import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FunctionGraphProps {
  onBack: () => void;
}

interface FunctionDef {
  id: number;
  expr: string;
  color: string;
  visible: boolean;
}

const COLORS = ['#60a5fa', '#f59e0b', '#34d399', '#f472b6', '#a78bfa', '#fb923c'];

const presetFunctions = [
  { label: 'sin(x)', expr: 'sin(x)' },
  { label: 'cos(x)', expr: 'cos(x)' },
  { label: 'tan(x)', expr: 'tan(x)' },
  { label: 'x²', expr: 'x^2' },
  { label: 'x³', expr: 'x^3' },
  { label: '√x', expr: 'sqrt(x)' },
  { label: '1/x', expr: '1/x' },
  { label: 'eˣ', expr: 'exp(x)' },
  { label: 'ln(x)', expr: 'ln(x)' },
  { label: '|x|', expr: 'abs(x)' },
];

const evalFunction = (expr: string, x: number): number | null => {
  try {
    let processed = expr
      .replace(/\s+/g, '')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/\bx\b/g, `(${x})`)
      .replace(/π/g, String(Math.PI))
      .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, String(Math.E));
    
    processed = processed
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/asin\(/g, 'Math.asin(')
      .replace(/acos\(/g, 'Math.acos(')
      .replace(/atan\(/g, 'Math.atan(');
    
    const result = new Function(`return ${processed}`)();
    return typeof result === 'number' && isFinite(result) ? result : null;
  } catch {
    return null;
  }
};

export default function FunctionGraph({ onBack }: FunctionGraphProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FunctionDef[]>([
    { id: 1, expr: 'sin(x)', color: COLORS[0], visible: true },
    { id: 2, expr: 'cos(x)', color: COLORS[1], visible: true },
  ]);
  const [nextId, setNextId] = useState(3);
  const [viewX, setViewX] = useState(0);
  const [viewY, setViewY] = useState(0);
  const [scale, setScale] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const addFunction = () => {
    setFunctions(prev => [...prev, { id: nextId, expr: '', color: COLORS[prev.length % COLORS.length], visible: true }]);
    setNextId(prev => prev + 1);
  };

  const updateFunction = (id: number, expr: string) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, expr } : f));
  };

  const toggleFunction = (id: number) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  };

  const removeFunction = (id: number) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const loadPreset = (id: number, expr: string) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, expr } : f));
  };

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
    const cx = w / 2 + viewX * scale;
    const cy = h / 2 - viewY * scale;

    ctx.fillStyle = isDark ? '#0f172a' : '#f1f5f9';
    ctx.fillRect(0, 0, w, h);

    let gridStep = 1;
    if (scale < 20) gridStep = 5;
    if (scale < 10) gridStep = 10;
    if (scale > 100) gridStep = 0.5;

    ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.12)';
    ctx.lineWidth = 1;
    const xMin = -cx / scale;
    const xMax = (w - cx) / scale;
    const yMin = -(h - cy) / scale;
    const yMax = cy / scale;

    for (let x = Math.floor(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
      const px = cx + x * scale;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let y = Math.floor(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
      const py = cy - y * scale;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }

    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let x = Math.floor(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
      if (Math.abs(x) < 0.001) continue;
      const px = cx + x * scale;
      ctx.fillText(Number.isInteger(x) ? String(x) : x.toFixed(1), px, cy + 14);
    }
    ctx.textAlign = 'right';
    for (let y = Math.floor(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
      if (Math.abs(y) < 0.001) continue;
      const py = cy - y * scale;
      ctx.fillText(Number.isInteger(y) ? String(y) : y.toFixed(1), cx - 6, py + 3);
    }

    functions.forEach(fn => {
      if (!fn.visible || !fn.expr) return;
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      let prevY: number | null = null;
      for (let px = 0; px < w; px += 1) {
        const x = (px - cx) / scale;
        const y = evalFunction(fn.expr, x);
        if (y === null) { started = false; continue; }
        const py = cy - y * scale;
        if (prevY !== null && Math.abs(y - prevY) > 100 / scale * 10) started = false;
        if (!started) { ctx.moveTo(px, py); started = true; } else { ctx.lineTo(px, py); }
        prevY = y;
      }
      ctx.stroke();
    });

    if (mousePos) {
      const mx = mousePos.x;
      const my = mousePos.y;
      const mathX = (mx - cx) / scale;
      const mathY = (cy - my) / scale;
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(w, my); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(241, 245, 249, 0.9)';
      ctx.fillRect(mx + 10, my - 25, 120, 20);
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.5)';
      ctx.strokeRect(mx + 10, my - 25, 120, 20);
      ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`, mx + 15, my - 11);
    }
  }, [functions, viewX, viewY, scale, mousePos, isDark]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewX * scale, y: e.clientY + viewY * scale });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (isDragging) {
      setViewX((e.clientX - dragStart.x) / scale);
      setViewY(-(e.clientY - dragStart.y) / scale);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => { setIsDragging(false); setMousePos(null); };
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.max(5, Math.min(500, prev * (e.deltaY > 0 ? 0.9 : 1.1))));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200' : 'bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 text-gray-800'
    }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/60'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
          }`}>← Калькулятор</button>
          <div className="flex items-center gap-3">
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Графики функций</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg text-sm transition-all flex items-center justify-center ${
              isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
            }`}>{isDark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Функции</h3>
                <button onClick={addFunction} className={`px-2 py-1 rounded-lg text-xs transition-all ${
                  isDark ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200'
                }`}>+ Добавить</button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {functions.map((fn, idx) => (
                  <div key={fn.id} className={`rounded-lg p-2 border ${isDark ? 'bg-gray-900/40 border-gray-700/20' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: fn.color }}></div>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>f{idx + 1}(x) =</span>
                      <div className="flex-1"></div>
                      <button onClick={() => toggleFunction(fn.id)} className={`text-xs px-1.5 py-0.5 rounded ${fn.visible ? 'text-emerald-400' : 'text-gray-600'}`}>{fn.visible ? '👁' : '👁‍🗨'}</button>
                      <button onClick={() => removeFunction(fn.id)} className="text-xs px-1.5 py-0.5 rounded text-red-400 hover:bg-red-900/20">✕</button>
                    </div>
                    <input type="text" value={fn.expr} onChange={e => updateFunction(fn.id, e.target.value)} className={`w-full px-2 py-1.5 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                      isDark ? 'bg-gray-900/70 border border-gray-700/30 text-white' : 'bg-white border border-gray-300 text-gray-900'
                    }`} placeholder="например: sin(x)" />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {presetFunctions.slice(0, 5).map(p => (
                        <button key={p.expr} onClick={() => loadPreset(fn.id, p.expr)} className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                          isDark ? 'bg-gray-800/60 text-gray-500 hover:text-gray-300 hover:bg-gray-700/60' : 'bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300'
                        }`}>{p.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Управление</h3>
              <div className="space-y-2">
                <button onClick={() => { setViewX(0); setViewY(0); setScale(50); }} className={`w-full px-3 py-2 rounded-lg text-xs transition-all ${
                  isDark ? 'bg-gray-700/40 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}>🎯 Сбросить вид</button>
              </div>
              <div className={`mt-3 text-[10px] space-y-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <div>🖱️ Перетаскивание — перемещение</div>
                <div>🖲️ Колесо мыши — масштаб</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={`rounded-2xl p-4 border transition-colors duration-300 sticky top-20 ${
              isDark ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white/80 border-gray-200/60 shadow-md'
            }`}>
              <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'bg-slate-900 border-gray-700/30' : 'bg-slate-50 border-gray-200'}`}>
                <canvas ref={canvasRef} className="w-full cursor-crosshair" style={{ height: '600px' }}
                  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onWheel={handleWheel} />
              </div>
              <div className={`mt-3 flex items-center justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <div>Масштаб: <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{scale.toFixed(0)}px/ед</span></div>
                <div>Центр: <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>({viewX.toFixed(2)}, {viewY.toFixed(2)})</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
