import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PrimeReactProvider } from "primereact/api";
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ThemeProvider>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </ThemeProvider>
    </Provider>
);
