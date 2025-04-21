import { EndGameModal } from "@/games/sound-quiz/components/endGame";
import { useEffect } from "react";
import { ActionButton, Header, LevelControl, Options } from "./components";
import useGameState from "./states";

const titles = {
  "very easy": "Veja, escute e escolha a letra",
  easy: "Veja a figura e escolha a letra",
  medium: "Escute e escolha a letra",
  hard: "Veja a figura e escolha o som",
  "very hard": "Veja a letra e escolha o som",
};

function SoundQuiz() {
  const difficulty = useGameState((state) => state.difficulty);

  useEffect(() => {
    useGameState.getState().generateLevel();
    console.log("generateLevel");
  }, []);

  return (
    <div className="h-full w-full landscape:h-auto bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content]">
      <Header />
      <div>
        <h1 className="text-xl pb-6 pt-4 pl-4 text-sky-900 tracking-tight potta-one-regular">
          {titles[difficulty]}
        </h1>
        <div className="flex flex-col landscape:flex-row landscape:space-x-10 landscape:px-10 ">
          <ActionButton />
          <Options />
        </div>
      </div>
      <LevelControl />
      <EndGameModal />
    </div>
  );
}

export default SoundQuiz;
