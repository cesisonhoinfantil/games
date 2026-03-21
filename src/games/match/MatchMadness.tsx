import { useEffect, useState } from "react";
import { useMatchStore } from "./stores/useMatchStore";
import { useMatchLogic } from "./hooks/useMatchLogic";
import { MatchBoard } from "./components/MatchBoard";
import { GameEndModal } from "@/games/base/components/GameEndModal";
import { Timer, X } from "lucide-react";
import { formatTimer } from "@/lib/utils";

export function MatchMadness({ trailMode, onTrailFinish }: any) {
  const { 
    itemsA, itemsB, score, errors, reset, start, stop, pause, getBestTiming, resetConfig, updateTiming 
  } = useMatchStore();
  
  const { generatePairs, replaceMatched } = useMatchLogic(5);
  const [timeRemaining, setTimeRemaining] = useState(105); // 1m45s

  const [recentSlots, setRecentSlots] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (itemsA.length === 0 && score === 0) {
      generatePairs();
    }
    start();
  }, [generatePairs, itemsA.length, score, start]);

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

  const matchedIndicesStr = itemsA
    .map((item, index) => (item.matched ? index : -1))
    .filter((i) => i !== -1)
    .join(",");

  useEffect(() => {
    if (!matchedIndicesStr) return;

    const matchedIndices = matchedIndicesStr.split(",").map(Number);
    const hasNewSlot = matchedIndices.some((idx) => !recentSlots.includes(idx));

    let timeoutDuration = 0;

    if (hasNewSlot) {
      // If we are clearing multiple items at once (variety reward)
      if (matchedIndices.length > 1) {
        timeoutDuration = 100;
      } else {
        timeoutDuration = 200;
      }
    } else {
      // User is ping-ponging or repeating the same slots
      timeoutDuration = 800 + (streak + 1) * 1500;
    }

    const timeout = setTimeout(() => {
      const matchedIndices = matchedIndicesStr.split(",").map(Number);
      
      // 1. Identify which PAIR IDs are being replaced
      const pairIdsToReplace = matchedIndices.map(idx => itemsA[idx].pairId);

      if (!hasNewSlot) {
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
        const newSlot = matchedIndices.find((idx) => !recentSlots.includes(idx)) ?? matchedIndices[0];
        setRecentSlots((prev) => {
          const updated = [newSlot, ...prev.filter(idx => idx !== newSlot)];
          return updated.slice(0, 2);
        });
      }
      
      // 2. Perform replacement
      replaceMatched();

      // 3. Find the NEW item IDs that replaced the old ones
      // We need to wait a tick or use the state after replaceMatched
      setTimeout(() => {
        const state = useMatchStore.getState();
        const newIdsToUnlock: string[] = [];
        
        state.itemsA.forEach(item => {
          if (pairIdsToReplace.includes(item.pairId) || item.loading) {
            newIdsToUnlock.push(item.id);
          }
        });
        state.itemsB.forEach(item => {
          if (pairIdsToReplace.includes(item.pairId) || item.loading) {
            newIdsToUnlock.push(item.id);
          }
        });

        if (newIdsToUnlock.length > 0) {
          state.setItemsLoading(newIdsToUnlock, false);
        }
      }, 1000);

    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [matchedIndicesStr, recentSlots, streak, replaceMatched, itemsA, itemsB]);

  const handleReset = () => {
    pause();
    reset();
    setTimeRemaining(105);
    setRecentSlots([]);
    setStreak(0);
    // Let the useEffect handle the generation when itemsA turns 0!
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
