import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { Button } from "./UI/moving-border";
const FloatingButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const homeSection = document.getElementById("home");
            const homeSectionHeight = homeSection!.offsetHeight;
            const currentScroll = window.scrollY;

            if (currentScroll > homeSectionHeight) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <a
                href="#home"
                className={`fixed bottom-4 z-9999 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out ${
                    showButton
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                }`}
            >
                <div className="">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white w-15 h-15 dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        <FaChevronUp className="h-6 w-6 text-white" />
                    </Button>
                </div>
            </a>
        </>
    );
};

export default FloatingButton;
