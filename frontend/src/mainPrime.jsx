import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppPrime from "./AppPrime";
// This gives the component inside the app access to the URL

// import App from './App.jsx' maybe use this? idk, lets wait and see

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AppPrime />
    </BrowserRouter>
  </StrictMode>
);