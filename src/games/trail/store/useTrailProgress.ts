import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrailState {
  levels: Record<number, number>; // levelId -> stars (0-3)
  saveProgress: (levelId: number, stars: number) => void;
  getStars: (levelId: number) => number;
}

export const useTrailProgress = create<TrailState>()(
  persist(
    (set, get) => ({
      levels: {},
      saveProgress: (levelId, stars) =>
        set((state) => {
          const currentStars = state.levels[levelId] || 0;
          if (stars > currentStars) {
            return { levels: { ...state.levels, [levelId]: stars } };
          }
          return state;
        }),
      getStars: (levelId) => {
        return get().levels[levelId] || 0;
      },
    }),
    {
      name: "cesi-trail-storage",
    }
  )
);
