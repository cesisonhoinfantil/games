// life - amount of player life ( player ) - Number

// level - lvl 1, lvl 2... - Number
// difficulty ["easy", "medium", "hard"] - String or Number

// start-at - date started the game - Date

// status - win or lose - String or undefined

// selected - option selected - Number (index)
// correct - correct option
// options - game options

type difficulty = "very easy" | "easy" | "medium" | "hard" | "very hard";

export type bestTiming = {
  "very easy": number;
  easy: number;
  medium: number;
  hard: number;
  "very hard": number;
  challenge: number;
};

export type GameDataConfig = {
  difficulty?: difficulty;
  maxLevel: number;
  maxLife: number;
};

export interface GameData {
  config: GameDataConfig;
  started: boolean;

  life: number;

  level: number;
  difficulty: difficulty;
  history: string[];
  extraInfo?: string;

  startAt?: Date;

  status?: "win" | "lose";

  paused: boolean;

  timing: number;
  bestTiming: bestTiming;

  score: number;
  errors: number;

  selected?: number;
  correct?: number;
  img?: string;
  options: string[];
  imgOptions: string[];
}

// select() - select a option
// verify() - check selected is the corrected option
// nextLevel() - update [level, difficulty...] and clean [status, select]
// generateLevel() = generate lvl data [options]
// reset() - go back to lvl 1 and restart

export interface GameState {
  setConfig: (config: GameDataConfig) => void;
  resetConfig: () => void;
  start: () => void;
  stop: () => void;

  select: (toSelect: number) => void;
  verify: () => void;
  nextLevel: () => void;
  generateLevel: () => void;
  reset: () => void;

  pause: () => void;
  updateTiming: (timing: number) => void;
  getBestTiming: <T extends boolean = false>(
    current?: T
  ) => T extends true ? number : bestTiming;

  setBestTiming: (timing: number, key: keyof bestTiming) => void;
}
