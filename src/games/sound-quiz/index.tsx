import { useEffect } from "react";
import { ActionButton, Header, LevelControl, Options } from "./components";
import useGameState from "./states";

function SoundQuiz() {
  useEffect(() => {
    useGameState.getState().generateLevel();
    console.log("generateLevel");
  }, []);

  return (
    <div className="h-full w-full bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content]">
      <Header />
      <div className="py-4 min-h-0 flex flex-col justify-between">
        <h1 className="text-xl pb-3 pl-4 text-sky-900 tracking-tight potta-one-regular">
          Selecione a opção correta:
        </h1>
        <ActionButton />
        <Options />
      </div>
      <LevelControl />
    </div>
  );
}

export default SoundQuiz;
