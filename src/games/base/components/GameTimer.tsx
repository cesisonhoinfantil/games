import { formatTimer } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface GameTimerProps {
  paused: boolean;
  onUpdateTiming: (time: number) => void;
}

export function GameTimer({ paused, onUpdateTiming }: GameTimerProps) {
  const [Time, setTime] = useState(0);
  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

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
      onUpdateTiming(Time);
    }
  }, [Time, onUpdateTiming]);

  return <div>{formatTimer(Time)}</div>;
}
