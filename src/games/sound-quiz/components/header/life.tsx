import { Heart } from "lucide-react";
import useGameState from "../../states";

export function LifeCount() {
  const life = useGameState((state) => state.life);

  return (
    <div className="w-1/5 flex justify-end items-center space-x-1">
      <Heart className="-mb-1" />
      <p>{life}</p>
    </div>
  );
}
