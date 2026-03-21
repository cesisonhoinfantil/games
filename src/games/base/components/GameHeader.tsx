import { Progress } from "@/components/ui/progress";
import { HeaderContainer } from "@/components/container";
import { GameLifeCount } from "./GameLifeCount";
import { GameTimer } from "./GameTimer";

interface GameHeaderProps {
  variant?: "endless" | "progress";
  end?: number;
  level: number;
  life: number;
  paused: boolean;
  onUpdateTiming: (time: number) => void;
}

export function GameHeader({ variant = "endless", end = 15, level, life, paused, onUpdateTiming }: GameHeaderProps) {
  if (variant === "progress") {
    return (
      <HeaderContainer>
        <div className="w-full h-12 flex items-center">
          <Progress className="h-[10px]" value={(level / end) * 100} />
        </div>
        <GameLifeCount life={life} />
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <div className="flex w-1/5">
        <div className="w-auto text-center">
          <p className="text-base font-normal tracking-widest">LVL</p>
          <p className="-mt-2 tracking-tighter">{level}</p>
        </div>
      </div>
      <GameTimer paused={paused} onUpdateTiming={onUpdateTiming} />
      <GameLifeCount life={life} />
    </HeaderContainer>
  );
}
