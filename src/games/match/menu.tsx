import DuoButton from "@/components/animata/button/duolingo";
import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMatchStore } from "./stores/useMatchStore";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
      <div className="w-1/2 text-center pointer-events-none">Jogo de Match</div>
      <div className="w-1/4 flex items-center justify-center">
        <Gamepad2 />
      </div>
    </HeaderContainer>
  );
}

export function MatchMenu() {
  const setConfig = useMatchStore((state) => state.setConfig);
  const start = useMatchStore((state) => state.start);
  const setMode = useMatchStore((state) => state.setMode);

  const [step, setStep] = useState<"mode" | "difficulty">("mode");

  const selectMode = (mode: "pairs" | "madness") => {
    setMode(mode);
    setStep("difficulty");
  };

  const selectDifficulty = (difficulty: "very easy" | "easy" | "medium" | "hard" | "very hard") => {
    setConfig({ difficulty, maxLife: 5, maxLevel: 15 });
    start();
  };

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <MenuHeader />
      <div className="flex flex-col p-6 box-border leading-5">
        <div className="mb-4 flex gap-2">
          <img src="/onomatopeias/png/M.png" className="w-1/4 object-contain" alt="Mascote" />
          <div className="bg-white rounded-xl p-3 w-full">
            <h1 className="font-bold">Hora do Desafio de Associação!</h1>
            <span>
              {step === "mode" 
                ? "Escolha o modo de jogo que você quer jogar:" 
                : "Agora escolha o nível de dificuldade:"}
            </span>
          </div>
        </div>

        {step === "mode" && (
          <div className="flex flex-col gap-4">
            <DuoButton
              affect="whitespace-pre-wrap"
              variants="success"
              onClick={() => selectMode("pairs")}
            >
              <div className="text-xl">Match Pairs (Clássico)</div>
              <Separator className="my-1" />
              <span>
                Faça as associações sem pressa. Cuidado para não errar e perder corações!
              </span>
            </DuoButton>

            <DuoButton
              affect="whitespace-pre-wrap"
              variants="error"
              onClick={() => selectMode("madness")}
            >
              <div className="text-xl">Match Madness (Tempo)</div>
              <Separator className="my-1" />
              <span>
                Corrida contra o relógio! Faça o máximo de associações possíveis antes do tempo acabar.
              </span>
            </DuoButton>
          </div>
        )}

        {step === "difficulty" && (
          <div className="flex flex-col gap-4">
            <Button 
               variant="outline" 
               className="self-start mb-2"
               onClick={() => setStep("mode")}
            >
              Voltar
            </Button>
            
            <DuoButton
              affect="whitespace-pre-wrap"
              variants="success"
              onClick={() => selectDifficulty("very easy")}
            >
              <div className="text-xl">1. Muito Fácil (Som, Figura e Letra)</div>
              <Separator className="my-1" />
              <span>
                Toque na Onomatopeia para ouvir o som e associe com a Letra!
              </span>
            </DuoButton>

            <DuoButton
              affect="whitespace-pre-wrap"
              variants="white"
              onClick={() => selectDifficulty("easy")}
            >
              <div className="text-xl">2. Fácil (Figura e Letra)</div>
              <Separator className="my-1" />
              <span>
                Faça a associação visual da Onomatopeia com a sua Letra inicial.
              </span>
            </DuoButton>

            <DuoButton
              affect="whitespace-pre-wrap"
              variants="white"
              onClick={() => selectDifficulty("medium")}
            >
              <div className="text-xl">3. Médio (Som e Figura)</div>
              <Separator className="my-1" />
              <span>
                Escute o Som e associe com a Onomatopeia correspondente.
              </span>
            </DuoButton>

            <DuoButton
              affect="whitespace-pre-wrap"
              variants="error"
              onClick={() => selectDifficulty("hard")}
            >
              <div className="text-xl">4. Difícil (Som e Letra)</div>
              <Separator className="my-1" />
              <span>
                Escute o Som e associe diretamente com a Letra!
              </span>
            </DuoButton>

            <DuoButton
              affect="whitespace-pre-wrap"
              variants="default"
              className="bg-purple-500 border-purple-700 text-white"
              onClick={() => selectDifficulty("very hard")}
            >
              <div className="text-xl">5. Desafio (Todos os tipos)</div>
              <Separator className="my-1" />
              <span className="text-white/90">
                Uma surpresa a cada carta! Diferentes combinações ao mesmo tempo.
              </span>
            </DuoButton>
          </div>
        )}
      </div>
    </div>
  );
}
