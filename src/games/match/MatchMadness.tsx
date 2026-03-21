import { useEffect, useState } from "react";
import { useMatchStore } from "./stores/useMatchStore";
import { useMatchLogic } from "./hooks/useMatchLogic";
import { MatchBoard } from "./components/MatchBoard";
import { GameEndModal } from "@/games/base/components/GameEndModal";
import { Timer, X } from "lucide-react";
import { formatTimer } from "@/lib/utils";

export function MatchMadness({ trailMode, onTrailFinish }: any) {
  const { 
    itemsA, score, errors, reset, start, stop, pause, getBestTiming, resetConfig, updateTiming 
  } = useMatchStore();
  
  const { generatePairs, replaceMatched } = useMatchLogic(4);
  const [timeRemaining, setTimeRemaining] = useState(105); // 1m45s

  useEffect(() => {
    generatePairs();
    start();
  }, [generatePairs, start]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          useMatchStore.setState({ status: "lose" });
          pause();
          return 0;
        }
        return prev - 1;
      });
      updateTiming(105 - timeRemaining); 
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, updateTiming, pause]);

  useEffect(() => {
    const hasMatches = itemsA.some(i => i.matched);
    if (hasMatches) {
      setTimeout(() => {
        replaceMatched();
      }, 300);
    }
  }, [itemsA, replaceMatched]);

  const handleReset = () => {
    pause();
    reset();
    setTimeRemaining(105);
    generatePairs();
    start();
  };

  const handleStop = () => {
    stop();
    reset();
    resetConfig();
  };

  return (
    <div className="h-full w-full bg-[#ffea74] flex flex-col pt-4 overflow-hidden">
      <div className="flex justify-between items-center px-6 pb-4">
        <div className="flex items-center gap-2 font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-lg">
          <Timer className="w-5 h-5" /> {formatTimer(timeRemaining)}
        </div>
        <div className="font-bold text-orange-900 border-2 border-orange-900 px-4 py-1 rounded-full flex items-center bg-orange-200">
          Pontos: {score}
        </div>
        <button onClick={handleStop} className="text-orange-900 hover:opacity-70 ml-2"><X /></button>
      </div>
      
      <div className="flex flex-col flex-1 pt-4 overflow-y-auto">
        <MatchBoard />
      </div>

      <GameEndModal 
        trailMode={trailMode} 
        onTrailFinish={onTrailFinish}
        status={"win"} // Madness always ends in a score screen, which we can consider win or lose depending on goals, let's treat it as win for confetti and happy messages, since survival is the goal.
        paused={timeRemaining <= 0} 
        timing={105 - timeRemaining}
        bestTiming={getBestTiming(true)}
        score={score}
        errors={errors}
        onReset={handleReset}
        onStop={handleStop}
      />
    </div>
  );
}
