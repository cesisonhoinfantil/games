export type TrailLevelConfig = {
  id: number;
  type: "sound-quiz";
  config: any;
};

export const trailLevels: TrailLevelConfig[] = [
  {
    id: 1,
    type: "sound-quiz",
    config: { maxLevel: 5, difficulty: "easy" },
  },
  {
    id: 2,
    type: "sound-quiz",
    config: { maxLevel: 10, difficulty: "medium" },
  },
  {
    id: 3,
    type: "sound-quiz",
    config: { maxLevel: 15, difficulty: "hard" },
  },
];
