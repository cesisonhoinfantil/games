import { useState } from "react";
import SoundQuiz from "../sound-quiz";
import useGameState from "../sound-quiz/states";
import { LevelMap } from "./components/levelMap";
import { trailLevels } from "./levels";
import { useTrailProgress } from "./store/useTrailProgress";

export function TrailGame() {
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const saveProgress = useTrailProgress((state) => state.saveProgress);

  const selectedLevel = trailLevels.find((l) => l.id === selectedLevelId);

  const handleTrailFinish = (score: number, errors: number) => {
    if (selectedLevelId === null) return;

    const total = score + errors;
    const accuracy = total > 0 ? score / total : 0;

    let stars = 0;
    if (accuracy >= 0.9) stars = 3;
    else if (accuracy >= 0.6) stars = 2;
    else if (accuracy >= 0.3) stars = 1;

    saveProgress(selectedLevelId, stars);

    // reset do estado local do wrapper para voltar pro mapa
    setSelectedLevelId(null);

    // reset do estado do SoundQuiz
    const { reset, resetConfig } = useGameState.getState();
    reset();
    resetConfig();
  };

  if (!selectedLevel) {
    return <LevelMap onSelectLevel={setSelectedLevelId} />;
  }

  if (selectedLevel.type === "sound-quiz") {
    return (
      <SoundQuiz
        trailMode={true}
        trailConfig={selectedLevel.config}
        onTrailFinish={handleTrailFinish}
      />
    );
  }

  return <div>Jogo não suportado!</div>;
}

export default TrailGame;
