import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronLeft, RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CANVAS_SIZE = 500;
const BRUSH_RADIUS = 11; // Reduzido para um traço mais amigável

interface Point {
  x: number;
  y: number;
}

interface Gabarito {
  letter: string;
  strokes: Point[][];
}

export function TracingGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  const [letter, setLetter] = useState("A");
  const [gabarito, setGabarito] = useState<Gabarito | null>(null);
  const [activeTab, setActiveTab] = useState<"letras" | "numeros">("letras");

  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [fails, setFails] = useState(0);
  const MAX_PENALTY = 100;
  const MAX_FAILS = 3;

  const allDrawnStrokes = useRef<Point[][]>([]);
  const currentStrokeIndex = useRef(0);
  const currentPointIndex = useRef(0);
  const currentDrawnPoints = useRef<Point[]>([]);

  const drawCanvas = (tempStroke?: Point[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!gabarito) {
      if (!loading) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "Gabarito indisponível para " + letter,
          CANVAS_SIZE / 2,
          CANVAS_SIZE / 2,
        );
      }
      return;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. Desenho da Criança Realçado (Fica no fundo agora!)
    ctx.lineWidth = BRUSH_RADIUS * 2;
    ctx.strokeStyle = "#38bdf8";
    allDrawnStrokes.current.forEach((stroke) => {
      if (!stroke || stroke.length === 0) return;
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });

    // 2. Traço sendo desenhado no momento
    if (tempStroke && tempStroke.length > 0) {
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.strokeStyle = "#0ea5e9";
      ctx.beginPath();
      tempStroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }

    // 3. Gabarito Base (Bolinhas desenhadas POR CIMA de tudo)
    gabarito.strokes.forEach((stroke, strokeIdx) => {
      if (!stroke) return;

      const isCurrentStroke =
        strokeIdx === currentStrokeIndex.current && !isFinished;
      const isFutureStroke = strokeIdx > currentStrokeIndex.current;

      // Desenhar cada ponto do gabarito como uma bolinha isolada
      stroke.forEach((p, ptIdx) => {
        const px = p.x * CANVAS_SIZE;
        const py = p.y * CANVAS_SIZE;
        ctx.beginPath();

        let radius = 10;
        let opacity = 0.2;
        let color = "148, 163, 184"; // slate-400 (cinza base)

        if (isFutureStroke) {
          opacity = 0.15;
          radius = 8;
        } else if (isCurrentStroke) {
          if (ptIdx < currentPointIndex.current) {
            // Bolinhas que já passou ficam muito apagadas
            opacity = 0.08;
            radius = 8;
          } else {
            // Bolinhas PELA FRENTE (foco atual)
            const diff = ptIdx - currentPointIndex.current;
            // Efeito Fade: Quanto mais longe, menor e mais transparente
            opacity = Math.max(0.15, 1 - diff * 0.06);
            radius = Math.max(5, 14 - diff * 0.4);
            color = "245, 158, 11"; // amber-500 (laranja/amarelo para destacar do traço azul)
          }
        } else {
          // Traços passados
          opacity = 0.05;
          radius = 8;
        }

        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.fill();

        // Anel de destaque "pulsante" no ponto imediatamente requisitado
        if (isCurrentStroke && ptIdx === currentPointIndex.current) {
          ctx.beginPath();
          ctx.arc(px, py, radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color}, 0.6)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Indicador Numérico de Início para o traço atual
      if (isCurrentStroke) {
        ctx.beginPath();
        ctx.arc(
          stroke[0].x * CANVAS_SIZE,
          stroke[0].y * CANVAS_SIZE,
          14,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#f59e0b"; // amber-500 forte
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          (strokeIdx + 1).toString(),
          stroke[0].x * CANVAS_SIZE,
          stroke[0].y * CANVAS_SIZE,
        );
      }
    });
  };

  const handleReset = useCallback(() => {
    setIsFinished(false);
    setProgress(0);
    setPenalty(0);
    allDrawnStrokes.current = [];
    currentStrokeIndex.current = 0;
    currentPointIndex.current = 0;
    currentDrawnPoints.current = [];
  }, []); // Removed drawCanvas to avoid loops

  const loadGabarito = useCallback(
    async (char: string) => {
      setLoading(true);
      setGabarito(null);
      handleReset();
      try {
        let folder = "cursivas/mai";
        if (/[0-9]/.test(char)) {
          folder = "numbers";
        } else if (char === char.toLowerCase()) {
          folder = "cursivas/min";
        }

        const res = await fetch(`/assets/gabaritos/${folder}/${char}.json`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setGabarito(data);
      } catch (err) {
        console.warn("Gabarito indisponível para", char);
      } finally {
        setLoading(false);
      }
    },
    [handleReset],
  );

  useEffect(() => {
    loadGabarito(letter);
  }, [letter, loadGabarito]);

  // Redraw when drawing states change
  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, gabarito, loading]);

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isFinished || !gabarito) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
    const cy = "touches" in e ? e.touches[0].clientY : (e as any).clientY;
    const x = (cx - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (cy - rect.top) * (CANVAS_SIZE / rect.height);

    const targetStroke = gabarito.strokes[currentStrokeIndex.current];
    if (!targetStroke) return;

    // 1. Validation de penalidade
    let minDistance = Infinity;
    targetStroke.forEach((p) => {
      const d = Math.hypot(x - p.x * CANVAS_SIZE, y - p.y * CANVAS_SIZE);
      minDistance = Math.min(minDistance, d);
    });

    if (minDistance > BRUSH_RADIUS * 2) {
      setPenalty((prev) => {
        const next = prev + 1;
        if (next >= MAX_PENALTY) {
          handleReset();
          setFails((f) => f + 1);
          return 0;
        }
        return next;
      });
    } else {
      // Avança o checkpoint atual apenas se alcançar os próximos
      const windowSize = 2; // Janela menor para ser mais rigorosa!
      const startIndex = currentPointIndex.current;
      const endIndex = Math.min(startIndex + windowSize, targetStroke.length);

      for (let i = startIndex; i < endIndex; i++) {
        const pt = targetStroke[i];
        const d = Math.hypot(x - pt.x * CANVAS_SIZE, y - pt.y * CANVAS_SIZE);
        if (d <= BRUSH_RADIUS * 1.5) {
          // Precisa encostar razoavelmente perto do centro da bolinha
          currentPointIndex.current = Math.max(
            currentPointIndex.current,
            i + 1,
          );
        }
      }
    }

    currentDrawnPoints.current.push({ x, y });
    drawCanvas(currentDrawnPoints.current);

    // Concluiu o traço atual? (Exige rigor: passar pelo *último* ponto estritamente)
    if (currentPointIndex.current >= targetStroke.length) {
      allDrawnStrokes.current.push([...currentDrawnPoints.current]);
      currentStrokeIndex.current += 1;
      currentPointIndex.current = 0;
      currentDrawnPoints.current = [];

      const newProg = Math.round(
        (currentStrokeIndex.current / gabarito.strokes.length) * 100,
      );
      setProgress(newProg);
      if (newProg >= 100) {
        setIsFinished(true);
        setIsDrawing(false);
      }
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    // Se soltou o dedo no meio do traçado, reseta o progresso DO TRAÇO ATUAL (ensina a ir de uma vez)
    if (!isFinished && currentDrawnPoints.current.length > 0) {
      currentPointIndex.current = 0;
      currentDrawnPoints.current = [];
      drawCanvas();
    }
  };

  const handleResetClick = () => {
    handleReset();
    setTimeout(() => drawCanvas(), 50); // Small delay to guarantee state is reset before drawing
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate(-1)}
          className="rounded-2xl"
        >
          <ChevronLeft className="mr-2 h-6 w-6" /> Voltar
        </Button>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Trato de Letra
        </h1>
        <Button
          variant="outline"
          size="lg"
          onClick={handleResetClick}
          className="rounded-2xl border-2"
        >
          <RotateCcw className="mr-2 h-5 w-5" /> Limpar
        </Button>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 sm:border-12 border-white ring-1 ring-slate-200">
        {fails >= MAX_FAILS && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[32px] sm:rounded-[28px]">
            <span className="text-6xl mb-4">😢</span>
            <h2 className="text-white text-2xl font-black mb-6 text-center px-4 leading-tight">
              Poxa, a folha borrou muito!
            </h2>
            <Button
              onClick={() => setFails(0)}
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-xl h-14 px-8 shadow-xl"
            >
              <RotateCcw className="mr-2 h-6 w-6" /> Tentar Novamente
            </Button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={(e) => {
            setIsDrawing(true);
            currentDrawnPoints.current = [];
            draw(e);
          }}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={(e) => {
            setIsDrawing(true);
            currentDrawnPoints.current = [];
            draw(e);
          }}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="relative z-10 cursor-crosshair touch-none bg-transparent"
        />
      </div>

      <div className="w-full max-w-md mt-8 space-y-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between text-xl font-black text-sky-600 mb-3">
            <span>Escrevendo {letter}</span>
            <span>{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-8 bg-slate-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-sky-400 [&>div]:to-blue-500 mb-4"
          />

          <div className="flex justify-between text-sm font-bold text-red-500 mb-1">
            <span>Penalidade por Borrão</span>
            <span>{Math.round((penalty / MAX_PENALTY) * 100)}%</span>
          </div>
          <Progress
            value={(penalty / MAX_PENALTY) * 100}
            className="h-3 bg-red-100 rounded-full [&>div]:bg-red-500"
          />
        </div>

        {isFinished && (
          <div className="flex items-center justify-center p-6 bg-green-500 text-white rounded-[32px] animate-in slide-in-from-bottom-4 duration-500 shadow-xl shadow-green-200">
            <CheckCircle2 className="mr-3 h-10 w-10" />
            <span className="text-2xl font-black">PERFEITO!</span>
          </div>
        )}

        <div className="flex gap-4 mb-6 justify-center">
          <Button
            variant={activeTab === "letras" ? "default" : "outline"}
            onClick={() => setActiveTab("letras")}
            className={`rounded-2xl text-lg h-12 px-8 ${activeTab === "letras" ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md" : "text-slate-400 border-2 bg-white"}`}
          >
            Letras
          </Button>
          <Button
            variant={activeTab === "numeros" ? "default" : "outline"}
            onClick={() => setActiveTab("numeros")}
            className={`rounded-2xl text-lg h-12 px-8 ${activeTab === "numeros" ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md" : "text-slate-400 border-2 hover:text-amber-500 hover:border-amber-200 bg-white"}`}
          >
            Números
          </Button>
        </div>

        {activeTab === "letras" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-slate-400 font-bold text-sm tracking-widest pl-2 mb-3">
                MAIÚSCULAS
              </h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] sm:grid-cols-7 gap-2">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                  <button
                    key={`mai-${l}`}
                    onClick={() => {
                      setLetter(l);
                      setFails(0);
                    }}
                    className={`h-12 text-xl font-black rounded-2xl transition-all ${
                      letter === l
                        ? "bg-sky-500 text-white shadow-lg scale-110"
                        : "bg-white text-slate-400 border-2 border-slate-50 hover:border-sky-100 hover:text-sky-500 shadow-sm"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-slate-200"></div>

            <div>
              <h3 className="text-slate-400 font-bold text-sm tracking-widest pl-2 mb-3">
                MINÚSCULAS
              </h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] sm:grid-cols-7 gap-2">
                {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
                  <button
                    key={`min-${l}`}
                    onClick={() => {
                      setLetter(l);
                      setFails(0);
                    }}
                    className={`h-12 text-xl font-black rounded-2xl transition-all ${
                      letter === l
                        ? "bg-sky-500 text-white shadow-lg scale-110"
                        : "bg-white text-slate-400 border-2 border-slate-50 hover:border-sky-100 hover:text-sky-500 shadow-sm"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "numeros" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-slate-400 font-bold text-sm tracking-widest pl-2 mb-3 text-center">
                NÚMEROS
              </h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] sm:grid-cols-5 gap-3 max-w-sm mx-auto">
                {"1234567890".split("").map((l) => (
                  <button
                    key={`num-${l}`}
                    onClick={() => {
                      setLetter(l);
                      setFails(0);
                    }}
                    className={`h-14 sm:h-12 text-2xl sm:text-xl font-black rounded-2xl transition-all ${
                      letter === l
                        ? "bg-amber-500 text-white shadow-lg scale-110"
                        : "bg-white text-slate-400 border-2 border-slate-50 hover:border-amber-100 hover:text-amber-500 shadow-sm"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
