import Button from "@/components/animata/button/duolingo";
import { Status } from "@/components/status";
import { cn } from "@/lib/utils";
import useGameState from "@/states/game";
import { Howl } from "howler";
import { Heart, Volume2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import useSound from "use-sound";

function Timer() {
  const [Time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((state) => state + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {("0" + Math.floor((Time / 60) % 60)).slice(-2)}:
      {("0" + Math.floor(Time % 60)).slice(-2)}
    </div>
  );
}
function Header() {
  const level = useGameState((state) => state.level);
  const life = useGameState((state) => state.life);

  return (
    <div className="w-full px-6 py-1 shadow-md bg-[#3BA7C5] border-b-2 border-white text-white font-bold text-2xl flex justify-between items-center">
      <div className="flex w-1/3">
        <div className="w-auto text-center">
          <p className="text-base font-normal tracking-widest">LVL</p>
          <p className="-mt-2 tracking-tighter">{level}</p>
        </div>
      </div>
      <Timer />
      <div className="w-1/3 flex justify-end items-center space-x-1">
        <Heart className="-mb-1" />
        <p>{life}</p>
      </div>
    </div>
  );
}

function ActionButton() {
  const img = useGameState((state) => state.img);
  const state = useGameState((state) => state.status); // force update on pass level
  const audio = useRef<Howl>();

  useEffect(() => {
    if (audio.current && audio.current.playing()) {
      audio.current.stop();
    }
    if (img && !state) {
      audio.current = new Howl({
        src: `/sounds/onomatopeias/${img}.mp3`,
      });
      audio.current.play();
    }
  }, [img, state]);

  const play = useCallback(() => {
    if (audio.current) {
      if (audio.current.playing()) {
        audio.current.stop();
      }

      audio.current.play();
    }
  }, []);

  useEffect(() => {
    if (audio.current) {
      audio.current.play();
    }
  }, []);

  return (
    <Button
      onClick={() => play()}
      variants="white"
      affect="p-0"
      className="w-2/3 min-h-36 m-auto"
    >
      <div className="relative w-full h-full flex justify-center items-center">
        <Volume2 color="#3BA7C5" size={32} className="absolute top-3 right-3" />
        <picture className="w-full h-full p-4 px-11">
          <source srcSet={`/onomatopeias/png/${img}.png`} />
          <img
            className="w-full h-full object-contain"
            src="/onomatopeias/A2.png"
          />
        </picture>
      </div>
    </Button>
  );
}

function Options() {
  const selected = useGameState((state) => state.selected);
  const options = useGameState((state) => state.options);

  const Select = useCallback((ButtonIndex: number) => {
    if (ButtonIndex == null) return console.error("No button index ?");
    useGameState.getState().select(ButtonIndex);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 gap-y-4 pt-6 w-4/5 m-auto items-center">
      {options.map((value, index) => (
        <Button
          variants={selected == index ? "white" : "default"}
          onClick={() => Select(index)}
          affect={"py-3"}
          className={cn(index >= 4 && "col-span-2 justify-self-center w-1/2")}
          key={nanoid()}
        >
          <span className="text-2xl flex justify-center">{value}</span>
        </Button>
      ))}
    </div>
  );
}

function LevelControl() {
  const [win] = useSound("/sounds/effects/success.mp3", { volume: 0.7 });
  const [lose] = useSound("/sounds/effects/fail.mp3", { volume: 0.7 });
  const GameStatus = useGameState((state) => state.status);
  const selected = useGameState((state) => state.selected);

  useEffect(() => {
    if (GameStatus) {
      if (GameStatus == "win") {
        win();
      } else {
        lose();
      }
    }
  }, [GameStatus, lose, win]);

  return (
    <div className="w-full h-full flex justify-center items-end py-6 relative">
      {GameStatus && (
        <Status variant={GameStatus == "win" ? "success" : "error"} />
      )}
      <Button
        className="w-2/3"
        variants={GameStatus == "lose" ? "error" : "white"}
        onClick={() => {
          const { verify, nextLevel, status } = useGameState.getState();
          if (status) {
            nextLevel();
          } else {
            verify();
          }
        }}
        disabled={selected == null}
      >
        Avançar
      </Button>
    </div>
  );
}

function App() {
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

export default App;
