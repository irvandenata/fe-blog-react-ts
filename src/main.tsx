import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PrimeReactProvider } from "primereact/api";
import { HelmetProvider } from "react-helmet-async";

// @material-tailwind/react's ThemeProvider was removed: no Material Tailwind
// component is rendered anywhere, and the package cost ~413 kB (39%) of the
// main bundle. Re-add it here if an MT component is ever introduced.
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <HelmetProvider>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </HelmetProvider>
    </Provider>
);
