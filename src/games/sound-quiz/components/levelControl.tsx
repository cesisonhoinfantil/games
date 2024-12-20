import Button from "@/components/animata/button/duolingo";
import { Status } from "@/components/status";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSound from "use-sound";
import useGameState from "../states";

export function LevelControl() {
  const [win] = useSound("/sounds/effects/success.mp3", { volume: 0.7 });
  const [lose] = useSound("/sounds/effects/fail.mp3", { volume: 0.7 });
  const GameStatus = useGameState((state) => state.status);
  const selected = useGameState((state) => state.selected);

  useEffect(() => {
    if (GameStatus) {
      if (GameStatus == "win") {
        win();
      } else {
        lose();
      }
    }
  }, [GameStatus, lose, win]);

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
