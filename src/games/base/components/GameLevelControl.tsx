import Button from "@/components/animata/button/duolingo";
import { Status } from "@/components/status";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSound from "use-sound";
import { useSettingsStore } from "@/store/useSettingsStore";

export interface GameLevelControlProps {
  status?: "win" | "lose";
  selected?: number | string | null;
  onVerify: () => void;
  onNextLevel: () => void;
}

export function GameLevelControl({ status, selected, onVerify, onNextLevel }: GameLevelControlProps) {
  const [win] = useSound("/sounds/effects/success.mp3", { volume: 0.7 });
  const [lose] = useSound("/sounds/effects/fail.mp3", { volume: 0.7 });
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);

  useEffect(() => {
    if (status) {
      if (status == "win") {
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
  }, [status, lose, win, vibrationEnabled]);

  return (
    <div
      className={cn(
        "w-full h-full flex justify-center items-end py-6 relative z-10",
        status && "fixed h-1/4 bottom-0"
      )}
    >
      {status && (
        <Status
          className="motion-preset-slide-up-md"
          variant={status == "win" ? "success" : "error"}
        />
      )}
      <Button
        className="w-2/3"
        variants={status == "lose" ? "error" : "white"}
        onClick={() => {
          if (status) {
            onNextLevel();
          } else {
            onVerify();
          }
        }}
        disabled={selected == null}
      >
        Avançar
      </Button>
    </div>
  );
}
