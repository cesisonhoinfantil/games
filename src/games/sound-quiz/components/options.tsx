import Button from "@/components/animata/button/duolingo";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import useGameState from "../states";

export function Options() {
  const selected = useGameState((state) => state.selected);
  const options = useGameState((state) => state.options);

  const Select = useCallback((ButtonIndex: number) => {
    if (ButtonIndex == null) return console.error("No button index ?");
    useGameState.getState().select(ButtonIndex);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 gap-y-4 pt-6 w-4/5 m-auto items-center">
      {options.map((value, index) => (
        <Button
          variants={selected == index ? "white" : "default"}
          onClick={() => Select(index)}
          affect={"py-3"}
          className={cn(index >= 4 && "col-span-2 justify-self-center w-1/2")}
          key={nanoid()}
        >
          <span className="text-2xl flex justify-center">{value}</span>
        </Button>
      ))}
    </div>
  );
}
