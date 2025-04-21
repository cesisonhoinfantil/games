import { GameData } from "./interfaces";

const AllOptions = {
  A: ["A", "A2"],
  B: ["B"],
  C: ["C", "S"],
  D: ["D"],
  E: ["E", "E2"],
  F: ["F"],
  G: ["G", "J"],
  H: ["H"],
  I: ["I"],
  J: ["J"],
  K: ["C"],
  L: ["L"],
  M: ["M"],
  N: ["N"],
  O: ["O", "O2"],
  P: ["P"],
  Q: ["Q"],
  R: ["R", "RR"],
  S: ["S"], // S -> Z
  T: ["T"],
  U: ["U"],
  V: ["V"],
  W: ["U", "V"],
  X: ["X"],
  Y: ["I"],
  Z: ["Z"],

  Ç: ["S"],
  CH: ["X"],

  LH: ["LH"],
  NH: ["NH"],
  ÃO: ["AO"],
};

const conflicts = {
  Ç: ["S", "C"],
  S: ["Ç", "C"],
  C: ["S", "Q", "K", "Ç"],
  Q: ["C"],
  K: ["C"],

  X: ["CH"],
  CH: ["X"],

  I: ["Y"],
  Y: ["I"],

  W: ["U", "V"],
  U: ["W"],
  V: ["W"],

  G: ["J"],
  J: ["G"],
} as Record<string, string[]>;

const AltsExtraInfos = {
  C: "E - I",
  Ç: "A - O - U",
  G: "E - I",
} as Record<string, string>;

const optionsKeys = Object.keys(AllOptions) as (keyof typeof AllOptions)[];

export const defaultTiming = {
  "very easy": 0,
  easy: 0,
  medium: 0,
  hard: 0,
  "very hard": 0,
  challenge: 0,
};

const bestTiming = () => {
  const item = localStorage.getItem("bestTiming");

  if (!item?.startsWith("{")) {
    localStorage.setItem("bestTiming", JSON.stringify(defaultTiming));
    return defaultTiming;
  }

  try {
    return JSON.parse(item!) ?? defaultTiming;
  } catch {
    localStorage.setItem("bestTiming", JSON.stringify({}));
  }
};

const InitialData: GameData = {
  config: {
    maxLevel: 15,
    maxLife: 5,
  },
  started: false,

  life: 5,
  level: 1,
  difficulty: "very easy",
  history: [],
  extraInfo: undefined,

  startAt: undefined,
  status: undefined,

  paused: false,
  timing: 0,
  bestTiming: bestTiming(),

  score: 0,
  errors: 0,

  selected: undefined,
  correct: undefined,
  options: [],
  imgOptions: [],
};

export { AllOptions, AltsExtraInfos, conflicts, InitialData, optionsKeys };
