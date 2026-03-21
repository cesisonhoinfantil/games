import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAvatar } from "@/hooks/useAvatar";

function SelectHeader() {
  const navigate = useNavigate();
  const avatarSrc = useAvatar();

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
      <Link to="/profile" className="w-1/3 h-full flex justify-center items-center hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
        <img src={avatarSrc} alt="Perfil" className="size-8 rounded-full shadow-sm" />
      </Link>
    </HeaderContainer>
  );
}

const games = [
  {
    name: "Trilha (Experimental)",
    url: "/trail",
    description:
      "Uma trilha de níveis com desafios e sistema de pontuação baseado no seu desempenho (estrelas).",
  },
  {
    name: "Tracejados (Protótipo)",
    url: "/tracing",
    description:
      "Aprenda a escrever traçando letras maiúsculas, minúsculas e números com precisão.",
  },
  {
    name: "Quiz dos sons",
    url: "/quiz",
    description:
      "Um quiz com as onomatopeias, escute o som e veja a onomatopeia e clique qual a letra que representa a onomatopeia",
  },
  {
    name: "Alfabeto",
    url: "/alphabet",
    description:
      "Um alfabeto com as onomatopeias e suas variações, escute os sons e veja as onomatopeias",
  },
  {
    name: "Associação (Match)",
    url: "/match",
    description:
      "Faça combinações de Onomatopeias, Letras e Sons! Jogue no modo Clássico ou o Desafio do Tempo.",
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
