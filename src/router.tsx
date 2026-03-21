import { Alphabet } from "@/games/alphabet";
import MatchGame from "@/games/match";
import SoundQuiz from "@/games/sound-quiz";
import TrailGame from "@/games/trail";
import { TracingGame } from "@/games/tracing";
import { GabaritoEditor } from "@/games/tracing/editor";
import { Credits } from "@/pages/credits";
import { GameSelectPage } from "@/pages/gameSelect";
import { Home } from "@/pages/home";

import { ProfilePage } from "@/pages/profile";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/select",
    element: <GameSelectPage />,
  },
  {
    path: "/alphabet",
    element: <Alphabet />,
  },
  {
    path: "/quiz",
    element: <SoundQuiz />,
  },
  {
    path: "/tracing",
    element: <TracingGame />,
  },
  {
    path: "/match",
    element: <MatchGame />,
  },
  {
    path: "/gabarito-editor",
    element: <GabaritoEditor />,
  },
  {
    path: "/trail",
    element: <TrailGame />,
  },
  {
    path: "/credits",
    element: <Credits />,
  },
]);

export default router;
