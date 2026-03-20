import { EndGameModal } from "@/games/sound-quiz/components/endGame";
import { Menu } from "@/games/sound-quiz/menu";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
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
  const started = useGameState((state) => state.started);
  const difficulty = useGameState((state) => state.difficulty);
  const level = useGameState((state) => state.level);
  const transitionType = useSettingsStore((state) => state.transitionType);

  const getTransitionClass = () => {
    switch (transitionType) {
      case "slide":
        return "motion-preset-slide-left-sm";
      case "pop":
        return "motion-preset-pop";
      case "fade":
        return "motion-preset-fade motion-preset-blur-sm";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (started) {
      useGameState.getState().generateLevel();
      console.log("generateLevel");
    }
  }, [started]);

  if (!started) {
    return <Menu />;
  }

  return (
    <div className="h-full w-full landscape:h-auto bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content] overflow-hidden">
      <Header />
      <div
        key={transitionType !== "none" ? level : "static"}
        className={cn("flex flex-col flex-1", getTransitionClass())}
      >
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
