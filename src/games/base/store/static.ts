import { GameBaseData, bestTiming, defaultTiming } from "./interfaces";

export const DefaultTiming: bestTiming = {
  "very easy": 0,
  easy: 0,
  medium: 0,
  hard: 0,
  "very hard": 0,
  challenge: 0,
};

const getBestTiming = (): bestTiming => {
  const item = localStorage.getItem("bestTiming");

  if (!item?.startsWith("{")) {
    localStorage.setItem("bestTiming", JSON.stringify(DefaultTiming));
    return DefaultTiming;
  }

  try {
    return JSON.parse(item!) ?? DefaultTiming;
  } catch {
    localStorage.setItem("bestTiming", JSON.stringify(DefaultTiming));
    return DefaultTiming;
  }
};

export const InitialBaseData: GameBaseData = {
  config: {
    maxLevel: 15,
    maxLife: 5,
  },
  started: false,

  life: 5,
  level: 1,
  difficulty: "very easy",

  status: undefined,

  paused: false,
  timing: 0,
  bestTiming: getBestTiming(),

  score: 0,
  errors: 0,
};
