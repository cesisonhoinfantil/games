import Button from "@/components/animata/button/duolingo";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import useGameState from "../states";

export function Options() {
  const selected = useGameState((state) => state.selected);
  const options = useGameState((state) => state.options);
  const status = useGameState((state) => state.status);

  const Select = useCallback((ButtonIndex: number) => {
    if (ButtonIndex == null) return console.error("No button index ?");
    useGameState.getState().select(ButtonIndex);
  }, []);

  const SelectVariant = useCallback(
    (index: number) => {
      const correct = useGameState.getState().correct;
      const isCorrect = correct === index;
      const isSelected = selected === index;

      if ((status == "win" && isSelected) || (status == "lose" && isCorrect)) {
        return "success";
      }

      if (status == "lose" && isSelected) {
        return "error";
      }

      if (isSelected || (status && !isSelected)) {
        return "white";
      }
      return "default";
    },
    [selected, status]
  );

  const GenerateClassName = useCallback(
    (index: number) => {
      const className = [];
      if (index >= 4) {
        className.push("col-span-2 justify-self-center w-1/2");
      }
      if (status === "win" && selected === index) {
        className.push("motion-preset-confetti motion-duration-1000");
      }
      if (status === "lose" && selected === index) {
        className.push("motion-preset-shake");
      }
      return cn(...className);
    },
    [selected, status]
  );

  return (
    <div className="grid grid-cols-2 gap-2 gap-y-4 pt-6 w-4/5 m-auto items-center landscape:pt-0">
      {options.map((value, index) => (
        <Button
          variants={SelectVariant(index)}
          onClick={() => Select(index)}
          affect={"py-3 disabled:opacity-45"}
          className={GenerateClassName(index)}
          key={nanoid()}
          disabled={status && selected !== index}
        >
          <span className="text-2xl flex justify-center">{value}</span>
        </Button>
      ))}
    </div>
  );
}
