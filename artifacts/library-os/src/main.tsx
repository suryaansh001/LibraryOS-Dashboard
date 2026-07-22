import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api/v1").replace(/\/+$/, "");

setBaseUrl(apiBaseUrl);
setAuthTokenGetter(() => localStorage.getItem("library-os-access-token"));

createRoot(document.getElementById("root")!).render(<App />);
