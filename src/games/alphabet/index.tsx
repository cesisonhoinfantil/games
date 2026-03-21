import DuoButton from "@/components/animata/button/duolingo";
import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AllOptions,
  AltsExtraInfos,
  optionsKeys,
} from "@/games/sound-quiz/states/static";
import { useLetterSound } from "@/hooks/useLetterSound";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ReactNode, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export type AlphabetMode = "bastao" | "cursiva" | "4formas";
export type AlphabetCasing = "upper" | "lower";

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
  mode,
  casing,
}: {
  letter: string;
  playSound: (letter: string) => void;
  mode: AlphabetMode;
  casing: AlphabetCasing;
}) {
  return (
    <LetterButton
      letter={letter}
      variants={AllOptions[letter as keyof typeof AllOptions]}
      playSound={playSound}
      mode={mode}
      casing={casing}
      key={`${letter}-${mode}-${casing}`}
    />
  );
}

export function Alphabet() {
  const { playSound } = useLetterSound();
  const [mode, setMode] = useState<AlphabetMode>("bastao");
  const [casing, setCasing] = useState<AlphabetCasing>("upper");

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <AlphabetHeader />

      <div className="w-full flex flex-wrap justify-center gap-2 mt-4 px-4 sm:px-6 z-10 relative">
        <Button
          variant={mode === "bastao" ? "default" : "outline"}
          className="rounded-full shadow-md text-sm sm:text-lg px-4 sm:px-6"
          onClick={() => setMode("bastao")}
        >
          Bastão
        </Button>
        <Button
          variant={mode === "cursiva" ? "default" : "outline"}
          className="rounded-full shadow-md font-cursive text-xl sm:text-2xl font-normal px-4 sm:px-6 py-1"
          onClick={() => setMode("cursiva")}
        >
          Cursiva
        </Button>
        <Button
          variant={mode === "4formas" ? "default" : "outline"}
          className="rounded-full shadow-md text-sm sm:text-lg px-4 sm:px-6"
          onClick={() => setMode("4formas")}
        >
          4 Formas
        </Button>
      </div>

      {mode !== "4formas" && (
        <div className="w-full flex justify-center mt-2 px-4 sm:px-6 z-10 relative">
          <div className="flex flex-wrap justify-center bg-sky-400 p-1 rounded-3xl sm:rounded-full w-max shadow-inner gap-1 sm:gap-0">
            <Button
              variant="ghost"
              className={cn(
                "rounded-full px-4 sm:px-6 font-bold text-sm sm:text-base",
                casing === "upper"
                  ? "bg-white text-sky-600 hover:bg-white"
                  : "text-white hover:bg-sky-500 hover:text-white",
              )}
              onClick={() => setCasing("upper")}
            >
              Maiúscula
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "rounded-full px-4 sm:px-6 font-bold text-sm sm:text-base",
                casing === "lower"
                  ? "bg-white text-sky-600 hover:bg-white"
                  : "text-white hover:bg-sky-500 hover:text-white",
              )}
              onClick={() => setCasing("lower")}
            >
              Minúscula
            </Button>
          </div>
        </div>
      )}

      <div className="w-full px-6 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 p-6 items-center">
        {optionsKeys
          .slice(0, 26)
          .map((letter) => LetterRender({ letter, playSound, mode, casing }))}
        <AlphabetTitle>VOGAIS</AlphabetTitle>
        {["A", "E", "I", "O", "U"].map((letter) =>
          LetterRender({ letter, playSound, mode, casing }),
        )}
        <AlphabetTitle>Prolongáveis</AlphabetTitle>
        {["V", "F", "L", "M", "N", "S", "Z", "X", "J", "R"].map((letter) =>
          LetterRender({ letter, playSound, mode, casing }),
        )}
        <AlphabetTitle>Plosivas</AlphabetTitle>
        {["C", "B", "D", "T", "P", "Q", "G"].map((letter) =>
          LetterRender({ letter, playSound, mode, casing }),
        )}
        <AlphabetTitle>Estrangeiras</AlphabetTitle>
        {["K", "W", "Y"].map((letter) =>
          LetterRender({ letter, playSound, mode, casing }),
        )}
        <AlphabetTitle>Anexos</AlphabetTitle>
        {["H", "Ç", "CH", "NH", "LH", "ÃO"].map((letter) =>
          LetterRender({ letter, playSound, mode, casing }),
        )}
      </div>
    </div>
  );
}

function LetterButton({
  letter,
  variants,
  playSound,
  mode,
  casing,
}: {
  letter: string;
  variants: string[];
  playSound: (letter: string) => void;
  mode: AlphabetMode;
  casing: AlphabetCasing;
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

  const isLong = info.length > 1;

  const formatUpper = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const formatLower = (str: string) => str.toLowerCase();

  // The font requires a space to remove the trailing tail.
  // Because HTML often strips trailing spaces during OpenType shaping, we append a Zero Width Space (\u200B) AFTER it.
  const cursiveUpper = formatUpper(info);
  const cursiveLower = formatLower(info);

  console.log(img);

  return (
    <DuoButton
      onClick={() => play()}
      className={cn(!img && "aspect-square", "transition-all")}
      affect="flex flex-col itens-center justify-center gap-4 normal-case"
    >
      <div
        className={cn(
          "w-full h-full object-contain transition-all duration-500 flex items-center justify-center",
          !img && "scale-0 transition-none absolute",
        )}
      >
        <img
          src={`/onomatopeias/png/${img}.png`}
          className={cn("w-full h-full object-contain", !img && "hidden")}
        />
      </div>
      <div
        className={cn(
          "w-full grow flex flex-col items-center justify-center",
          img && "hidden",
        )}
      >
        {mode === "4formas" ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full items-center justify-center text-4xl gap-y-1 gap-x-2 p-1">
            <span
              className={cn(
                "font-bold text-center leading-none",
                isLong ? "text-xl" : "text-3xl",
              )}
            >
              {formatUpper(info)}
            </span>
            <span
              className={cn(
                "font-bold text-center leading-none tracking-tighter",
                isLong ? "text-xl" : "text-3xl",
              )}
            >
              {formatLower(info)}
            </span>
            <span
              className={cn(
                "font-cursive font-normal text-center leading-none pb-1 whitespace-pre",
                isLong ? "text-3xl" : "text-4xl",
              )}
            >
              {cursiveUpper}
            </span>
            <span
              className={cn(
                "font-cursive font-normal text-center leading-none pb-1 whitespace-pre",
                isLong ? "text-3xl" : "text-5xl",
              )}
            >
              {cursiveLower}
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "transition-all duration-500",
              img ? "text-3xl" : "text-6xl font-bold",
              mode === "cursiva" &&
                "font-cursive text-7xl font-normal tracking-wide whitespace-pre",
            )}
          >
            {mode === "cursiva"
              ? casing === "upper"
                ? cursiveUpper
                : cursiveLower
              : casing === "upper"
                ? formatUpper(info)
                : formatLower(info)}
          </div>
        )}
        {!img && extra && <div className="text-sm mt-1">{extra}</div>}
      </div>
    </DuoButton>
  );
}
