import { create } from "zustand";
import { BaseGameState } from "@/games/base/store/interfaces";
import { createBaseMethods } from "@/games/base/store/methods";
import { InitialBaseData } from "@/games/base/store/static";

export type MatchMode = "pairs" | "madness" | undefined;

export interface MatchItem {
  id: string; // unique internal id
  value: string; // The letter or the sound/image id
  type: "letter" | "image" | "sound";
  pairId: string; // Used to match A and B
  matched: boolean;
  error?: boolean;
  success?: boolean;
  extraInfo?: string;
  letterKey?: string;
  playSoundOnClick?: boolean;
}

export interface MatchGameState {
  mode: MatchMode;
  itemsA: MatchItem[];
  itemsB: MatchItem[];
  
  selectedA: string | undefined;
  selectedB: string | undefined;
  
  history: string[];

  setMode: (mode: MatchMode) => void;
  setItems: (itemsA: MatchItem[], itemsB: MatchItem[]) => void;
  addToHistory: (keys: string[]) => void;
  
  selectItemA: (id: string) => void;
  selectItemB: (id: string) => void;
  clearSelection: () => void;
  
  markSuccess: (idA: string, idB: string) => void;
  markMatch: (idA: string, idB: string) => void;
  markError: (idA: string, idB: string) => void;
  clearError: (idA: string, idB: string) => void;
  decreaseLife: () => void;
}

export type MatchState = MatchGameState & BaseGameState;

export const useMatchStore = create<MatchState>()((set, get, api) => {
  const baseMethods = createBaseMethods<MatchState>()(set, get, api);
  
  return {
    ...InitialBaseData,
    ...baseMethods,
    
    // Initial specific state
    mode: undefined,
    itemsA: [],
    itemsB: [],
    selectedA: undefined,
    selectedB: undefined,
    history: [],
    
    // Overrides
    verify: () => {
      set({ status: "win" });
    },
    resetGame: () => {
      set({
        itemsA: [],
        itemsB: [],
        selectedA: undefined,
        selectedB: undefined,
        history: [],
      });
      // Important to explicitly clear items so new generatePairs runs cleanly
    },

    // Specific methods
    setMode: (mode) => set({ mode }),
    setItems: (itemsA, itemsB) => set({ itemsA, itemsB }),
    addToHistory: (keys) => set((state) => {
      const newHistory = [...state.history, ...keys];
      if (newHistory.length > 12) {
        return { history: newHistory.slice(newHistory.length - 12) };
      }
      return { history: newHistory };
    }),
    
    selectItemA: (id) => set({ selectedA: id }),
    selectItemB: (id) => set({ selectedB: id }),
    clearSelection: () => set({ selectedA: undefined, selectedB: undefined }),
    
    markSuccess: (idA, idB) => set((state) => ({
      itemsA: state.itemsA.map(item => item.id === idA ? { ...item, success: true } : item),
      itemsB: state.itemsB.map(item => item.id === idB ? { ...item, success: true } : item),
      selectedA: undefined,
      selectedB: undefined,
      score: state.score + 1
    })),
    
    markMatch: (idA, idB) => set((state) => ({
      itemsA: state.itemsA.map(item => item.id === idA ? { ...item, success: false, matched: true } : item),
      itemsB: state.itemsB.map(item => item.id === idB ? { ...item, success: false, matched: true } : item),
    })),
    
    markError: (idA, idB) => {
      set((state) => ({
        itemsA: state.itemsA.map(item => item.id === idA ? { ...item, error: true } : item),
        itemsB: state.itemsB.map(item => item.id === idB ? { ...item, error: true } : item),
        errors: state.errors + 1,
        selectedA: undefined,
        selectedB: undefined
      }));
    },
    
    decreaseLife: () => set((state) => ({ life: Math.max(0, state.life - 1) })),
    
    clearError: (idA, idB) => set((state) => ({
      itemsA: state.itemsA.map(item => item.id === idA ? { ...item, error: false } : item),
      itemsB: state.itemsB.map(item => item.id === idB ? { ...item, error: false } : item),
      selectedA: undefined,
      selectedB: undefined
    })),
  };
});
