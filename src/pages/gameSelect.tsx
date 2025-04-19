import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, GamepadIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function SelectHeader() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer className="px-0">
      <Button
        variant={"ghost"}
        className="w-1/3 [&_svg]:size-6 h-full"
        onClick={goBack}
      >
        <ArrowLeft />
      </Button>
      <div className="w-full text-center">Jogos</div>
      <div className="w-1/3 flex justify-center">
        <GamepadIcon />
      </div>
    </HeaderContainer>
  );
}

const games = [
  {
    name: "Quiz dos sons",
    url: "/quiz",
    description:
      "Um quiz com as onomatopeias, escute o som e veja a onomatopeia e clique qual a letra que representa a onomatopeia",
  },
];

export function GameSelectPage() {
  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      <SelectHeader />
      <div className="w-full px-6 flex flex-col gap-4 p-6">
        {games.map((game) => {
          return (
            <Link to={game.url} key={game.name}>
              <div className="w-full h-full flex flex-col gap-1 bg-white p-4 rounded-lg shadow-md">
                <div className="text-lg font-bold">{game.name}</div>
                <Separator />
                {game.description}
                <Separator />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
