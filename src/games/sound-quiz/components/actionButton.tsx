import Button from "@/components/animata/button/duolingo";
import { Howl } from "howler";
import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import useGameState from "../states";

export function ActionButton() {
  const img = useGameState((state) => state.img);
  const state = useGameState((state) => state.status); // force update on pass level
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
      className="w-2/3 min-h-36 m-auto"
    >
      <div className="relative w-full h-full flex justify-center items-center">
        <Volume2 color="#3BA7C5" size={32} className="absolute top-3 right-3" />
        <picture className="w-full h-full p-4 px-11">
          <source srcSet={`/onomatopeias/png/${img}.png`} />
          <img
            className="w-full h-full object-contain"
            src="/onomatopeias/A2.png"
          />
        </picture>
      </div>
    </Button>
  );
}