import { RandomIndex, RandomItem } from "@/lib/utils";
import { StateCreator } from "zustand";
import { GameData, GameState } from "./interfaces";
import {
  AllOptions,
  AltsExtraInfos,
  conflicts,
  optionsKeys,
} from "./static";
import { createBaseMethods } from "@/games/base/store/methods";

const createMethods: StateCreator<GameData & GameState, [], [], GameState> = (
  set,
  get,
  api
) => ({
  ...createBaseMethods<GameData & GameState>()(set, get, api),
  
  select(toSelect) {
    if (toSelect == null) return;
    set({ selected: toSelect });
  },
  verify() {
    const { selected, correct, options, history } = get();

    if (selected == null || !options?.length) return;

    if (selected === correct) {
      history.push(options[correct!]);
      set({ status: "win", history });
    } else {
      set({ status: "lose" });
    }
  },
  generateLevel() {
    const options = new Set<string>();

    while (options.size < 5) {
      const optionKey = RandomItem(optionsKeys);

      if (conflicts[optionKey]) {
        conflicts[optionKey].forEach((value) => {
          options.delete(value);
        });
      }

      options.add(optionKey);
    }

    const { history } = get();

    const optionsArr = Array.from(options);
    const optionsImg = optionsArr.map(
      (option) => AllOptions[option as keyof typeof AllOptions][0]
    );
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
    } while (history[history.length - 1] == optionsArr[correct]);

    optionsImg[correct] = img;

    if ((imageIndex > 0 || option === "Ç") && option in AltsExtraInfos) {
      extraInfo = AltsExtraInfos[option];
    }

    set({
      img,
      correct,
      options: optionsArr,
      imgOptions: optionsImg,
      extraInfo,
      selected: undefined,
    });
  },
  resetGame() {
    set({ history: [], extraInfo: undefined, selected: undefined, correct: undefined, options: [], imgOptions: [] });
  }
});

export default createMethods;
