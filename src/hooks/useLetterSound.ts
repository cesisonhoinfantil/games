import { Howl } from "howler";
import { useCallback, useRef } from "react";

export function useLetterSound() {
  const audio = useRef<Howl>();

  const playSound = useCallback((letter?: string) => {
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

  return { playSound, audio };
}
