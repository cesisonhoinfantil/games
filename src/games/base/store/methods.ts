import { StateCreator } from "zustand";
import { BaseGameState, bestTiming } from "./interfaces";
import { InitialBaseData } from "./static";

export const createBaseMethods = <T extends BaseGameState>(): StateCreator<T, [], [], BaseGameState> => (set, get) => ({
  setConfig: (config) => {
    set({
      config,
      life: config.maxLife,
      difficulty: config.difficulty ?? "very easy",
    } as unknown as Partial<T>);
  },
  resetConfig: () => {
    set({
      config: {
        maxLevel: 15,
        maxLife: 5,
      },
    } as unknown as Partial<T>);
  },
  start: () => {
    set({ started: true } as unknown as Partial<T>);
  },
  stop: () => {
    set({ started: false } as unknown as Partial<T>);
  },
  nextLevel: () => {
    const state = get();
    if (!state.status) return;

    let newLevel = state.level;
    let newLife = state.life;

    if (state.status === "win") {
      newLevel = state.level + 1;
      
      // Handle difficulty progression
      if (state.config.difficultyProgression) {
        const nextDifficulty = state.config.difficultyProgression[newLevel];
        if (nextDifficulty) {
          set({ difficulty: nextDifficulty } as unknown as Partial<T>);
        }
      } else if (!state.config.difficulty) {
        switch (newLevel) {
          case 4:
            set({ difficulty: "easy" } as unknown as Partial<T>);
            break;
          case 7:
            set({ difficulty: "medium" } as unknown as Partial<T>);
            break;
          case 10:
            set({ difficulty: "hard" } as unknown as Partial<T>);
            break;
          case 13:
            set({ difficulty: "very hard" } as unknown as Partial<T>);
            break;
        }
      }

      if (newLevel <= state.config.maxLevel) {
          set({ level: newLevel } as unknown as Partial<T>);
      }
      set({ level: newLevel, score: state.score + 1 } as unknown as Partial<T>);
    } else {
      newLife = state.life - 1;
      set({ life: newLife, errors: state.errors + 1 } as unknown as Partial<T>);
    }

    if (newLevel > state.config.maxLevel || newLife <= 0) {
      state.pause();
      const currentBestTiming = state.getBestTiming(true);

      if (
        (!currentBestTiming || state.timing < currentBestTiming) &&
        newLevel > state.config.maxLevel
      ) {
        const key = state.config.difficulty ?? "challenge";
        state.setBestTiming(state.timing, key);
      }
      return;
    }

    set({ status: undefined } as unknown as Partial<T>);

    if (state.generateLevel) {
      state.generateLevel();
    }
  },
  reset: () => {
    const state = get();
    set({
      ...InitialBaseData,
      config: state.config,
      bestTiming: state.bestTiming,
      life: state.config.maxLife,
    } as unknown as Partial<T>);

    if (state.resetGame) {
      state.resetGame();
    }
  },
  pause: () => {
    set({ paused: !get().paused } as unknown as Partial<T>);
  },
  updateTiming: (timing) => {
    set({ timing } as unknown as Partial<T>);
  },
  getBestTiming: <K extends boolean = false>(current?: K): K extends true ? number : bestTiming => {
    const state = get();
    const key = state.config.difficulty ?? "challenge";

    if (current === true) {
      return state.bestTiming[key] as K extends true ? number : bestTiming;
    }

    const item = localStorage.getItem("bestTiming");
    if (item) {
        try {
            return JSON.parse(item) as K extends true ? number : bestTiming;
        } catch {
            return state.bestTiming as K extends true ? number : bestTiming;
        }
    }
    
    return state.bestTiming as K extends true ? number : bestTiming;
  },
  setBestTiming: (timing, key) => {
    const state = get();
    const best = state.getBestTiming(false);
    const updatedBest = { ...best, [key]: timing };

    localStorage.setItem("bestTiming", JSON.stringify(updatedBest));
    set({ bestTiming: updatedBest } as unknown as Partial<T>);
  },
});
