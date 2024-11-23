import Button from "@/components/animata/button/duolingo";
import { Howl } from "howler";
import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import useGameState from "../states";

export function ActionButton() {
  const img = useGameState((state) => state.img);
  const state = useGameState((state) => state.status); // force update on pass level
  const extraInfo = useGameState((state) => state.extraInfo);
  const audio = useRef<Howl>();

  useEffect(() => {
    if (audio.current && audio.current.playing()) {
      audio.current.stop();
    }
    if (img && !state) {
      audio.current = new Howl({
        src: `/sounds/onomatopeias/${img}.mp3`,
      });
      audio.current.play();
    }
  }, [img, state]);

  const play = useCallback(() => {
    if (audio.current) {
      if (audio.current.playing()) {
        audio.current.stop();
      }

      audio.current.play();
    }
  }, []);

  useEffect(() => {
    if (audio.current) {
      audio.current.play();
    }
  }, []);

  return (
    <Button
      onClick={() => play()}
      variants="white"
      affect="p-0"
      className="w-2/4 h-full landscape:aspect-square mx-auto"
    >
      <div className="relative w-full h-full flex justify-center items-center">
        <Volume2 color="#3BA7C5" size={32} className="absolute top-3 right-3" />
        <p className="absolute w-full bottom-0 text-center text-lg">
          {extraInfo}
        </p>
        <picture className="w-full h-full p-4 pb-6 px-8">
          <source srcSet={`/onomatopeias/png/${img}.png`} />
          <img
            className="w-full h-full object-contain max-h-40 sm:max-h-none min-h-36"
            src="/onomatopeias/A2.png"
          />
        </picture>
      </div>
    </Button>
  );
}
