import { Button } from "@/components/ui/button";
import { AllOptions } from "@/games/sound-quiz/states/static";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full h-full z-10 relative place-items-center pb-5 overflow-hidden grid grid-cols-2 grid-rows-[min-content_1fr_min-content_min-content]">
        <img
          className="w-4/5 max-w-72 max-h-16 lg:max-w-[900px] md:max-h-[120px] col-span-2 mt-12 landscape:mt-6"
          src="/title.svg"
          alt="Onomatopeias"
        />
        <Onomatopeias />
        <div className="z-10 w-full flex flex-col items-center space-y-5 col-span-2 landscape:col-span-1">
          <Button
            onClick={() => navigate("/quiz")}
            className="w-3/4 h-16 bg-white hover:bg-white/80 text-black text-2xl font-bold rounded-xl"
          >
            Jogar
          </Button>
          <Button
            onClick={() => navigate("/credits")}
            disabled
            className="w-2/5 h-11 bg-white hover:bg-white/80 text-black text-base font-bold rounded-lg"
          >
            Créditos
          </Button>
        </div>
        <p className="col-span-2 text-sm font-semibold pt-4">
          Copyright © CESI 2024. Todos os direitos reservados.
        </p>
      </div>
      {/* Sun rays background */}
      <div className="absolute top-0 left-0 w-screen h-screen sun-rays" />
    </>
  );
}

function Onomatopeias() {
  const [size, setSize] = useState([0, 0]);
  const Containers = useMemo(() => {
    const numRows = 5;
    const numCols = 7;

    type Containers = ({
      color?: string;
      style?: React.CSSProperties;
      img?: string;
      hidden?: string;
    } | null)[][];

    const containers: Containers = Array(numRows)
      .fill(null)
      .map(() => Array(numCols).fill(null));

    const hiddenCells: Record<number, number[]> = {
      2: [6],
      3: [0, 6],
      4: [0, 6],
    };

    const allImages = [...new Set(Object.values(AllOptions).flat())];
    const shuffledImages = allImages.sort(() => Math.random() - 0.5);

    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRotation(col: number): number {
      if (col < 2) {
        return getRandomInt(-45, -12);
      } else if (col > 4) {
        return getRandomInt(12, 45);
      }

      return getRandomInt(-20, 20);
    }

    function getArcVariation(col: number): number {
      switch (col) {
        case 0:
        case 6:
          return 70;
        case 1:
        case 5:
          return 30;
        case 3:
          return -20;
        default:
          return 0;
      }
    }

    function getGlobalScale() {
      const height = size[1];

      console.log(height);

      if (height <= 375) {
        return -0.3;
      } else if (height >= 850) {
        return 0.4;
      }

      return 0;
    }

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (hiddenCells[row]?.includes(col)) {
          containers[row][col] = { hidden: "hidden" };
          continue;
        }

        const arcVariation = getArcVariation(col);
        const variationY = getRandomInt(-10, 10);

        const rotation = getRotation(col);
        const scale = getGlobalScale() + getRandomInt(80, 120) / 100;
        const x = getRandomInt(-10, 10) + "%";
        const y = arcVariation + variationY + "%";

        const animationDelay = getRandomInt(0, 750) + "ms";
        const animationDuration = getRandomInt(1500, 2500) + "ms";

        containers[row][col] = {
          img: shuffledImages.pop(),
          style: {
            transform: `translate(${x}, ${y}) rotate(${rotation}deg) scale(${scale})`,
            animationDelay,
            animationDuration,
          },
        };
      }
    }

    return containers;
  }, [size]);

  useLayoutEffect(() => {
    const onResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="-z-10 -mt-10 py-8 w-10/12 h-[inherit] flex flex-col justify-around col-span-2 landscape:pl-9 landscape:col-span-1 landscape:-mt-16">
      {Containers.map((line, lineIndex) => {
        return (
          <div
            key={nanoid()}
            className={cn(
              "flex justify-center md:justify-evenly relative -m-4 -space-x-4",
              { "-space-x-5": lineIndex === 2 },
              { "-space-x-6": lineIndex === 3 },
              { "-space-x-7": lineIndex === 4 }
            )}
          >
            {line.map((item, itemIndex) => {
              return (
                item && (
                  <img
                    src={`/onomatopeias/png/${item.img}.png`}
                    key={nanoid()}
                    style={item.style}
                    className={cn(
                      item.hidden,
                      "w-20 h-20 object-contain object-top motion-preset-pop motion-preset-oscillate-md motion-duration-2000"
                    )}
                    alt={`Onomatopeia ${lineIndex}-${itemIndex}`}
                  ></img>
                )
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
