import { useMatchStore } from "./stores/useMatchStore";
import { MatchMenu } from "./menu";
import { MatchPairs } from "./MatchPairs";
import { MatchMadness } from "./MatchMadness";
import { useEffect } from "react";

export function MatchGame() {
  const started = useMatchStore((state) => state.started);
  const mode = useMatchStore((state) => state.mode);
  const reset = useMatchStore((state) => state.reset);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (!started) {
    return <MatchMenu />;
  }

  if (mode === "pairs") {
    return <MatchPairs />;
  }

  if (mode === "madness") {
    return <MatchMadness />;
  }

  return null;
}

export default MatchGame;
