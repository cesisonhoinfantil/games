import { useEffect } from "react";
import { ActionButton, Header, LevelControl, Options } from "./components";
import useGameState from "./states";

function SoundQuiz() {
  useEffect(() => {
    useGameState.getState().generateLevel();
    console.log("generateLevel");
  }, []);

  return (
    <div className="h-full w-full landscape:h-auto bg-[#74E1FF] grid grid-rows-[min-content_1fr_min-content]">
      <Header />
      <div>
        <h1 className="text-xl pb-6 pt-4 pl-4 text-sky-900 tracking-tight potta-one-regular">
          Selecione a opção correta:
        </h1>
        <div className="flex flex-col landscape:flex-row landscape:space-x-10 landscape:px-10 ">
          <ActionButton />
          <Options />
        </div>
      </div>
      <LevelControl />
    </div>
  );
}

export default SoundQuiz;
