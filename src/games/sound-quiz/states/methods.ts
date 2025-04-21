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
    const { status, generateLevel, level, life } = get();

    if (!status) return;

    let newLevel = level;
    let newLife = life;

    if (status === "win") {
      const { history, score, options, correct } = get();

      newLevel = level + 1;

      // very easy - 1 - 3
      // easy - 4 - 6
      // medium - 7 - 9
      // hard - 10 - 12
      // very hard - 13 - 15

      console.log(newLevel);

      switch (newLevel) {
        case 4:
          set({ difficulty: "easy" });
          break;
        case 7:
          set({ difficulty: "medium" });
          break;
        case 10:
          set({ difficulty: "hard" });
          break;
        case 13:
          set({ difficulty: "very hard" });
          break;
      }

      history.push(options[correct!]);

      if (newLevel <= 15) {
        set({ level: newLevel });
      }

      set({ level: newLevel, history, score: score + 1 });
    } else {
      const { life, errors } = get();
      newLife = life - 1;

      set({ life: newLife, errors: errors + 1 });
    }

    if (newLevel > 15 || newLife <= 0) {
      const { pause, timing, bestTiming } = get();
      pause();
      console.log(timing, bestTiming, newLevel);
      if ((!bestTiming || timing < bestTiming) && newLevel > 15) {
        localStorage.setItem("bestTiming", timing.toString());
        set({ bestTiming: timing });
      }
      return;
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
      console.log("pass");
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
    });
  },
  reset() {
    const { bestTiming } = get();
    set({ ...InitialData, bestTiming });
  },
  pause() {
    set({ paused: !get().paused });
  },
  updateTiming(timing) {
    set({ timing });
  },
});

export default createMethods;
