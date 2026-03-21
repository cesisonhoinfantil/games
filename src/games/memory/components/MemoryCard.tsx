import { cn } from "@/lib/utils";
import { MemoryCard as MemoryCardType } from "../types";

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
      const soundUrl =
        card.type === "sound"
          ? `/onomatopeias/audios/${card.value}.mp3`
          : `/onomatopeias/audios/${card.letterKey}.mp3`;
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
          <img
            src="/icons/sound-icon.png"
            alt="Sound"
            className="w-1/2 h-1/2 object-contain opacity-50"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-square rounded-[16%] shadow-sm select-none cursor-pointer bg-transparent",
        "perspective-[1000px]",
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full h-full duration-500 transform-3d transition-transform",
          card.flipped || card.matched ? "transform-[rotateY(180deg)]" : "",
        )}
      >
        {/* Front face (Card Back Cover) */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden [-webkit-backface-visibility:hidden] border-b-4",
            card.error
              ? "border-red-500"
              : card.success
                ? "border-green-500"
                : "border-slate-300",
          )}
          style={{ borderRadius: "16%" }}
        >
          {/* Camada 1: White Card Base */}
          <div
            className="w-full h-full bg-white flex items-center justify-center overflow-hidden"
            style={{ padding: "2%", borderRadius: "16%" }}
          >
            {/* Camada 2: Striped Background with #4092c5 border */}
            <div
              className="w-full h-full flex items-center justify-center border-2 sm:border-[3px] border-[#4092c5]"
              style={{
                padding: "3.5%",
                borderRadius: "16%",
                backgroundImage:
                  "repeating-linear-gradient(-45deg, #7dd3fc 0, #7dd3fc 8px, #ffffff 8px, #ffffff 16px)",
              }}
            >
              {/* Camada 3: Logo Image */}
              <div
                className="w-full h-full overflow-hidden flex items-center justify-center bg-sky-200"
                style={{ borderRadius: "20%" }}
              >
                <img
                  src="/onomatopeias/logo-caligrafando.png"
                  className="w-full h-full object-cover pointer-events-none"
                  alt="Logo Caligrafando"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back face (Card Content) */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full bg-white backface-hidden [-webkit-backface-visibility:hidden] transform-[rotateY(180deg)] border-b-4 flex items-center justify-center",
            card.error
              ? "border-red-500"
              : card.success
                ? "border-green-500"
                : "border-slate-300",
          )}
          style={{ borderRadius: "16%" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
