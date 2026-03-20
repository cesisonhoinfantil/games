import Button from "@/components/animata/button/duolingo";
import { Status } from "@/components/status";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSound from "use-sound";
import useGameState from "../states";
import { useSettingsStore } from "@/store/useSettingsStore";

export function LevelControl() {
  const [win] = useSound("/sounds/effects/success.mp3", { volume: 0.7 });
  const [lose] = useSound("/sounds/effects/fail.mp3", { volume: 0.7 });
  const GameStatus = useGameState((state) => state.status);
  const selected = useGameState((state) => state.selected);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);

  useEffect(() => {
    if (GameStatus) {
      if (GameStatus == "win") {
        win();
        if (vibrationEnabled && "vibrate" in navigator) {
          navigator.vibrate(100);
        }
      } else {
        lose();
        if (vibrationEnabled && "vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    }
  }, [GameStatus, lose, win, vibrationEnabled]);

  return (
    <div
      className={cn(
        "w-full h-full flex justify-center items-end py-6 relative z-10",
        GameStatus && "fixed h-1/4 bottom-0"
      )}
    >
      {GameStatus && (
        <Status
          className="motion-preset-slide-up-md"
          variant={GameStatus == "win" ? "success" : "error"}
        />
      )}
      <Button
        className="w-2/3"
        variants={GameStatus == "lose" ? "error" : "white"}
        onClick={() => {
          const { verify, nextLevel, status } = useGameState.getState();
          if (status) {
            nextLevel();
          } else {
            verify();
          }
        }}
        disabled={selected == null}
      >
        Avançar
      </Button>
    </div>
  );
}
