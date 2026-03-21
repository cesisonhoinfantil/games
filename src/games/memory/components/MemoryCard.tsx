import { MemoryCard as MemoryCardType } from "../types";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  card: MemoryCardType;
  onClick: () => void;
  disabled: boolean;
}

export function MemoryCard({ card, onClick, disabled }: MemoryCardProps) {
  // Example of using sounds if it's a sound card. You could preload this dynamically.
  // For simplicity, we assume the sound card has a generic icon and plays sound when flipped.
  const handleClick = () => {
    if (disabled || card.flipped || card.matched) return;
    
    const uiSound = new Audio("/sounds/ui/plope.mp3");
    uiSound.volume = 0.5;
    uiSound.play().catch(() => {});

    if (card.playSoundOnClick || card.type === "sound") {
      const vol = card.type === "sound" ? 1 : 0.6;
      const soundUrl = card.type === "sound" ? `/onomatopeias/audios/${card.value}.mp3` : `/onomatopeias/audios/${card.letterKey}.mp3`;
      const itemSound = new Audio(soundUrl);
      itemSound.volume = vol;
      itemSound.play().catch(() => {});
    }
    onClick();
  };

  const renderContent = () => {
    if (card.type === "image") {
      return (
        <img
          src={`/onomatopeias/png/${card.value}.png`}
          className="w-full h-full object-contain p-2"
          alt="Card Image"
        />
      );
    }
    if (card.type === "letter") {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-4xl md:text-6xl font-bold text-sky-900 pointer-events-none">
            {card.value.toUpperCase()}
          </span>
          {card.extraInfo && (
            <span className="text-sm font-bold text-sky-800 pointer-events-none mt-1">
              {card.extraInfo}
            </span>
          )}
        </div>
      );
    }
    if (card.type === "sound") {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <img src="/icons/sound-icon.png" alt="Sound" className="w-1/2 h-1/2 object-contain opacity-50" />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "relative rounded-xl shadow-sm border-b-4 transition-transform select-none cursor-pointer",
        card.error ? "border-red-500" : card.success ? "border-green-500" : "border-slate-300",
        "bg-white"
      )}
      onClick={handleClick}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={cn(
          "w-full h-full absolute top-0 left-0 transition-all duration-500 rounded-xl",
          card.flipped || card.matched ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
        )}
      >
        {renderContent()}
      </div>

      <div
        className={cn(
          "w-full h-full absolute top-0 left-0 bg-sky-400 rounded-xl flex items-center justify-center transition-all duration-500 border-2 border-sky-500",
          card.flipped || card.matched ? "opacity-0 z-0 scale-95" : "opacity-100 z-10 scale-100"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-white/30 text-white font-bold flex items-center justify-center">?</div>
      </div>
      
      {/* Invisible spacer to maintain cell aspect ratio */}
      <div className="w-full pb-[100%]"></div>
    </div>
  );
}
