import { Button } from "@/components/ui/button";
import * as opentype from "opentype.js";
import React, { useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 500;
const FONT_URL =
  "/assets/fonts/Regular - T2/Regular - T2 SR/Irineu Brasil Regular T2 SR.otf";

interface Point {
  x: number;
  y: number;
}

export function GabaritoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [letter, setLetter] = useState("A");
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [jsonOutput, setJsonOutput] = useState("");

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

    // 2. Desenha os traços confirmados
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 20;

    strokes.forEach((stroke, idx) => {
      ctx.strokeStyle = `hsl(${(idx * 137) % 360}, 70%, 50%)`; // Cor diferente para cada traço
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Desenha o marcador de ínicio
      if (stroke.length > 0) {
        ctx.fillStyle = "#1e293b"; // slate-800
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((idx + 1).toString(), stroke[0].x, stroke[0].y);
      }
    });

    // 3. Desenha o traço atual
    if (currentStroke.length > 0) {
      ctx.strokeStyle = "#0f172a";
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
  }, [font, letter, strokes, currentStroke]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_SIZE / rect.height);
    setCurrentStroke([{ x, y }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_SIZE / rect.height);

    setCurrentStroke((prev) => {
      const last = prev[prev.length - 1];
      if (!last || Math.hypot(last.x - x, last.y - y) > 5) {
        return [...prev, { x, y }];
      }
      return prev;
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 3) {
      setStrokes([...strokes, currentStroke]);
    }
    setCurrentStroke([]);
  };

  const undo = () => {
    setStrokes((s) => s.slice(0, -1));
  };

  const clear = () => {
    setStrokes([]);
  };

  const exportJSON = () => {
    // Distância desejada entre bolinhas (ex: 8% do canvas ~ 40px)
    const TARGET_DISTANCE = CANVAS_SIZE * 0.08;

    const uniformlySpaced = strokes.map((stroke) => {
      if (stroke.length < 2) return stroke;
      const resampled = [stroke[0]];
      let prev = stroke[0];
      let currentLength = 0;

      for (let i = 1; i < stroke.length; i++) {
        const curr = stroke[i];
        let d = Math.hypot(curr.x - prev.x, curr.y - prev.y);

        while (currentLength + d >= TARGET_DISTANCE) {
          const remaining = TARGET_DISTANCE - currentLength;
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

      // Adiciona sempre o último ponto exato (para fechar a ponta perfeitamente)
      const lastOrig = stroke[stroke.length - 1];
      const lastResampled = resampled[resampled.length - 1];
      if (
        Math.hypot(lastOrig.x - lastResampled.x, lastOrig.y - lastResampled.y) >
        TARGET_DISTANCE * 0.2
      ) {
        resampled.push(lastOrig);
      }
      return resampled;
    });

    // Normaliza de 0 a 1
    const normalized = uniformlySpaced.map((stroke) =>
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
        <label className="font-bold text-slate-600 ml-2">Letra:</label>
        <input
          maxLength={1}
          value={letter}
          autoFocus
          onChange={(e) => {
            setLetter(e.target.value.toUpperCase());
            setStrokes([]);
            setJsonOutput("");
          }}
          className="w-16 h-12 pb-1 text-center text-3xl font-black text-sky-600 rounded-xl bg-slate-100 focus:ring-4 focus:ring-sky-100 outline-none"
        />
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
