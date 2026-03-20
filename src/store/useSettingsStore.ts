import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  zoomPrevention: boolean;
  toggleZoomPrevention: () => void;
  setZoomPrevention: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      zoomPrevention: true, // vindo habilitado para desabilitar o zoom
      toggleZoomPrevention: () =>
        set((state) => ({ zoomPrevention: !state.zoomPrevention })),
      setZoomPrevention: (value) => set({ zoomPrevention: value }),
    }),
    {
      name: "cesi-settings-storage",
    }
  )
);
