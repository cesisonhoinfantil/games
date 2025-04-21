import DuoButton from "@/components/animata/button/duolingo";
import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGameState from "@/games/sound-quiz/states";
import { GameDataConfig } from "@/games/sound-quiz/states/interfaces";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <div className="w-1/2 text-center pointer-events-none">Quiz dos Sons</div>
      <div className="w-1/4 flex items-center justify-center">
        <Gamepad2 />
      </div>
    </HeaderContainer>
  );
}

export function Menu() {
  const setConfig = (config: Partial<GameDataConfig>) => {
    const { setConfig, start } = useGameState.getState();
    setConfig({ maxLevel: 15, maxLife: 5, ...config });
    start();
  };

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <MenuHeader />
      <div className="flex flex-col p-6 box-border leading-5">
        <div className="mb-4 flex gap-2">
          <img src="/onomatopeias/png/A2.png" className="w-1/4" />

          <div className="bg-white rounded-xl p-3 w-full">
            <h1 className="font-bold">Seja bem vindo ao Quiz dos sons!</h1>

            <span>Selecione o level/dificuldade que você gostará de jogar</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <DuoButton
            affect="whitespace-pre-wrap"
            variants="success"
            onClick={() =>
              setConfig({
                difficulty: "very easy",
              })
            }
          >
            <div className="text-xl">Som, figura e letra</div>
            <Separator className="my-1" />
            <span>
              Este level é o muito fácil, aqui você deverá escutar o som e ver a
              onomatopeia e escolher a letra nas opções
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="success"
            onClick={() =>
              setConfig({
                difficulty: "easy",
              })
            }
          >
            <div className="text-xl">Figura e letra</div>
            <Separator className="my-1" />
            <span>
              Este level é o um pouquinho mais difícil mas ainda fácil, aqui
              você deverá ver a onomatopeia e escolher a letra nas opções
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="white"
            onClick={() =>
              setConfig({
                difficulty: "medium",
              })
            }
          >
            <div className="text-xl">Som e letra</div>
            <Separator className="my-1" />
            <span>
              Dificultando um pouquinho a mais, aqui você deverá escutar o som e
              escolher a letra nas opções
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="white"
            onClick={() =>
              setConfig({
                difficulty: "hard",
              })
            }
          >
            <div className="text-xl">Figura e sons</div>
            <Separator className="my-1" />
            <span>
              Agora as coisinhas se inverteram, não tem mais a letra e sim o som
              nas opções, aqui você deverá ver a onomatopeia e escolher o som
              correspondente a onomatopeia
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="error"
            onClick={() =>
              setConfig({
                difficulty: "very hard",
              })
            }
          >
            <div className="text-xl">Letra e sons</div>
            <Separator className="my-1" />
            <span>
              Agora o mais difícil, aqui você deverá ver a letra e escolher o
              som correspondente a letra
            </span>
          </DuoButton>

          <DuoButton
            affect="whitespace-pre-wrap"
            variants="error"
            onClick={() => setConfig({ difficulty: undefined })}
          >
            <div className="text-xl">O Desafio</div>
            <Separator className="my-1" />
            <span>
              Se chegou até aqui, agora é a hora de ir em um desafio, aqui terá
              cada level indo do mais fácil ao mais difícil, será que você
              consegue o menor tempo possível ?
            </span>
          </DuoButton>
        </div>
      </div>
    </div>
  );
}
