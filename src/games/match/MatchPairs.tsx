import { GameEndModal } from "@/games/base/components/GameEndModal";
import { GameHeader } from "@/games/base/components/GameHeader";
import { GameLevelControl } from "@/games/base/components/GameLevelControl";
import { useEffect } from "react";
import { MatchBoard } from "./components/MatchBoard";
import { useMatchLogic } from "./hooks/useMatchLogic";
import { useMatchStore } from "./stores/useMatchStore";

export function MatchPairs({ trailMode, onTrailFinish }: any) {
  const {
    itemsA,
    life,
    level,
    status,
    timing,
    score,
    errors,
    paused,
    started,
    reset,
    start,
    stop,
    pause,
    nextLevel,
    resetConfig,
    updateTiming,
    verify,
    getBestTiming,
  } = useMatchStore();
  const { generatePairs } = useMatchLogic(4);

  // Generate pairs only when game fully starts / restarts
  useEffect(() => {
    if (started && itemsA.length === 0 && life > 0 && status !== 'lose') {
      generatePairs();
    }
  }, [started, itemsA.length, life, status, generatePairs]);

  useEffect(() => {
    if (life <= 0 && status !== "lose") {
      useMatchStore.setState({ status: "lose" });
      setTimeout(() => {
        nextLevel(); // triggers pause and end modal
      }, 1000);
    }
  }, [life, status, nextLevel]);

  useEffect(() => {
    if (
      itemsA.length > 0 &&
      itemsA.every((i) => i.matched || i.success) &&
      status !== "win"
    ) {
      verify?.();
    }
  }, [itemsA, status, verify]);

  const handleReset = () => {
    pause();
    reset(); // triggers resetGame automatically making itemsA length 0
    start();
  };

  const handleStop = () => {
    stop();
    reset();
    resetConfig();
  };

  const handleNextLevel = () => {
    useMatchStore.getState().resetGame?.(); 
    nextLevel();
    generatePairs();
  };

  return (
    <div className="h-full w-full bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content] overflow-hidden">
      <GameHeader
        level={level}
        life={life}
        paused={paused}
        onUpdateTiming={updateTiming}
      />

      <div className="flex flex-col flex-1 pt-4 overflow-hidden">
        <MatchBoard />
      </div>

      <div className="min-h-[104px]">
        <GameLevelControl
          status={status}
          selected={status ? "ready" : null}
          onVerify={() => {}}
          onNextLevel={handleNextLevel}
        />
      </div>

      <GameEndModal
        trailMode={trailMode}
        onTrailFinish={onTrailFinish}
        status={status}
        paused={paused}
        timing={timing}
        bestTiming={getBestTiming(true)}
        score={score}
        errors={errors}
        onReset={handleReset}
        onStop={handleStop}
      />
    </div>
  );
}
