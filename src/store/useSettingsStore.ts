import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface SettingsState {
  zoomPrevention: boolean;
  profileSeed: string;
  toggleZoomPrevention: () => void;
  setZoomPrevention: (value: boolean) => void;
  generateNewProfile: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      zoomPrevention: true, // vindo habilitado para desabilitar o zoom
      profileSeed: nanoid(),
      toggleZoomPrevention: () =>
        set((state) => ({ zoomPrevention: !state.zoomPrevention })),
      setZoomPrevention: (value) => set({ zoomPrevention: value }),
      generateNewProfile: () => set({ profileSeed: nanoid() }),
    }),
    {
      name: "cesi-settings-storage",
    }
  )
);
