import useGameState from "@/games/sound-quiz/states";
import { formatTimer } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function Timer() {
  const paused = useGameState((state) => state.paused);
  const [Time, setTime] = useState(0);
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (paused && interval.current) {
      clearInterval(interval.current);
      setTime(0);
    } else {
      interval.current = setInterval(() => {
        setTime((state) => state + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [paused]);

  useEffect(() => {
    if (Time) {
      useGameState.getState().updateTiming(Time);
    }
  }, [Time]);

  return <div>{formatTimer(Time)}</div>;
}
