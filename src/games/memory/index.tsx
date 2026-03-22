import { MemoryMenu } from "./menu";
import { MemoryGameView } from "./MemoryGameView";
import { useMemoryStore } from "./stores/useMemoryStore";
import { useEffect } from "react";

export function MemoryGame() {
  const started = useMemoryStore((state) => state.started);
  const reset = useMemoryStore((state) => state.reset);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (!started) {
    return <MemoryMenu />;
  }

  return <MemoryGameView />;
}

export default MemoryGame;
