import { create } from "zustand";
import { BaseGameState } from "@/games/base/store/interfaces";
import { createBaseMethods } from "@/games/base/store/methods";
import { InitialBaseData } from "@/games/base/store/static";
import { MemoryCard } from "../types";

export interface MemoryGameState {
  cards: MemoryCard[];
  selectedCards: string[];
  history: string[];

  setCards: (cards: MemoryCard[]) => void;
  addToHistory: (keys: string[]) => void;

  flipCard: (id: string) => void;

  markSuccess: (idA: string, idB: string) => void;
  markMatch: (idA: string, idB: string) => void;
  markError: (idA: string, idB: string) => void;
  clearError: (idA: string, idB: string) => void;
  decreaseLife: () => void;
}

export type MemoryState = MemoryGameState & BaseGameState;

export const useMemoryStore = create<MemoryState>()((set, get, api) => {
  const baseMethods = createBaseMethods<MemoryState>()(set, get, api);

  return {
    ...InitialBaseData,
    ...baseMethods,

    cards: [],
    selectedCards: [],
    history: [],

    verify: () => {
      set({ status: "win" });
      setTimeout(() => {
        set({ paused: true });
      }, 1500);
    },
    resetGame: () => {
      set({
        cards: [],
        selectedCards: [],
        history: [],
      });
    },

    setCards: (cards) => set({ cards }),
    addToHistory: (keys) =>
      set((state) => {
        const newHistory = [...state.history, ...keys];
        if (newHistory.length > 12) {
          return { history: newHistory.slice(newHistory.length - 12) };
        }
        return { history: newHistory };
      }),

    flipCard: (id) =>
      set((state) => {
        if (state.selectedCards.length >= 2) return state; // Do not allow flipping more than 2
        
        return {
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, flipped: true } : card
          ),
          selectedCards: [...state.selectedCards, id],
        };
      }),

    markSuccess: (idA, idB) =>
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === idA || card.id === idB
            ? { ...card, success: true }
            : card
        ),
        selectedCards: [],
        score: state.score + 1,
      })),

    markMatch: (idA, idB) =>
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === idA || card.id === idB
            ? { ...card, success: false, matched: true }
            : card
        ),
      })),

    markError: (idA, idB) =>
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === idA || card.id === idB
            ? { ...card, error: true }
            : card
        ),
        errors: state.errors + 1,
      })),

    decreaseLife: () =>
      set((state) => ({ life: Math.max(0, state.life - 1) })),

    clearError: (idA, idB) =>
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === idA || card.id === idB
            ? { ...card, error: false, flipped: false }
            : card
        ),
        selectedCards: [],
      })),
  };
});
