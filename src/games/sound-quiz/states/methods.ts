import { RandomIndex, RandomItem } from "@/lib/utils";
import { StateCreator } from "zustand";
import { GameData, GameState } from "./interfaces";
import {
  AllOptions,
  AltsExtraInfos,
  conflicts,
  InitialData,
  optionsKeys,
} from "./static";

const createMethods: StateCreator<GameData & GameState, [], [], GameState> = (
  set,
  get
) => ({
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
    let option;
    let imageIndex;
    let extraInfo = "";

    do {
      correct = RandomIndex(optionsArr);
      option = optionsArr[correct] as keyof typeof AllOptions;
      imageIndex = RandomIndex(AllOptions[option]);
      img = AllOptions[option][imageIndex];
      console.log("pass");
    } while (history[history.length - 1] == optionsArr[correct]);

    if (imageIndex > 0 && option in AltsExtraInfos) {
      extraInfo = AltsExtraInfos[option];
    }

    set({ img, correct, options: optionsArr, extraInfo });
  },
  reset() {
    set({ ...InitialData });
  },
});

export default createMethods;
