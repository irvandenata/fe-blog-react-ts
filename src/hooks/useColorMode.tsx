import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
    const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

    useEffect(() => {
        if (colorMode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [colorMode]);

    return [colorMode, setColorMode];
};

export default useColorMode;
