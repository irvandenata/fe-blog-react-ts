import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PrimeReactProvider } from "primereact/api";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <HelmetProvider>
            <ThemeProvider>
                <PrimeReactProvider>
                    <App />
                </PrimeReactProvider>
            </ThemeProvider>
        </HelmetProvider>
    </Provider>
);
