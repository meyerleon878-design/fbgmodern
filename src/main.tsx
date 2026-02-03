import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { DownloadsProvider } from "./contexts/DownloadsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <DownloadsProvider>
      <App />
    </DownloadsProvider>
  </ThemeProvider>
);
