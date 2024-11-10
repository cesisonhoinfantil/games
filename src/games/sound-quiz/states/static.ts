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

const optionsKeys = Object.keys(AllOptions) as (keyof typeof AllOptions)[];

const InitialData: GameData = {
  life: 5,
  level: 1,
  difficulty: "easy",
  history: [],

  startAt: undefined,
  status: undefined,

  selected: undefined,
  correct: undefined,
  options: [],
};

export { AllOptions, conflicts, InitialData, optionsKeys };
