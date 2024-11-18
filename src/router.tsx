import SoundQuiz from "@/games/sound-quiz";
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
]);

export default router;
