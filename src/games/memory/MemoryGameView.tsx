import { GameEndModal } from "@/games/base/components/GameEndModal";
import { GameHeader } from "@/games/base/components/GameHeader";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { MemoryCard } from "./components/MemoryCard";
import { useMemoryLogic } from "./hooks/useMemoryLogic";
import { useMemoryStore } from "./stores/useMemoryStore";

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
    if (started && cards.length === 0 && life > 0 && status !== "lose") {
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

  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined"
      ? window.innerWidth > window.innerHeight
      : false,
  );

  useEffect(() => {
    const handleResize = () =>
      setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridClass = useMemo(() => {
    if (isLandscape) {
      if (cards.length <= 6) return "grid-cols-3"; // 2 rows
      if (cards.length === 8) return "grid-cols-4"; // 2 rows
      if (cards.length === 12) return "grid-cols-6"; // 2 rows
      if (cards.length === 16) return "grid-cols-8"; // 2 rows
      return "grid-cols-8";
    } else {
      if (cards.length <= 6) return "grid-cols-2"; // 3 rows
      if (cards.length === 8) return "grid-cols-2"; // 4 rows
      if (cards.length === 12) return "grid-cols-3"; // 4 rows
      if (cards.length === 16) return "grid-cols-4"; // 4 rows
      return "grid-cols-4";
    }
  }, [cards.length, isLandscape]);

  return (
    <div className="h-full w-full bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content] overflow-hidden">
      <GameHeader
        level={level}
        life={life}
        paused={paused}
        onUpdateTiming={updateTiming}
      />

      <div className="flex flex-col flex-1 py-4 overflow-hidden items-center justify-center pointer-events-none">
        <div
          className={cn(
            "grid gap-2 sm:gap-4 w-full max-w-5xl px-2 sm:px-4 pointer-events-auto",
            gridClass,
          )}
        >
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => flipCard(card.id)}
              disabled={
                selectedCards.length >= 2 || paused || status !== undefined || useMemoryStore.getState().isRevealing
              }
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
