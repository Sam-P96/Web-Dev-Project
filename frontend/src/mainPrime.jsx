import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppPrime from "./AppPrime";
// import App from './App.jsx' maybe use this? idk, lets wait and see

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppPrime />
  </StrictMode>
);