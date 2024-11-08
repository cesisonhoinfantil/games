import { RandomIndex, RandomItem } from "@/lib/utils";
import { create } from "zustand";
import { GameData, GameState } from "./game.interfaces";
import { AllOptions, conflicts, InitialData, optionsKeys } from "./game.static";

const useGameState = create<GameState & GameData>()((set, get) => ({
  ...InitialData,

  select(toSelect) {
    if (toSelect == null) return;
    set({ selected: toSelect });
  },
  verify() {
    const { selected, correct, options } = get();

    if (selected == null || !options?.length) return;

    if (selected === correct) {
      set({ status: "win" });
    } else {
      set({ status: "lose" });
    }
  },
  nextLevel() {
    const { status, life, level, generateLevel, history, options, correct } =
      get();

    if (!status) return;

    if (status === "win") {
      const newLevel = level + 1;

      if (newLevel == 6) set({ difficulty: "medium" });
      else if (newLevel == 10) set({ difficulty: "hard" });

      history.push(options[correct!]);

      set({ level: newLevel, history });
    } else {
      set({ life: life - 1 });
    }

    set({ status: undefined, selected: undefined });

    generateLevel();
  },
  generateLevel() {
    // TODO - add history
    const options = new Set<string>();

    while (options.size < 5) {
      const optionKey = RandomItem(optionsKeys);

      if (conflicts[optionKey]) {
        conflicts[optionKey].forEach((value) => {
          options.delete(value);
        });
      }

      options.add(optionKey);
      console.log(options);
    }

    const { history } = get();

    console.log(history[history.length - 1]);

    const optionsArr = Array.from(options);
    let correct;
    let img;

    do {
      correct = RandomIndex(optionsArr);
      const option = optionsArr[correct] as keyof typeof AllOptions;
      img = RandomItem(AllOptions[option]);
      console.log("pass");
    } while (history[history.length - 1] == optionsArr[correct]);

    set({ img, correct, options: optionsArr });
  },
  reset() {
    set({ ...InitialData });
  },
}));

export default useGameState;
