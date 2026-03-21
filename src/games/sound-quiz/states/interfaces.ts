import { GameBaseData, GameBaseActions } from "@/games/base/store/interfaces";

export interface GameData extends GameBaseData {
  history: string[];
  extraInfo?: string;
  selected?: number;
  correct?: number;
  img?: string;
  options: string[];
  imgOptions: string[];
}

export interface GameState extends GameBaseActions {
  select: (toSelect: number) => void;
  verify: () => void;
  generateLevel: () => void;
  resetGame: () => void;
}
