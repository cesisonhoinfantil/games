export type difficulty = "very easy" | "easy" | "medium" | "hard" | "very hard";

export type bestTiming = {
  "very easy": number;
  easy: number;
  medium: number;
  hard: number;
  "very hard": number;
  challenge: number;
};

export type GameBaseConfig = {
  difficulty?: difficulty;
  difficultyProgression?: Record<number, difficulty>;
  maxLevel: number;
  maxLife: number;
};

export interface GameBaseData {
  config: GameBaseConfig;
  started: boolean;

  life: number;

  level: number;
  difficulty: difficulty;

  status?: "win" | "lose";

  paused: boolean;

  timing: number;
  bestTiming: bestTiming;

  score: number;
  errors: number;
}

export interface GameBaseActions {
  setConfig: (config: GameBaseConfig) => void;
  resetConfig: () => void;
  start: () => void;
  stop: () => void;
  
  // Game specific (to be implemented by the game slice)
  verify?: () => void;
  generateLevel?: () => void;
  resetGame?: () => void; // specific reset

  // Base actions
  nextLevel: () => void;
  reset: () => void;

  pause: () => void;
  updateTiming: (timing: number) => void;
  getBestTiming: <T extends boolean = false>(
    current?: T
  ) => T extends true ? number : bestTiming;

  setBestTiming: (timing: number, key: keyof bestTiming) => void;
}

export type BaseGameState = GameBaseData & GameBaseActions;
