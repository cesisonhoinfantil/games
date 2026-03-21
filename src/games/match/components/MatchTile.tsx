import { cn } from "@/lib/utils";
import { MatchItem } from "../stores/useMatchStore";
import WavesurferPlayer from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef } from "react";

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
  const wave = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (wave.current) {
      let color = "#38bdf8"; // sky-400
      if (item.matched) color = "#9ca3af"; // gray-400
      else if (item.error) color = "#ef4444"; // red-500
      else if (item.success) color = "#22c55e"; // green-500
      else if (isSelected) color = "#0284c7"; // sky-600

      wave.current.setOptions({
        waveColor: color,
        progressColor: "#0f172a", // slate-900 for progress
      });
    }
  }, [isSelected, item.matched, item.error, item.success]);

  const playSound = () => {
    if (item.type === "sound" || item.playSoundOnClick) {
      if (item.type === "sound" && wave.current) {
        wave.current.play();
      } else {
        const audio = new Audio(`/sounds/onomatopeias/${item.value}.mp3`);
        audio.play();
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !item.matched && !item.error && !item.success && !item.loading) {
      playSound();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || item.matched || item.error || item.success || item.loading}
      className={cn(
        "w-full h-24 mb-4 rounded-xl flex items-center justify-center transition-all duration-200",
        "border-b-4 bg-white active:border-b-0 active:translate-y-1",
        !isSelected &&
          !item.error &&
          !item.success &&
          !item.matched &&
          !item.loading &&
          "border-gray-200 hover:bg-gray-50",
        isSelected &&
          !item.error &&
          !item.success &&
          !item.matched &&
          !item.loading &&
          "border-sky-500 bg-sky-100 ring-2 ring-sky-300",
        item.error &&
          "border-red-500 bg-red-100 motion-preset-shake pointer-events-none",
        item.success &&
          "border-green-500 bg-green-100 ring-2 ring-green-300 motion-preset-confetti duration-1000 motion-duration-1000 pointer-events-none",
        item.matched &&
          "border-gray-300 bg-gray-200 opacity-60 pointer-events-none active:translate-y-0 active:border-b-4",
        item.loading &&
          "border-gray-300 bg-white opacity-100 pointer-events-none",
      )}
    >
      {item.type === "letter" && !item.matched && (
        <div className={cn(
          "flex flex-col items-center motion-preset-fade motion-duration-1000 transition-opacity duration-1000",
          item.loading ? "opacity-40" : "opacity-100"
        )}>
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
      {item.type === "image" && !item.matched && (
        <img
          src={`/onomatopeias/png/${item.value}.png`}
          alt="Onomatopeia"
          className={cn(
            "h-16 w-16 object-contain pointer-events-none motion-preset-fade motion-duration-1000 transition-opacity duration-1000",
            item.loading ? "opacity-40" : "opacity-100",
            item.matched && "grayscale opacity-50",
          )}
        />
      )}
      {item.type === "sound" && !item.matched && (
        <div className={cn(
          "w-full px-4 motion-preset-fade motion-duration-1000 transition-opacity duration-1000",
          item.loading ? "opacity-40" : "opacity-100",
          item.matched && "opacity-50 pointer-events-none grayscale"
        )}>
          <WavesurferPlayer
            height={40}
            barWidth={3}
            barGap={2}
            waveColor={"#38bdf8"}
            progressColor={"#0f172a"}
            interact={false}
            cursorWidth={0}
            url={`/sounds/onomatopeias/${item.value}.mp3`}
            normalize
            onReady={(ws) => (wave.current = ws)}
          />
        </div>
      )}
    </button>
  );
}
