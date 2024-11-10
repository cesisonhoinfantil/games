import { create } from "zustand";
import { GameData, GameState } from "./interfaces";
import createMethods from "./methods";
import { InitialData } from "./static";

const useGameState = create<GameState & GameData>()((...state) => ({
  ...InitialData,
  ...createMethods(...state),
}));

export default useGameState;
