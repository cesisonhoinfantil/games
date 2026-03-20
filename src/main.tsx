import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";

import { ZoomController } from "./components/ZoomController";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZoomController />
    <RouterProvider router={router} />
  </StrictMode>
);
