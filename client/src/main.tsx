import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app/App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store.tsx";
import { socket } from "./socket.tsx";

socket.connect();

createRoot(document.getElementById("root")!).render(
        <StrictMode>
                <Provider store={store}>
                        <App />
                </Provider>
        </StrictMode>,
);
