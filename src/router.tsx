import SoundQuiz from "@/games/sound-quiz";
import { Credits } from "@/pages/credits";
import { Home } from "@/pages/home";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
