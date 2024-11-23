import { Progress } from "@/components/ui/progress";
import useGameState from "../../states";
import { HeaderContainer } from "./container";
import { LifeCount } from "./life";
import { Timer } from "./timer";

interface HeaderProps {
  variant?: "endless" | "progress";
  end?: number;
}

export function Header({ variant = "endless", end = 15 }: HeaderProps) {
  const level = useGameState((state) => state.level);

  if (variant === "progress") {
    return (
      <HeaderContainer>
        <div className="w-full h-12 flex items-center">
          <Progress className="h-[10px]" value={(level / end) * 100} />
        </div>
        <LifeCount />
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
      <Timer />
      <LifeCount />
    </HeaderContainer>
  );
}
