import { GameEndModal } from "@/games/base/components/GameEndModal";
import { GameHeader } from "@/games/base/components/GameHeader";
import { useEffect, useMemo } from "react";
import { useMemoryStore } from "./stores/useMemoryStore";
import { useMemoryLogic } from "./hooks/useMemoryLogic";
import { MemoryCard } from "./components/MemoryCard";
import { cn } from "@/lib/utils";

export function MemoryGameView({ trailMode, onTrailFinish }: any) {
  const {
    cards,
    selectedCards,
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
    flipCard,
  } = useMemoryStore();
  
  const { generateCards } = useMemoryLogic();

  useEffect(() => {
    if (started && cards.length === 0 && life > 0 && status !== 'lose') {
      generateCards();
    }
  }, [started, cards.length, life, status, generateCards]);

  useEffect(() => {
    if (life <= 0 && status !== "lose") {
      useMemoryStore.setState({ status: "lose" });
      setTimeout(() => {
        nextLevel();
      }, 1000);
    }
  }, [life, status, nextLevel]);

  useEffect(() => {
    if (
      cards.length > 0 &&
      cards.every((c) => c.matched || c.success) &&
      status !== "win"
    ) {
      verify?.();
    }
  }, [cards, status, verify]);

  const handleReset = () => {
    pause();
    reset();
    start();
  };

  const handleStop = () => {
    stop();
    reset();
    resetConfig();
  };

  // Determine grid columns based on card count
  const gridClass = useMemo(() => {
    if (cards.length <= 6) return "grid-cols-2 md:grid-cols-3";
    if (cards.length <= 8) return "grid-cols-2 md:grid-cols-4";
    if (cards.length <= 12) return "grid-cols-3 md:grid-cols-4";
    return "grid-cols-4";
  }, [cards.length]);

  return (
    <div className="h-full w-full bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content] overflow-hidden">
      <GameHeader
        level={level}
        life={life}
        paused={paused}
        onUpdateTiming={updateTiming}
      />

      <div className="flex flex-col flex-1 pt-4 pb-4 overflow-hidden items-center justify-center pointer-events-none">
        <div className={cn("grid gap-4 w-full max-w-2xl px-4 pointer-events-auto", gridClass)}>
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => flipCard(card.id)}
              disabled={selectedCards.length >= 2 || paused || status !== undefined}
            />
          ))}
        </div>
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
