import Button from "@/components/animata/button/duolingo";
import { useLetterSound } from "@/hooks/useLetterSound";
import { cn } from "@/lib/utils";
import WavesurferPlayer from "@wavesurfer/react";
import { useCallback, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import useGameState from "../states";

type ButtonOptionProps = {
  letter: string;
  index: number;
  status?: "win" | "lose";
  isWave?: boolean;
  playSound: (letter: string) => void;
};

function ButtonOption({
  letter,
  index,
  status,
  isWave = false,
  playSound,
}: ButtonOptionProps) {
  const wave = useRef<WaveSurfer | null>(null);
  const isSelected = useGameState((state) => state.selected === index);
  const img = useGameState((state) => state.imgOptions[index]);

  const Select = useCallback(() => {
    if (index == null) return console.error("No button index ?");
    useGameState.getState().select(index);
  }, [index]);

  const SelectVariant = useCallback(
    (index: number) => {
      const correct = useGameState.getState().correct;
      const isCorrect = correct === index;

      if ((status == "win" && isSelected) || (status == "lose" && isCorrect)) {
        return "success";
      }

      if (status == "lose" && isSelected) {
        return "error";
      }

      if (isSelected || (status && !isSelected)) {
        return "white";
      }
      return "default";
    },
    [isSelected, status]
  );

  const GenerateClassName = useCallback(
    (index: number) => {
      const className = [];
      if (index >= 4) {
        className.push("col-span-2 justify-self-center w-1/2");
      }
      if (status === "win" && isSelected) {
        className.push("motion-preset-confetti motion-duration-1000");
      }
      if (status === "lose" && isSelected) {
        className.push("motion-preset-shake");
      }
      return cn(...className);
    },
    [isSelected, status]
  );

  useEffect(() => {
    if (wave.current) {
      wave.current.setOptions({
        waveColor: isSelected ? "black" : "lightblue",
      });
    }
  }, [isSelected]);

  return (
    <Button
      variants={SelectVariant(index)}
      onClick={() => {
        if (isWave) playSound(img);
        Select();
      }}
      affect={"py-3 disabled:opacity-45"}
      className={GenerateClassName(index)}
      disabled={status && !isSelected}
    >
      {isWave ? (
        <WavesurferPlayer
          height={35}
          barWidth={2}
          waveColor={"lightblue"}
          interact={false}
          cursorWidth={0}
          url={`/sounds/onomatopeias/${img}.mp3`}
          normalize
          onReady={(ws) => (wave.current = ws)}
        />
      ) : (
        <span className="text-2xl flex justify-center">{letter}</span>
      )}
    </Button>
  );
}

export function Options() {
  const options = useGameState((state) => state.options);
  const status = useGameState((state) => state.status);
  const difficulty = useGameState((state) => state.difficulty);
  const { playSound } = useLetterSound();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 gap-y-4 pt-6 w-4/5 m-auto items-center landscape:pt-0",
        status && "pb-[40%] landscape:pb-[25%]"
      )}
    >
      {options.map((value, index) => (
        <ButtonOption
          index={index}
          key={value}
          status={status}
          isWave={difficulty == "hard" || difficulty == "very hard"}
          letter={value}
          playSound={playSound}
        />
      ))}
    </div>
  );
}
