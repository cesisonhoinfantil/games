import Button from "@/components/animata/button/duolingo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useGameState from "@/games/sound-quiz/states";
import { cn, formatTimer } from "@/lib/utils";
import { Check, Clock, LucideProps, TimerIcon, X } from "lucide-react";
import { ReactNode } from "react";

const messages = {
  win: ["🎉 Parabéns, você conseguiu! 🎉"],
  lose: [
    "😯 Não foi dessa vez... 😯",
    "😴 IIhhh, Você precisa de mais atenção! 💤",
    "📖 Você precisa estudar mais! 📖",
  ],
};

const imgs = {
  win: ["E", "O"],
  lose: ["I", "A2"],
};

type ScoreViewProps = {
  children: ReactNode;
  title: string;
  Icon: React.JSXElementConstructor<LucideProps>;
  className?: string;
};

function ScoreView({ children, title, Icon, className }: ScoreViewProps) {
  return (
    <div className="w-full flex justify-between">
      <span className="inline-flex items-center justify-center gap-1">
        <Icon className="size-4 mt-[3px]" /> {title}
      </span>
      <strong className={cn("text-center min-w-12", className)}>
        {children}
      </strong>
    </div>
  );
}

export function EndGameModal() {
  const status = useGameState((state) => state.status ?? "lose");
  const paused = useGameState((state) => state.paused);

  const timing = useGameState((state) => state.timing);
  const bestTiming = useGameState((state) => state.bestTiming);
  const score = useGameState((state) => state.score);
  const errors = useGameState((state) => state.errors);

  const getImg = () => {
    const index = Math.floor(Math.random() * imgs[status].length);
    const img = imgs[status][index];
    return `/onomatopeias/png/${img}.png`;
  };

  const getMsg = () => {
    const index = Math.floor(Math.random() * messages[status].length);
    return messages[status][index];
  };

  const reset = () => {
    const { pause, reset, generateLevel } = useGameState.getState();

    pause();
    reset();
    generateLevel();
  };

  return (
    <Dialog open={paused}>
      <DialogContent className="flex flex-col items-center [&>button]:hidden">
        <img
          src={getImg()}
          className="max-h-40 motion-preset-pulse-sm motion-duration-1500"
        />

        <span className="text-xl font-bold text-center">{getMsg()}</span>

        <div className="w-full px-4 flex flex-col items-center gap-1 text-lg">
          <ScoreView Icon={Clock} title="Seu tempo foi de">
            {formatTimer(timing)}
          </ScoreView>
          <ScoreView Icon={TimerIcon} title="Seu melhor tempo foi de">
            {bestTiming ? formatTimer(bestTiming) : "-"}
          </ScoreView>
          <ScoreView
            Icon={Check}
            title="Você acertou:"
            className="text-emerald-400"
          >
            {score}
          </ScoreView>
          <ScoreView Icon={X} title="Você errou:" className="text-destructive">
            {errors}
          </ScoreView>
        </div>

        <Button className="w-full" onClick={reset}>
          REINICIAR
        </Button>
      </DialogContent>
    </Dialog>
  );
}
