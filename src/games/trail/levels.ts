export type TrailLevelConfig = {
  id: number;
  type: "sound-quiz";
  config: any;
};

export const trailLevels: TrailLevelConfig[] = [
  // --- FASE 1: Introdução (Som, figura e letra) ---
  {
    id: 1,
    type: "sound-quiz",
    config: { maxLevel: 3, maxLife: 5, difficulty: "very easy" },
  },
  {
    id: 2,
    type: "sound-quiz",
    config: { maxLevel: 5, maxLife: 5, difficulty: "very easy" },
  },
  {
    id: 3,
    type: "sound-quiz",
    config: { maxLevel: 7, maxLife: 5, difficulty: "very easy" },
  },

  // --- TRANSIÇÃO 1 (Desafio): Desmame do Som ---
  {
    id: 4,
    type: "sound-quiz",
    config: {
      maxLevel: 6,
      maxLife: 3,
      difficultyProgression: {
        1: "very easy", // Questões 1 a 3
        4: "easy",      // Questões 4 a 6
      },
    },
  },

  // --- FASE 2: Associação Visual (Figura e letra) ---
  {
    id: 5,
    type: "sound-quiz",
    config: { maxLevel: 4, maxLife: 4, difficulty: "easy" },
  },
  {
    id: 6,
    type: "sound-quiz",
    config: { maxLevel: 6, maxLife: 4, difficulty: "easy" },
  },
  {
    id: 7,
    type: "sound-quiz",
    config: { maxLevel: 8, maxLife: 4, difficulty: "easy" },
  },

  // --- TRANSIÇÃO 2 (Desafio): Focando na Audição ---
  {
    id: 8,
    type: "sound-quiz",
    config: {
      maxLevel: 8,
      maxLife: 3,
      difficultyProgression: {
        1: "easy",    // Questões 1 a 4
        5: "medium",  // Questões 5 a 8
      },
    },
  },

  // --- FASE 3: Associação Auditiva (Som e letra) ---
  {
    id: 9,
    type: "sound-quiz",
    config: { maxLevel: 5, maxLife: 3, difficulty: "medium" },
  },
  {
    id: 10,
    type: "sound-quiz",
    config: { maxLevel: 7, maxLife: 3, difficulty: "medium" },
  },
  {
    id: 11,
    type: "sound-quiz",
    config: { maxLevel: 9, maxLife: 3, difficulty: "medium" },
  },

  // --- TRANSIÇÃO 3 (Desafio): Inversão de Lógica ---
  {
    id: 12,
    type: "sound-quiz",
    config: {
      maxLevel: 8,
      maxLife: 3,
      difficultyProgression: {
        1: "medium", // Questões 1 a 4
        5: "hard",   // Questões 5 a 8
      },
    },
  },

  // --- FASE 4: Inversão Visual (Figura e sons) ---
  {
    id: 13,
    type: "sound-quiz",
    config: { maxLevel: 5, maxLife: 3, difficulty: "hard" },
  },
  {
    id: 14,
    type: "sound-quiz",
    config: { maxLevel: 8, maxLife: 3, difficulty: "hard" },
  },
  {
    id: 15,
    type: "sound-quiz",
    config: { maxLevel: 10, maxLife: 3, difficulty: "hard" },
  },

  // --- TRANSIÇÃO 4 (Desafio): Abstração Total ---
  {
    id: 16,
    type: "sound-quiz",
    config: {
      maxLevel: 10,
      maxLife: 3,
      difficultyProgression: {
        1: "hard",      // Questões 1 a 5
        6: "very hard", // Questões 6 a 10
      },
    },
  },

  // --- FASE 5: Leitura Abstrata (Letra e sons) ---
  {
    id: 17,
    type: "sound-quiz",
    config: { maxLevel: 6, maxLife: 3, difficulty: "very hard" },
  },
  {
    id: 18,
    type: "sound-quiz",
    config: { maxLevel: 9, maxLife: 3, difficulty: "very hard" },
  },
  {
    id: 19,
    type: "sound-quiz",
    config: { maxLevel: 12, maxLife: 3, difficulty: "very hard" },
  },

  // --- DESAFIO FINAL: Domínio Completo ---
  {
    id: 20,
    type: "sound-quiz",
    config: {
      maxLevel: 15,
      maxLife: 5,
      difficultyProgression: {
        1: "very easy",
        4: "easy",
        7: "medium",
        10: "hard",
        13: "very hard"
      },
    },
  },
];
