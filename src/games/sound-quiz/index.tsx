import { Menu } from "@/games/sound-quiz/menu";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ActionButton, Options } from "./components";
import useGameState from "./states";
import { GameHeader } from "@/games/base/components/GameHeader";
import { GameLevelControl } from "@/games/base/components/GameLevelControl";
import { GameEndModal } from "@/games/base/components/GameEndModal";

const titles = {
  "very easy": "Veja, escute e escolha a letra",
  easy: "Veja a figura e escolha a letra",
  medium: "Escute e escolha a letra",
  hard: "Veja a figura e escolha o som",
  "very hard": "Veja a letra e escolha o som",
};

interface SoundQuizProps {
  trailMode?: boolean;
  trailConfig?: any;
  onTrailFinish?: (score: number, errors: number) => void;
}

function SoundQuiz({ trailMode, trailConfig, onTrailFinish }: SoundQuizProps) {
  const started = useGameState((state) => state.started);
  const difficulty = useGameState((state) => state.difficulty);
  const level = useGameState((state) => state.level);
  const life = useGameState((state) => state.life);
  const paused = useGameState((state) => state.paused);
  const status = useGameState((state) => state.status);
  const selected = useGameState((state) => state.selected);
  const timing = useGameState((state) => state.timing);
  const bestTiming = useGameState((state) => state.getBestTiming(true));
  const score = useGameState((state) => state.score);
  const errors = useGameState((state) => state.errors);
  
  const setConfig = useGameState((state) => state.setConfig);
  const start = useGameState((state) => state.start);
  const updateTiming = useGameState((state) => state.updateTiming);
  const verify = useGameState((state) => state.verify);
  const nextLevel = useGameState((state) => state.nextLevel);
  const reset = useGameState((state) => state.reset);
  const stop = useGameState((state) => state.stop);
  const resetConfig = useGameState((state) => state.resetConfig);
  const generateLevel = useGameState((state) => state.generateLevel);
  const pause = useGameState((state) => state.pause);
  
  const transitionType = useSettingsStore((state) => state.transitionType);

  useEffect(() => {
    if (trailMode && trailConfig && !started) {
      setConfig({ ...trailConfig, maxLife: 3 });
      start();
    }
  }, [trailMode, trailConfig, started, setConfig, start]);

  const getTransitionClass = () => {
    switch (transitionType) {
      case "slide":
        return "motion-preset-slide-left-sm";
      case "pop":
        return "motion-preset-pop";
      case "fade":
        return "motion-preset-fade motion-preset-blur-sm";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (started) {
      useGameState.getState().generateLevel();
    }
  }, [started]);

  if (!started) {
    return <Menu />;
  }

  const handleReset = () => {
    pause();
    reset();
    generateLevel();
    start();
  };

  const handleStop = () => {
    stop();
    reset();
    resetConfig();
  };

  return (
    <div className="h-full w-full landscape:h-auto bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content] overflow-hidden">
      <GameHeader 
        level={level} 
        life={life} 
        paused={paused} 
        onUpdateTiming={updateTiming} 
      />
      <div
        key={transitionType !== "none" ? level : "static"}
        className={cn("flex flex-col flex-1", getTransitionClass())}
      >
        <h1 className="text-xl pb-6 pt-4 pl-4 text-sky-900 tracking-tight potta-one-regular">
          {titles[difficulty]}
        </h1>
        <div className="flex flex-col landscape:flex-row landscape:space-x-10 landscape:px-10 ">
          <ActionButton />
          <Options />
        </div>
      </div>
      <GameLevelControl 
        status={status}
        selected={selected}
        onVerify={verify}
        onNextLevel={nextLevel}
      />
      <GameEndModal 
        trailMode={trailMode} 
        onTrailFinish={onTrailFinish}
        status={status}
        paused={paused}
        timing={timing}
        bestTiming={bestTiming}
        score={score}
        errors={errors}
        onReset={handleReset}
        onStop={handleStop}
      />
    </div>
  );
}

export default SoundQuiz;
