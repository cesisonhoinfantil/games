// life - amount of player life ( player ) - Number

// level - lvl 1, lvl 2... - Number
// difficulty ["easy", "medium", "hard"] - String or Number

// start-at - date started the game - Date

// status - win or lose - String or undefined

// selected - option selected - Number (index)
// correct - correct option
// options - game options

export interface GameData {
  life: number;

  level: number;
  difficulty: "very easy" | "easy" | "medium" | "hard" | "very hard";
  history: string[];
  extraInfo?: string;

  startAt?: Date;

  status?: "win" | "lose";

  paused: boolean;

  timing: number;
  bestTiming: number;

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
  select: (toSelect: number) => void;
  verify: () => void;
  nextLevel: () => void;
  generateLevel: () => void;
  reset: () => void;

  pause: () => void;
  updateTiming: (timing: number) => void;
}
