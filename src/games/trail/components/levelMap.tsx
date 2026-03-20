import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trailLevels } from "../levels";
import { useTrailProgress } from "../store/useTrailProgress";

interface LevelMapProps {
  onSelectLevel: (levelId: number) => void;
}

export function LevelMap({ onSelectLevel }: LevelMapProps) {
  const navigate = useNavigate();
  const { levels } = useTrailProgress();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <HeaderContainer className="px-0">
        <Button
          variant={"ghost"}
          className="w-1/3 [&_svg]:size-6 h-full"
          onClick={goBack}
        >
          <ArrowLeft />
        </Button>
        <div className="w-full text-center font-bold text-lg">Trilha (Experimental)</div>
        <div className="w-1/3" />
      </HeaderContainer>

      <div className="w-full flex-1 p-6 flex flex-col items-center gap-6 overflow-y-auto">
        <p className="text-center text-muted-foreground">
          Complete os níveis para avançar na trilha!
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          {trailLevels.map((level, index) => {
            const stars = levels[level.id] || 0;
            // O nível atual é liberado se for o primeiro, ou se o nível anterior tiver > 0 estrelas
            const isUnlocked = index === 0 || (levels[trailLevels[index - 1].id] || 0) > 0;

            return (
              <button
                key={level.id}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(level.id)}
                className={`relative w-full p-4 rounded-xl border-4 transition-all flex flex-col items-center justify-center gap-2 
                  ${
                    isUnlocked
                      ? "bg-white border-blue-400 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      : "bg-gray-200 border-gray-300 opacity-80 cursor-not-allowed"
                  }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-2 right-2 text-gray-400">
                    <Lock size={20} />
                  </div>
                )}
                
                <span className={`text-xl font-bold ${isUnlocked ? "text-blue-500" : "text-gray-400"}`}>
                  Nível {index + 1}
                </span>

                <div className="flex gap-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`size-6 ${
                        isUnlocked && starIdx <= stars
                          ? "fill-yellow-400 text-yellow-500"
                          : "fill-gray-300 text-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
