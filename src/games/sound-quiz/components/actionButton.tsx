import Button from "@/components/animata/button/duolingo";
import { useLetterSound } from "@/hooks/useLetterSound";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { ReactNode, useEffect } from "react";
import useGameState from "../states";

type ActionContainerProps = {
  children: ReactNode;
  className?: string;
  soundIcon?: boolean;
  hasSound?: boolean;
};

function ActionContainer({
  children,
  className,
  soundIcon = false,
  hasSound = false,
}: ActionContainerProps) {
  const extraInfo = useGameState((state) => state.extraInfo);
  const img = useGameState((state) => state.img);
  const state = useGameState((state) => state.status); // force update on pass level
  const { playSound } = useLetterSound();

  useEffect(() => {
    if (hasSound && img && !state) {
      playSound(img);
    }
  }, [hasSound, img, playSound, state]);

  return (
    <Button
      onClick={() => hasSound && playSound(img)}
      variants="white"
      affect="p-0"
      className={cn("w-2/4 h-full landscape:aspect-square mx-auto", className)}
    >
      <div className="relative w-full h-full flex justify-center items-center">
        {soundIcon && (
          <Volume2
            color="#3BA7C5"
            size={32}
            className="absolute top-3 right-3"
          />
        )}
        {children}
        <p className="absolute w-full bottom-0 text-center text-lg">
          {extraInfo}
        </p>
      </div>
    </Button>
  );
}

export function ActionButton() {
  const difficulty = useGameState((state) => state.difficulty);

  switch (difficulty) {
    case "very easy":
      return <ImgAndSound />;
    case "easy":
      return <OnlyImg />;
    case "medium":
      return <OnlySound />;
    case "hard":
      return <OnlyImg />;
    case "very hard":
      return <OnlyLetter />;
    default:
      break;
  }

  return <OnlyLetter />;
}

function ImgAndSound() {
  const img = useGameState((state) => state.img);

  return (
    <ActionContainer hasSound soundIcon>
      <picture className="w-full h-full p-4 pb-6 px-8">
        <source srcSet={`/onomatopeias/png/${img}.png`} />
        <img
          className="w-full h-full object-contain max-h-40 sm:max-h-none min-h-36"
          src="/onomatopeias/A2.png"
        />
      </picture>
    </ActionContainer>
  );
}

function OnlySound() {
  return (
    <ActionContainer hasSound>
      <div className="w-full h-full p-10">
        <Volume2 color="#3BA7C5" className="w-full h-full" strokeWidth={0.75} />
      </div>
    </ActionContainer>
  );
}

function OnlyImg() {
  const img = useGameState((state) => state.img);

  return (
    <ActionContainer>
      <picture className="w-full h-full p-4 pb-6 px-8">
        <source srcSet={`/onomatopeias/png/${img}.png`} />
        <img
          className="w-full h-full object-contain max-h-40 sm:max-h-none min-h-36"
          src="/onomatopeias/A2.png"
        />
      </picture>
    </ActionContainer>
  );
}

function OnlyLetter() {
  const letter = useGameState((state) => state.options[state.correct!] ?? "");

  return (
    <ActionContainer>
      <div className="w-full h-full p-10 pt-7 text-9xl flex items-center justify-center aspect-square">
        {letter}
      </div>
    </ActionContainer>
  );
}
