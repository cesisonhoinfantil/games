import { Alphabet } from "@/games/alphabet";
import SoundQuiz from "@/games/sound-quiz";
import { Credits } from "@/pages/credits";
import { GameSelectPage } from "@/pages/gameSelect";
import { Home } from "@/pages/home";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
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
    path: "/credits",
    element: <Credits />,
  },
]);

export default router;
