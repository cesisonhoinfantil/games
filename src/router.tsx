import SoundQuiz from "@/games/sound-quiz";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SoundQuiz />,
  },
]);

export default router;
