import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";
import { MatchItem } from "../stores/useMatchStore";

interface MatchTileProps {
  item: MatchItem;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function MatchTile({
  item,
  isSelected,
  onClick,
  disabled,
}: MatchTileProps) {
  const playSound = () => {
    if (item.type === "sound") {
      const audio = new Audio(`/sounds/onomatopeias/${item.value}.mp3`);
      audio.play();
    }
  };

  const handleClick = () => {
    if (!disabled && !item.matched && !item.error && !item.success) {
      playSound();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || item.matched || item.error || item.success}
      className={cn(
        "w-full h-24 mb-4 rounded-xl flex items-center justify-center transition-all duration-200",
        "border-b-4 bg-white active:border-b-0 active:translate-y-1",
        !isSelected &&
          !item.error &&
          !item.success &&
          !item.matched &&
          "border-gray-200 hover:bg-gray-50",
        isSelected &&
          !item.error &&
          !item.success &&
          !item.matched &&
          "border-sky-500 bg-sky-100 ring-2 ring-sky-300",
        item.error &&
          "border-red-500 bg-red-100 motion-preset-shake pointer-events-none",
        item.success &&
          "border-green-500 bg-green-100 ring-2 ring-green-300 motion-preset-confetti duration-1000 motion-duration-1000 pointer-events-none",
        item.matched &&
          "border-gray-300 bg-gray-200 opacity-60 pointer-events-none active:translate-y-0 active:border-b-4",
      )}
    >
      {item.type === "letter" && (
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "text-4xl font-bold uppercase pointer-events-none",
              item.matched ? "text-gray-400" : "text-gray-800",
            )}
          >
            {item.value}
          </span>
          {item.extraInfo && (
            <span className={cn("text-xs font-bold pointer-events-none", item.matched ? "text-gray-400" : "text-gray-400/80 mt-[-4px]")}>
              {item.extraInfo}
            </span>
          )}
        </div>
      )}
      {item.type === "image" && (
        <img
          src={`/onomatopeias/png/${item.value}.png`}
          alt="Onomatopeia"
          className={cn(
            "h-16 w-16 object-contain pointer-events-none",
            item.matched && "grayscale opacity-50",
          )}
        />
      )}
      {item.type === "sound" && (
        <Volume2
          className={cn(
            "h-10 w-10",
            item.matched ? "text-gray-400" : "text-sky-500",
          )}
        />
      )}
    </button>
  );
}
