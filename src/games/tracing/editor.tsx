import { Button } from "@/components/ui/button";
import * as opentype from "opentype.js";
import React, { useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 500;
const FONT_URL =
  "/assets/fonts/Regular - T2/Regular - T2 SR/Irineu Brasil Seta T2 SR.otf";

interface Point {
  x: number;
  y: number;
}

export function GabaritoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [letter, setLetter] = useState("A");
  const [isUppercase, setIsUppercase] = useState(true);
  const [autoSmooth, setAutoSmooth] = useState(true);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [jsonOutput, setJsonOutput] = useState("");
  const [mode, setMode] = useState<"draw" | "adjust">("draw");
  const [draggingPoint, setDraggingPoint] = useState<{ s: number; p: number } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.letter) {
          setLetter(data.letter);
          setIsUppercase(data.letter === data.letter.toUpperCase());
        }
        const denormalized = data.strokes.map((str: any) =>
          str.map((pt: any) => ({
            x: pt.x * CANVAS_SIZE,
            y: pt.y * CANVAS_SIZE,
          }))
        );
        setStrokes(denormalized);
      } catch {
        alert("Erro ao ler gabarito. Arquivo JSON inválido.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be triggered again
  };

  useEffect(() => {
    opentype.load(FONT_URL, (err, loadedFont) => {
      if (!err && loadedFont) setFont(loadedFont);
    });
  }, []);

  const drawCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 1. Desenha a letra de referência (fundo)
    if (font) {
      const baseSize = CANVAS_SIZE;
      const path = font.getPath(letter, 0, 0, baseSize);
      const box = path.getBoundingBox();
      const padding = 120;

      const w = box.x2 - box.x1;
      const h = box.y2 - box.y1;
      if (w > 0 && h > 0) {
        const scale = Math.min(
          (CANVAS_SIZE - padding) / w,
          (CANVAS_SIZE - padding) / h,
        );
        const finalFontSize = baseSize * scale;
        const scaledPath = font.getPath(letter, 0, 0, finalFontSize);
        const sBox = scaledPath.getBoundingBox();
        const offsetX = (CANVAS_SIZE - (sBox.x2 - sBox.x1)) / 2 - sBox.x1;
        const offsetY = (CANVAS_SIZE - (sBox.y2 - sBox.y1)) / 2 - sBox.y1;

        const centeredPath = font.getPath(
          letter,
          offsetX,
          offsetY,
          finalFontSize,
        );

        // Letra apagada no fundo
        ctx.fillStyle = "#cbd5e1"; // slate-300
        centeredPath.draw(ctx);
      }
    }

    // 2. Desenha os traços confirmados (Bolinhas e Linhas Guia)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokes.forEach((stroke, idx) => {
      const color = `hsl(${(idx * 137) % 360}, 70%, 50%)`;
      ctx.strokeStyle = color;
      
      // Linha guia fina
      ctx.lineWidth = 4;
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Bolinhas exatas do gabarito
      ctx.lineWidth = 2;
      stroke.forEach((p, i) => {
        ctx.beginPath();
        const isHovered = mode === 'adjust' && draggingPoint?.s === idx && draggingPoint?.p === i;
        ctx.arc(p.x, p.y, isHovered ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? "#fbbf24" : "white";
        ctx.fill();
        ctx.stroke();
        
        // Marcador de ínicio
        if (i === 0) {
          ctx.fillStyle = "#1e293b"; // slate-800
          ctx.beginPath();
          ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText((idx + 1).toString(), p.x, p.y);
        }
      });
    });

    // 3. Desenha o traço atual
    if (currentStroke.length > 0) {
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      currentStroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [font, letter, strokes, currentStroke, mode, draggingPoint]);

  const resampleStroke = (stroke: Point[], targetDist: number): Point[] => {
    if (stroke.length < 2) return stroke;
    const resampled = [stroke[0]];
    let prev = stroke[0];
    let currentLength = 0;

    for (let i = 1; i < stroke.length; i++) {
      const curr = stroke[i];
      let d = Math.hypot(curr.x - prev.x, curr.y - prev.y);

      while (currentLength + d >= targetDist) {
        const remaining = targetDist - currentLength;
        const ratio = remaining / d;
        const newX = prev.x + (curr.x - prev.x) * ratio;
        const newY = prev.y + (curr.y - prev.y) * ratio;
        const newPt = { x: newX, y: newY };
        resampled.push(newPt);

        prev = newPt;
        currentLength = 0;
        d = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      }
      currentLength += d;
      prev = curr;
    }

    const lastOrig = stroke[stroke.length - 1];
    const lastResampled = resampled[resampled.length - 1];
    if (Math.hypot(lastOrig.x - lastResampled.x, lastOrig.y - lastResampled.y) > targetDist * 0.2) {
      resampled.push(lastOrig);
    }
    return resampled;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_SIZE / rect.height);

    if (mode === "adjust") {
      let minDist = 20;
      let found = null;
      strokes.forEach((stroke, sIdx) => {
        stroke.forEach((p, pIdx) => {
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < minDist) {
            minDist = d;
            found = { s: sIdx, p: pIdx };
          }
        });
      });
      if (found) setDraggingPoint(found);
      return;
    }

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_SIZE / rect.height);

    if (mode === "adjust" && draggingPoint) {
      const newStrokes = [...strokes];
      newStrokes[draggingPoint.s] = [...newStrokes[draggingPoint.s]];
      newStrokes[draggingPoint.s][draggingPoint.p] = { x, y };
      setStrokes(newStrokes);
      return;
    }

    if (!isDrawing) return;
    setCurrentStroke((prev) => {
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(last.x - x, last.y - y) > 5) {
        return [...prev, { x, y }];
      }
      return prev;
    });
  };

  // Função para suavizar o traçado (Laplacian Smoothing)
  const smoothPoints = (points: Point[], iterations: number = 8): Point[] => {
    if (points.length < 3) return points;
    let result = [...points];
    for (let iter = 0; iter < iterations; iter++) {
      const next = [result[0]];
      for (let i = 1; i < result.length - 1; i++) {
        next.push({
          x: result[i].x * 0.5 + (result[i-1].x + result[i+1].x) * 0.25,
          y: result[i].y * 0.5 + (result[i-1].y + result[i+1].y) * 0.25
        });
      }
      next.push(result[result.length - 1]);
      result = next;
    }
    return result;
  };

  const handlePointerUp = () => {
    if (mode === "adjust") {
      setDraggingPoint(null);
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 3) {
      const smoothed = autoSmooth ? smoothPoints(currentStroke, 8) : currentStroke;
      const resampled = resampleStroke(smoothed, CANVAS_SIZE * 0.08); // Converte para bolinhas uniformes!
      setStrokes([...strokes, resampled]);
    }
    setCurrentStroke([]);
  };

  const undo = () => {
    setStrokes((s) => s.slice(0, -1));
  };

  const clear = () => {
    setStrokes([]);
  };

  const applyManualSmoothing = () => {
    const newStrokes = strokes.map((stroke) => {
      const smoothed = smoothPoints(stroke, 8);
      return resampleStroke(smoothed, CANVAS_SIZE * 0.08); // Resample spacing back to 40px
    });
    setStrokes(newStrokes);
  };

  const exportJSON = () => {
    // Como os strokes já estão subamostrados como bolinhas, só precisamos normalizar
    const normalized = strokes.map((stroke) =>
      stroke.map((p) => ({
        x: Number((p.x / CANVAS_SIZE).toFixed(3)),
        y: Number((p.y / CANVAS_SIZE).toFixed(3)),
      })),
    );

    const finalData = {
      letter: letter,
      strokes: normalized,
    };

    setJsonOutput(JSON.stringify(finalData, null, 2));
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-black mb-6 text-slate-800 tracking-tight">
        Gabarito Editor
      </h1>

      <div className="flex bg-white p-3 rounded-2xl shadow-sm border border-slate-100 gap-3 mb-6 items-center">
        <label className="font-bold text-slate-600 ml-2">Texto:</label>
        <input
          maxLength={20}
          value={letter}
          autoFocus
          onChange={(e) => {
            const val = e.target.value;
            setLetter(isUppercase ? val.toUpperCase() : val.toLowerCase());
            setStrokes([]);
            setJsonOutput("");
          }}
          className="w-32 px-4 h-12 pb-1 text-center text-3xl font-black text-sky-600 rounded-xl bg-slate-100 focus:ring-4 focus:ring-sky-100 outline-none"
        />
        <div className="w-px h-8 bg-slate-200 mx-2"></div>
        <label className="flex items-center justify-center h-10 px-4 rounded-xl font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 cursor-pointer text-sm whitespace-nowrap">
          Carregar .JSON
          <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
        </label>
        <div className="w-px h-8 bg-slate-200 mx-2"></div>
        <Button
          onClick={() => setMode('draw')}
          variant={mode === 'draw' ? 'default' : 'outline'}
          className="rounded-xl font-bold"
        >
          Desenhar
        </Button>
        <Button
          onClick={() => setMode('adjust')}
          variant={mode === 'adjust' ? 'default' : 'outline'}
          className="rounded-xl font-bold"
        >
          Editar Pontos
        </Button>
        {mode === 'adjust' && strokes.length > 0 && (
          <Button
            onClick={applyManualSmoothing}
            variant="outline"
            className="rounded-xl font-bold border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 ml-2 shadow-sm"
          >
            Suavizar Pontos
          </Button>
        )}
        <div className="w-px h-8 bg-slate-200 mx-2"></div>
        <Button
          onClick={undo}
          variant="outline"
          className="rounded-xl font-bold"
        >
          Desfazer
        </Button>
        <Button
          onClick={clear}
          variant="outline"
          className="rounded-xl font-bold"
        >
          Limpar
        </Button>
        <Button
          onClick={exportJSON}
          className="rounded-xl font-bold bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-200"
        >
          Exportar Gabarito
        </Button>
      </div>
      
      <div className="flex bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-6 mb-6 items-center">
        <label className="flex flex-col items-center gap-2 font-bold text-slate-600 cursor-pointer">
          <span className="text-sm">Maiúsculo / Minúsculo</span>
          <div className="relative inline-flex items-center cursor-pointer flex-col">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isUppercase} 
              onChange={e => {
                const checked = e.target.checked;
                setIsUppercase(checked);
                setLetter(l => checked ? l.toUpperCase() : l.toLowerCase());
                setStrokes([]);
              }}
            />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-500"></div>
          </div>
        </label>
        
        <div className="w-px h-10 bg-slate-200 mx-2"></div>

        <label className="flex flex-col items-center gap-2 font-bold text-slate-600 cursor-pointer">
          <span className="text-sm">Suavizar Tremedeira do Mouse</span>
          <div className="relative inline-flex items-center cursor-pointer flex-col">
            <input type="checkbox" className="sr-only peer" checked={autoSmooth} onChange={e => setAutoSmooth(e.target.checked)} />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-500"></div>
          </div>
        </label>
      </div>

      <div className="bg-white border-8 border-white shadow-xl ring-1 ring-slate-200 rounded-[40px] overflow-hidden mb-8">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="touch-none cursor-crosshair bg-transparent"
        />
      </div>

      {jsonOutput && (
        <div className="w-full max-w-2xl bg-[#0f172a] rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sky-400 font-mono text-sm font-bold">
              JSON Gerado para "{letter}"
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(jsonOutput)}
              className="rounded-lg font-bold"
            >
              Copiar
            </Button>
          </div>
          <pre className="text-emerald-400 font-mono text-sm overflow-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-700">
            {jsonOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
