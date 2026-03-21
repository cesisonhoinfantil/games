import { useCallback, useEffect } from "react";
import { useMemoryStore } from "../stores/useMemoryStore";
import { AllOptions, optionsKeys, conflicts, AltsExtraInfos } from "../../sound-quiz/states/static";
import { nanoid } from "nanoid";
import { MemoryCard } from "../types";

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function useMemoryLogic() {
  const {
    difficulty,
    setCards,
    cards,
    selectedCards,
    markSuccess,
    markMatch,
    markError,
    clearError,
    decreaseLife,
    history,
    addToHistory,
  } = useMemoryStore();

  const getPairsCount = useCallback(() => {
    switch (difficulty) {
      case "very easy":
        return 3;
      case "easy":
        return 4;
      case "medium":
      case "hard":
        return 6;
      case "very hard":
        return 8;
      default:
        return 4;
    }
  }, [difficulty]);

  const getPrioritizedKeys = useCallback(() => {
    return [...optionsKeys].sort(() => Math.random() - 0.5).sort((a, b) => {
      const aInHistory = history.includes(a);
      const bInHistory = history.includes(b);
      if (aInHistory && !bInHistory) return 1;
      if (!aInHistory && bInHistory) return -1;
      return 0;
    });
  }, [history]);

  const generateCards = useCallback(() => {
    const pairsCount = getPairsCount();
    const selectedKeys: (keyof typeof AllOptions)[] = [];
    const prioritizedKeys = getPrioritizedKeys();

    for (const key of prioritizedKeys) {
      if (selectedKeys.length >= pairsCount) break;

      const hasConflict = selectedKeys.some((selectedKey) => {
        const keyConflicts = conflicts[key] || [];
        const selectedKeyConflicts = conflicts[selectedKey as keyof typeof conflicts] || [];
        return keyConflicts.includes(selectedKey) || selectedKeyConflicts.includes(key);
      });

      if (!hasConflict && !selectedKeys.includes(key)) {
        selectedKeys.push(key);
      }
    }

    addToHistory(selectedKeys);

    const newCards: MemoryCard[] = [];

    selectedKeys.forEach((letter) => {
      const pairId = nanoid();
      const images = AllOptions[letter];
      const imageIndex = Math.floor(Math.random() * images.length);
      const randomImageId = images[imageIndex];

      let extraInfo: string | undefined = undefined;
      if ((imageIndex > 0 || letter === "Ç") && letter in AltsExtraInfos) {
        extraInfo = AltsExtraInfos[letter as keyof typeof AltsExtraInfos];
      }

      let itemA: MemoryCard;
      let itemB: MemoryCard;

      let currentDiff = difficulty;
      if (currentDiff === "very hard" as any || currentDiff === "challenge" as any) {
        const diffs = ["very easy", "easy", "medium", "hard"];
        currentDiff = diffs[Math.floor(Math.random() * diffs.length)] as any;
      }

      const defaultProps = { pairId, flipped: false, matched: false, letterKey: letter, extraInfo };

      if (currentDiff === "very easy") {
        itemA = { id: nanoid(), value: randomImageId, type: "image", playSoundOnClick: true, ...defaultProps };
        itemB = { id: nanoid(), value: letter, type: "letter", ...defaultProps };
      } else if (currentDiff === "easy") {
        itemA = { id: nanoid(), value: randomImageId, type: "image", ...defaultProps };
        itemB = { id: nanoid(), value: letter, type: "letter", ...defaultProps };
      } else if (currentDiff === "medium") {
        itemA = { id: nanoid(), value: randomImageId, type: "sound", ...defaultProps };
        itemB = { id: nanoid(), value: randomImageId, type: "image", ...defaultProps };
      } else {
        itemA = { id: nanoid(), value: randomImageId, type: "sound", ...defaultProps };
        itemB = { id: nanoid(), value: letter, type: "letter", ...defaultProps };
      }

      newCards.push(itemA, itemB);
    });

    setCards(shuffleArray(newCards));
  }, [difficulty, getPairsCount, getPrioritizedKeys, addToHistory, setCards]);

  // Logic to handle selection changes
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [idA, idB] = selectedCards;
      const cardA = cards.find((c) => c.id === idA);
      const cardB = cards.find((c) => c.id === idB);

      if (cardA && cardB && !cardA.error && !cardA.success && !cardB.error && !cardB.success) {
        if (cardA.pairId === cardB.pairId) {
          markSuccess(idA, idB);
          
          setTimeout(() => {
            markMatch(idA, idB);
          }, 600);
        } else {
          markError(idA, idB);
          decreaseLife();
          setTimeout(() => {
            clearError(idA, idB);
          }, 1000);
        }
      }
    }
  }, [selectedCards, cards, markSuccess, markMatch, markError, clearError, decreaseLife]);

  return { generateCards };
}
