import { Heart } from "lucide-react";

interface GameLifeCountProps {
  life: number;
}

export function GameLifeCount({ life }: GameLifeCountProps) {
  return (
    <div className="w-1/5 flex justify-end items-center space-x-1">
      <Heart className="-mb-1" />
      <p>{life}</p>
    </div>
  );
}
