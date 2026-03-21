import DuoButton from "@/components/animata/button/duolingo";
import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemoryStore } from "./stores/useMemoryStore";

function MenuHeader() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer className="px-0">
      <Button
        variant={"ghost"}
        className="w-1/4 [&_svg]:size-6 h-full"
        onClick={goBack}
      >
        <ArrowLeft />
      </Button>
      <div className="w-1/2 text-center pointer-events-none potta-one-regular text-[28px] text-sky-900 tracking-tight leading-8">Jogo da Memória</div>
      <div className="w-1/4 flex items-center justify-center">
        <Brain className="text-sky-900 size-8" />
      </div>
    </HeaderContainer>
  );
}

export function MemoryMenu() {
  const setConfig = useMemoryStore((state) => state.setConfig);
  const start = useMemoryStore((state) => state.start);

  const selectDifficulty = (
    difficulty: "very easy" | "easy" | "medium" | "hard" | "very hard"
  ) => {
    setConfig({ difficulty, maxLife: 5, maxLevel: 15 });
    start();
  };

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <MenuHeader />
      <div className="flex flex-col p-6 box-border leading-5">
        <div className="mb-4 flex gap-2">
          <img
            src="/onomatopeias/png/M.png"
            className="w-1/4 object-contain"
            alt="Mascote"
          />
          <div className="bg-white rounded-xl p-3 w-full">
            <h1 className="font-bold">Bem-vindo ao Jogo da Memória!</h1>
            <span>Escolha o nível de dificuldade para começar a encontrar os pares:</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <DuoButton
            affect="whitespace-pre-wrap"
            variants="success"
            onClick={() => selectDifficulty("very easy")}
          >
            <div className="text-xl">1. Muito Fácil (6 Cartas)</div>
            <Separator className="my-1" />
            <span>
              Figura e Letra. Com sons para ajudar!
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="white"
            onClick={() => selectDifficulty("easy")}
          >
            <div className="text-xl">2. Fácil (8 Cartas)</div>
            <Separator className="my-1" />
            <span>
              Figura e Letra. Sem sons automáticos.
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="white"
            onClick={() => selectDifficulty("medium")}
          >
            <div className="text-xl">3. Médio (12 Cartas)</div>
            <Separator className="my-1" />
            <span>
              Som e Figura. Teste sua audição!
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="error"
            onClick={() => selectDifficulty("hard")}
          >
            <div className="text-xl">4. Difícil (12 Cartas)</div>
            <Separator className="my-1" />
            <span>Som e Letra. Desafio avançado.</span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="default"
            className="bg-purple-500 border-purple-700 text-white"
            onClick={() => selectDifficulty("very hard")}
          >
            <div className="text-xl">5. Desafio (16 Cartas)</div>
            <Separator className="my-1" />
            <span className="text-white/90">
              Muitas cartas misturadas! Boa sorte.
            </span>
          </DuoButton>
        </div>
      </div>
    </div>
  );
}
