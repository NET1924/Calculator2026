import { useState, useRef, useEffect, useMemo } from 'react';

interface FunctionGraphProps {
  onBack: () => void;
  onOpenSpec: () => void;
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
    
    // Replace functions
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

function FunctionGraph({ onBack, onOpenSpec }: FunctionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FunctionDef[]>([
    { id: 1, expr: 'sin(x)', color: COLORS[0], visible: true },
    { id: 2, expr: 'cos(x)', color: COLORS[1], visible: true },
  ]);
  const [nextId, setNextId] = useState(3);
  const [viewX, setViewX] = useState(0);
  const [viewY, setViewY] = useState(0);
  const [scale, setScale] = useState(50); // pixels per unit
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const addFunction = () => {
    setFunctions(prev => [...prev, {
      id: nextId,
      expr: '',
      color: COLORS[prev.length % COLORS.length],
      visible: true,
    }]);
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

  // Canvas drawing
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
    
    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    
    // Determine grid step
    let gridStep = 1;
    if (scale < 20) gridStep = 5;
    if (scale < 10) gridStep = 10;
    if (scale > 100) gridStep = 0.5;
    if (scale > 200) gridStep = 0.25;
    
    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    
    const xMin = -cx / scale;
    const xMax = (w - cx) / scale;
    const yMin = -(h - cy) / scale;
    const yMax = cy / scale;
    
    for (let x = Math.floor(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
      const px = cx + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    for (let y = Math.floor(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
      const py = cy - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
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
    
    // Tick marks and labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    
    for (let x = Math.floor(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
      if (Math.abs(x) < 0.001) continue;
      const px = cx + x * scale;
      ctx.beginPath();
      ctx.moveTo(px, cy - 3);
      ctx.lineTo(px, cy + 3);
      ctx.stroke();
      const label = Math.abs(x) < 0.01 ? x.toExponential(0) : 
                    Number.isInteger(x) ? String(x) : x.toFixed(2);
      ctx.fillText(label, px, cy + 14);
    }
    
    ctx.textAlign = 'right';
    for (let y = Math.floor(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
      if (Math.abs(y) < 0.001) continue;
      const py = cy - y * scale;
      ctx.beginPath();
      ctx.moveTo(cx - 3, py);
      ctx.lineTo(cx + 3, py);
      ctx.stroke();
      const label = Math.abs(y) < 0.01 ? y.toExponential(0) :
                    Number.isInteger(y) ? String(y) : y.toFixed(2);
      ctx.fillText(label, cx - 6, py + 3);
    }
    
    // Origin label
    ctx.textAlign = 'left';
    ctx.fillText('0', cx + 4, cy + 12);
    
    // Axis labels
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('x', w - 15, cy - 5);
    ctx.fillText('y', cx + 5, 15);
    
    // Draw functions
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
        
        if (y === null) {
          started = false;
          continue;
        }
        
        const py = cy - y * scale;
        
        // Detect discontinuities (like tan)
        if (prevY !== null && Math.abs(y - prevY) > 100 / scale * 10) {
          started = false;
        }
        
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
        
        prevY = y;
      }
      
      ctx.stroke();
    });
    
    // Mouse crosshair
    if (mousePos) {
      const mx = mousePos.x;
      const my = mousePos.y;
      const mathX = (mx - cx) / scale;
      const mathY = (cy - my) / scale;
      
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, my);
      ctx.lineTo(w, my);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Coordinate label
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(mx + 10, my - 25, 120, 20);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.strokeRect(mx + 10, my - 25, 120, 20);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`, mx + 15, my - 11);
      
      // Show function values at this x
      let yOffset = 0;
      functions.forEach(fn => {
        if (!fn.visible || !fn.expr) return;
        const y = evalFunction(fn.expr, mathX);
        if (y !== null) {
          const py = cy - y * scale;
          // Point on function
          ctx.fillStyle = fn.color;
          ctx.beginPath();
          ctx.arc(mx, py, 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Value label
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(mx + 10, my + 5 + yOffset, 140, 18);
          ctx.strokeStyle = fn.color;
          ctx.strokeRect(mx + 10, my + 5 + yOffset, 140, 18);
          ctx.fillStyle = fn.color;
          ctx.font = '10px monospace';
          ctx.fillText(`f(${mathX.toFixed(2)}) = ${y.toFixed(4)}`, mx + 15, my + 17 + yOffset);
          yOffset += 22;
        }
      });
    }
  }, [functions, viewX, viewY, scale, mousePos]);

  // Mouse handlers
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
      const newX = (e.clientX - dragStart.x) / scale;
      const newY = -(e.clientY - dragStart.y) / scale;
      setViewX(newX);
      setViewY(newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setMousePos(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(5, Math.min(500, prev * factor)));
  };

  const resetView = () => {
    setViewX(0);
    setViewY(0);
    setScale(50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <h1 className="text-lg font-semibold text-white">Графики функций</h1>
            <span className="text-[10px] text-gray-500 font-mono">v1.0.3</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Functions list */}
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Функции
                </h3>
                <button
                  onClick={addFunction}
                  className="px-2 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all text-xs"
                >
                  + Добавить
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {functions.map((fn, idx) => (
                  <div key={fn.id} className="bg-gray-900/40 rounded-lg p-2 border border-gray-700/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: fn.color }}
                      ></div>
                      <span className="text-xs text-gray-400">f{idx + 1}(x) =</span>
                      <div className="flex-1"></div>
                      <button
                        onClick={() => toggleFunction(fn.id)}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          fn.visible ? 'text-emerald-400' : 'text-gray-600'
                        }`}
                      >
                        {fn.visible ? '👁' : '👁‍🗨'}
                      </button>
                      <button
                        onClick={() => removeFunction(fn.id)}
                        className="text-xs px-1.5 py-0.5 rounded text-red-400 hover:bg-red-900/20"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={fn.expr}
                      onChange={(e) => updateFunction(fn.id, e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-900/70 border border-gray-700/30 rounded text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                      placeholder="например: sin(x)"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {presetFunctions.slice(0, 5).map(p => (
                        <button
                          key={p.expr}
                          onClick={() => loadPreset(fn.id, p.expr)}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800/60 text-gray-500 hover:text-gray-300 hover:bg-gray-700/60 transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Управление
              </h3>
              <div className="space-y-2">
                <button
                  onClick={resetView}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700/40 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60 transition-all text-xs"
                >
                  🎯 Сбросить вид
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScale(s => Math.min(500, s * 1.3))}
                    className="px-3 py-2 rounded-lg bg-gray-700/40 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60 transition-all text-xs"
                  >
                    🔍+ Приблизить
                  </button>
                  <button
                    onClick={() => setScale(s => Math.max(5, s / 1.3))}
                    className="px-3 py-2 rounded-lg bg-gray-700/40 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60 transition-all text-xs"
                  >
                    🔍− Отдалить
                  </button>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-gray-500 space-y-1">
                <div>🖱️ Перетаскивание — перемещение</div>
                <div>🖲️ Колесо мыши — масштаб</div>
                <div>👆 Наведение — координаты</div>
              </div>
            </div>

            {/* Syntax help */}
            <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/20">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Синтаксис
              </h3>
              <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                <div><span className="text-indigo-400">x</span> — переменная</div>
                <div><span className="text-indigo-400">+ − * / ^</span> — операторы</div>
                <div><span className="text-indigo-400">sin cos tan</span> — тригонометрия</div>
                <div><span className="text-indigo-400">sqrt abs</span> — корень, модуль</div>
                <div><span className="text-indigo-400">ln log exp</span> — логарифмы</div>
                <div><span className="text-indigo-400">pi e</span> — константы</div>
                <div><span className="text-indigo-400">( )</span> — скобки</div>
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30 sticky top-20">
              <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-gray-700/30">
                <canvas
                  ref={canvasRef}
                  className="w-full cursor-crosshair"
                  style={{ height: '600px' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onWheel={handleWheel}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div>
                  Масштаб: <span className="text-gray-300 font-mono">{scale.toFixed(0)}px/ед</span>
                </div>
                <div>
                  Центр: <span className="text-gray-300 font-mono">({viewX.toFixed(2)}, {viewY.toFixed(2)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FunctionGraph;
