import { useEffect, useState } from "react";
export function Timer() {
  const [Time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((state) => state + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {("0" + Math.floor((Time / 60) % 60)).slice(-2)}:
      {("0" + Math.floor(Time % 60)).slice(-2)}
    </div>
  );
}
