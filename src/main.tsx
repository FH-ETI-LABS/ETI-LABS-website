import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
