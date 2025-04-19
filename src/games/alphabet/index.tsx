import DuoButton from "@/components/animata/button/duolingo";
import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AllOptions,
  AltsExtraInfos,
  optionsKeys,
} from "@/games/sound-quiz/states/static";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ReactNode, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AlphabetHeader() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer className="px-0">
      <Button
        variant={"ghost"}
        className="w-1/3 [&_svg]:size-6 h-full"
        onClick={goBack}
      >
        <ArrowLeft />
      </Button>
      <div className="w-full text-center">Alfabeto</div>
      <div className="w-1/3" />
    </HeaderContainer>
  );
}

function AlphabetTitle({ children }: { children: ReactNode }) {
  return (
    <div className="w-full grid grid-cols-[1fr_min-content_1fr] gap-4 col-span-full items-center text-white font-bold text-3xl">
      <Separator className="bg-white h-1" />
      <span>{children}</span>
      <Separator className="bg-white h-1" />
    </div>
  );
}

function LetterRender({
  letter,
  playSound,
}: {
  letter: string;
  playSound: (letter: string) => void;
}) {
  return (
    <LetterButton
      letter={letter}
      variants={AllOptions[letter as keyof typeof AllOptions]}
      playSound={playSound}
      key={letter}
    />
  );
}

export function Alphabet() {
  const audio = useRef<Howl>();

  const playSound = useCallback((letter: string) => {
    if (audio.current?.playing()) {
      audio.current.stop();
    }
    if (letter) {
      audio.current = new Howl({
        src: `/sounds/onomatopeias/${letter}.mp3`,
      });
      audio.current.play();
    }
  }, []);

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <AlphabetHeader />
      <div className="w-full px-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-6 items-center">
        {optionsKeys
          .slice(0, 26)
          .map((letter) => LetterRender({ letter, playSound }))}
        <AlphabetTitle>VOGAIS</AlphabetTitle>
        {["A", "E", "I", "O", "U"].map((letter) =>
          LetterRender({ letter, playSound })
        )}
        <AlphabetTitle>Prolongáveis</AlphabetTitle>
        {["V", "F", "L", "M", "N", "S", "Z", "X", "J", "R"].map((letter) =>
          LetterRender({ letter, playSound })
        )}
        <AlphabetTitle>Explosivas</AlphabetTitle>
        {["C", "B", "D", "T", "P", "Q", "G"].map((letter) =>
          LetterRender({ letter, playSound })
        )}
        <AlphabetTitle>Estrangeiras</AlphabetTitle>
        {["H", "K", "W", "Y"].map((letter) =>
          LetterRender({ letter, playSound })
        )}
        <AlphabetTitle>Anexos</AlphabetTitle>
        {["Ç", "CH", "NH", "LH", "ÃO"].map((letter) =>
          LetterRender({ letter, playSound })
        )}
      </div>
    </div>
  );
}

function LetterButton({
  letter,
  variants,
  playSound,
}: {
  letter: string;
  variants: string[];
  playSound: (letter: string) => void;
}) {
  const [img, setImg] = useState("");
  const [info, setInfo] = useState(letter);
  const [extra, setExtra] = useState("");

  const play = useCallback(() => {
    const hasNumber = (str: string) => /\d/.test(str);

    let toPlay = letter;
    const imgIndex = variants.indexOf(img);

    if (imgIndex + 1 === variants.length) {
      setImg("");
      setInfo(letter);
      setExtra("");
    } else {
      toPlay = variants[imgIndex + 1];
      setImg(toPlay);
    }

    const extraInfo = AltsExtraInfos[letter] ?? AltsExtraInfos[toPlay];

    if (letter !== toPlay && !hasNumber(toPlay) && extraInfo) {
      setExtra(`(${extraInfo})`);
    }

    playSound(toPlay);
  }, [img, letter, playSound, variants]);

  console.log(img);

  return (
    <DuoButton
      onClick={() => play()}
      className={cn(!img && "aspect-square", "transition-all")}
      affect="flex flex-col itens-center justify-center gap-4"
    >
      <div
        className={cn(
          "w-full h-full object-contain transition-all duration-500",
          !img && "scale-0 transition-none absolute"
        )}
      >
        <img
          src={`/onomatopeias/png/${img}.png`}
          className={cn("w-full h-full object-contain", !img && "hidden")}
        />
      </div>
      <div>
        <div
          className={cn(
            "transition-all duration-500",
            img ? "text-3xl" : "text-6xl font-bold"
          )}
        >
          {info}
        </div>
        {extra}
      </div>
    </DuoButton>
  );
}
