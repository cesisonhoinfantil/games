import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface SettingsState {
  zoomPrevention: boolean;
  vibrationEnabled: boolean;
  transitionType: "slide" | "pop" | "fade" | "none";
  profileSeed: string;
  toggleZoomPrevention: () => void;
  setZoomPrevention: (value: boolean) => void;
  toggleVibrationEnabled: () => void;
  setVibrationEnabled: (value: boolean) => void;
  setTransitionType: (value: SettingsState["transitionType"]) => void;
  generateNewProfile: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      zoomPrevention: true, // vindo habilitado para desabilitar o zoom
      vibrationEnabled: true,
      transitionType: "slide",
      profileSeed: nanoid(),
      toggleZoomPrevention: () =>
        set((state) => ({ zoomPrevention: !state.zoomPrevention })),
      setZoomPrevention: (value) => set({ zoomPrevention: value }),
      toggleVibrationEnabled: () =>
        set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
      setVibrationEnabled: (value) => set({ vibrationEnabled: value }),
      setTransitionType: (value) => set({ transitionType: value }),
      generateNewProfile: () => set({ profileSeed: nanoid() }),
    }),
    {
      name: "cesi-settings-storage",
    }
  )
);
