import { Heart } from "lucide-react";
import useGameState from "../states";
import { Timer } from "./timer";

export function Header() {
  const level = useGameState((state) => state.level);
  const life = useGameState((state) => state.life);

  return (
    <div className="w-full px-6 py-1 shadow-md bg-[#3BA7C5] border-b-2 border-white text-white font-bold text-2xl flex justify-between items-center">
      <div className="flex w-1/3">
        <div className="w-auto text-center">
          <p className="text-base font-normal tracking-widest">LVL</p>
          <p className="-mt-2 tracking-tighter">{level}</p>
        </div>
      </div>
      <Timer />
      <div className="w-1/3 flex justify-end items-center space-x-1">
        <Heart className="-mb-1" />
        <p>{life}</p>
      </div>
    </div>
  );
}
