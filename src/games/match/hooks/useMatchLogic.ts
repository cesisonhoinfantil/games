import { useEffect } from "react";
import { useMatchStore, MatchItem } from "../stores/useMatchStore";
import { AllOptions, optionsKeys, conflicts, AltsExtraInfos } from "../../sound-quiz/states/static";
import { nanoid } from "nanoid";

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function useMatchLogic(pairsCount: number = 4) {
  const { 
    difficulty, 
    setItems, 
    itemsA, 
    itemsB, 
    selectedA, 
    selectedB, 
    markSuccess,
    markMatch, 
    markError, 
    clearError, 
    decreaseLife, 
    mode,
    history,
    addToHistory
  } = useMatchStore();

  const getPrioritizedKeys = () => {
    return [...optionsKeys].sort(() => Math.random() - 0.5).sort((a, b) => {
      const aInHistory = history.includes(a);
      const bInHistory = history.includes(b);
      if (aInHistory && !bInHistory) return 1;
      if (!aInHistory && bInHistory) return -1;
      return 0;
    });
  };

  const generatePairs = () => {
    // 1. Pick random letter keys protecting against conflicts and history
    const selectedKeys: (keyof typeof AllOptions)[] = [];
    const prioritizedKeys = getPrioritizedKeys();

    for (const key of prioritizedKeys) {
      if (selectedKeys.length >= pairsCount) break;
      
      const hasConflict = selectedKeys.some(selectedKey => {
         const keyConflicts = conflicts[key] || [];
         const selectedKeyConflicts = conflicts[selectedKey as keyof typeof conflicts] || [];
         return keyConflicts.includes(selectedKey) || selectedKeyConflicts.includes(key);
      });
      
      if (!hasConflict) {
        selectedKeys.push(key);
      }
    }
    
    addToHistory(selectedKeys);

    const newItemsA: MatchItem[] = [];
    const newItemsB: MatchItem[] = [];

    selectedKeys.forEach((letter) => {
      const pairId = nanoid();
      const images = AllOptions[letter];
      const imageIndex = Math.floor(Math.random() * images.length);
      const randomImageId = images[imageIndex];

      let extraInfo: string | undefined = undefined;
      // Matches the sound-quiz logic for defining variations
      if ((imageIndex > 0 || letter === "Ç") && letter in AltsExtraInfos) {
        extraInfo = AltsExtraInfos[letter as keyof typeof AltsExtraInfos];
      }

      let itemA: MatchItem;
      let itemB: MatchItem;
      
      let currentDiff = difficulty;
      if (currentDiff === "very hard" || currentDiff === "challenge" as any) {
        const diffs = ["very easy", "easy", "medium", "hard"];
        currentDiff = diffs[Math.floor(Math.random() * diffs.length)] as any;
      }

      if (currentDiff === "very easy") {
        itemA = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: letter, playSoundOnClick: true };
        itemB = { id: nanoid(), value: letter, type: "letter", pairId, matched: false, extraInfo, letterKey: letter };
      } else if (currentDiff === "easy") {
        itemA = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: letter };
        itemB = { id: nanoid(), value: letter, type: "letter", pairId, matched: false, extraInfo, letterKey: letter };
      } else if (currentDiff === "medium") {
        itemA = { id: nanoid(), value: randomImageId, type: "sound", pairId, matched: false, letterKey: letter };
        itemB = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: letter };
      } else { // hard
        itemA = { id: nanoid(), value: randomImageId, type: "sound", pairId, matched: false, letterKey: letter };
        itemB = { id: nanoid(), value: letter, type: "letter", pairId, matched: false, extraInfo, letterKey: letter };
      }

      newItemsA.push(itemA);
      newItemsB.push(itemB);
    });

    setItems(shuffleArray(newItemsA), shuffleArray(newItemsB));
  };

  const replaceMatched = () => {
    // Find matched items and replace them with new pairs incrementally ensuring no conflicts
    const matchedItemsA = itemsA.filter(i => i.matched);
    if (matchedItemsA.length === 0) return;

    const newItemsA = [...itemsA];
    const newItemsB = [...itemsB];

    // Collect existing non-matched keys on the board to check against conflicts
    const existingKeys = itemsA.filter(i => !i.matched).map(i => i.letterKey!).filter(Boolean);
    const addedKeys: string[] = [];

    matchedItemsA.forEach(matchedA => {
      const idxA = newItemsA.findIndex(i => i.id === matchedA.id);
      const idxB = newItemsB.findIndex(i => i.pairId === matchedA.pairId);

      if (idxA !== -1 && idxB !== -1) {
        const prioritizedKeys = getPrioritizedKeys();
        let selectedLetter = prioritizedKeys[0]; // fallback
        for (const key of prioritizedKeys) {
          const hasConflict = existingKeys.some(existingKey => {
             const keyConflicts = conflicts[key] || [];
             const existingKeyConflicts = conflicts[existingKey as keyof typeof conflicts] || [];
             return keyConflicts.includes(existingKey) || existingKeyConflicts.includes(key);
          });
          if (!hasConflict) {
            selectedLetter = key;
            break;
          }
        }
        
        existingKeys.push(selectedLetter as string);
        addedKeys.push(selectedLetter as string);

        const pairId = nanoid();
        const images = AllOptions[selectedLetter];
        const imageIndex = Math.floor(Math.random() * images.length);
        const randomImageId = images[imageIndex];

        let extraInfo: string | undefined = undefined;
        if ((imageIndex > 0 || selectedLetter === "Ç") && selectedLetter in AltsExtraInfos) {
          extraInfo = AltsExtraInfos[selectedLetter as keyof typeof AltsExtraInfos];
        }

        let itemA: MatchItem;
        let itemB: MatchItem;

        let currentDiff = difficulty;
        if (currentDiff === "very hard" || currentDiff === "challenge" as any) {
          const diffs = ["very easy", "easy", "medium", "hard"];
          currentDiff = diffs[Math.floor(Math.random() * diffs.length)] as any;
        }

        if (currentDiff === "very easy") {
          itemA = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: selectedLetter, playSoundOnClick: true };
          itemB = { id: nanoid(), value: selectedLetter, type: "letter", pairId, matched: false, extraInfo, letterKey: selectedLetter };
        } else if (currentDiff === "easy") {
          itemA = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: selectedLetter };
          itemB = { id: nanoid(), value: selectedLetter, type: "letter", pairId, matched: false, extraInfo, letterKey: selectedLetter };
        } else if (currentDiff === "medium") {
          itemA = { id: nanoid(), value: randomImageId, type: "sound", pairId, matched: false, letterKey: selectedLetter };
          itemB = { id: nanoid(), value: randomImageId, type: "image", pairId, matched: false, letterKey: selectedLetter };
        } else {
          itemA = { id: nanoid(), value: randomImageId, type: "sound", pairId, matched: false, letterKey: selectedLetter };
          itemB = { id: nanoid(), value: selectedLetter, type: "letter", pairId, matched: false, extraInfo, letterKey: selectedLetter };
        }

        newItemsA[idxA] = itemA;
        newItemsB[idxB] = itemB;
      }
    });
    
    if (addedKeys.length > 0) addToHistory(addedKeys);

    setItems(newItemsA, newItemsB);
  };

  // Logic to handle selection changes
  useEffect(() => {
    if (selectedA && selectedB) {
      const itemA = itemsA.find(i => i.id === selectedA);
      const itemB = itemsB.find(i => i.id === selectedB);

      if (itemA && itemB) {
        if (itemA.pairId === itemB.pairId) {
          markSuccess(selectedA, selectedB);
          
          const matchedA = selectedA;
          const matchedB = selectedB;
          
          setTimeout(() => {
            markMatch(matchedA, matchedB);
          }, 800);
        } else {
          markError(selectedA, selectedB);
          if (mode === "pairs") {
            decreaseLife();
          }
          setTimeout(() => {
            clearError(selectedA, selectedB);
          }, 1000);
        }
      }
    }
  }, [selectedA, selectedB, itemsA, itemsB, markSuccess, markMatch, markError, clearError, decreaseLife, mode]);

  return { generatePairs, replaceMatched };
}
