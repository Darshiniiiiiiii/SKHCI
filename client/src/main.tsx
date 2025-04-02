import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/accessibility.css";

// Add a skip link for keyboard users
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-to-content';
skipLink.textContent = 'Skip to content';
document.body.prepend(skipLink);

createRoot(document.getElementById("root")!).render(<App />);
