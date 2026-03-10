import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { DownloadsProvider } from "./contexts/DownloadsContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ThemeProvider>
      <DownloadsProvider>
        <App />
      </DownloadsProvider>
    </ThemeProvider>
  </UserProvider>
);
