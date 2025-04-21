import { RandomIndex, RandomItem } from "@/lib/utils";
import { StateCreator } from "zustand";
import { bestTiming, GameData, GameState } from "./interfaces";
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
  setConfig(config) {
    set({
      config,
      life: config.maxLife,
      difficulty: config.difficulty ?? "very easy",
    });
  },
  resetConfig() {
    set({
      config: {
        maxLevel: 15,
        maxLife: 5,
      },
    });
  },
  start() {
    set({ started: true });
  },
  stop() {
    set({ started: false });
  },

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
    const { status, generateLevel, level, life, config } = get();

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

      if (!config.difficulty) {
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
      }

      history.push(options[correct!]);

      if (newLevel <= config.maxLevel) {
        set({ level: newLevel });
      }

      set({ level: newLevel, history, score: score + 1 });
    } else {
      const { life, errors } = get();
      newLife = life - 1;

      set({ life: newLife, errors: errors + 1 });
    }

    if (newLevel > config.maxLevel || newLife <= 0) {
      const { pause, timing, setBestTiming, getBestTiming } = get();

      pause();
      const currentBestTiming = getBestTiming(true);

      if (
        (!currentBestTiming || timing < currentBestTiming) &&
        newLevel > config.maxLevel
      ) {
        const key = config.difficulty ?? "challenge";
        setBestTiming(timing, key);
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
    const { bestTiming, config } = get();
    set({ ...InitialData, config: config, bestTiming, life: config.maxLife });
  },
  pause() {
    set({ paused: !get().paused });
  },
  updateTiming(timing) {
    set({ timing });
  },
  getBestTiming<T extends boolean = false>(
    current?: T
  ): T extends true ? number : bestTiming {
    const { config, bestTiming } = get();

    const key = config.difficulty ?? "challenge";

    if (current === true) {
      return bestTiming[key] as T extends true ? number : bestTiming;
    }

    const best = JSON.parse(localStorage.getItem("bestTiming")!) as bestTiming;

    return best as T extends true ? number : bestTiming;
  },
  setBestTiming(timing, key) {
    const best = get().getBestTiming(false);
    const updatedBest = { ...best, [key]: timing };

    localStorage.setItem("bestTiming", JSON.stringify(updatedBest));
    set({ bestTiming: updatedBest });
  },
});

export default createMethods;
