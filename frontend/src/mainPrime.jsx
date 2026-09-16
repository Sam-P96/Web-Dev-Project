import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// This gives the component inside the app access to the URL
import { BrowserRouter } from "react-router-dom";
import AppPrime from "./AppPrime";
import "./index.css";


// import App from './App.jsx' maybe use this? idk, lets wait and see

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AppPrime />
    </BrowserRouter>
  </StrictMode>
);