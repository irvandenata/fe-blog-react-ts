import  { useEffect, useState } from "react";
import { Button } from "./ui/moving-border";
const FloatingButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const homeSection = document.getElementById("home") || document.getElementById("main-layout");
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

    const handleDirectToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <>
            <button
                type="button"
                aria-label="Kembali ke atas"
                onClick={() => handleDirectToSection("home")}
                // Hidden from keyboard and AT while invisible, so it is not a
                // focusable target the user cannot see.
                aria-hidden={!showButton}
                tabIndex={showButton ? 0 : -1}
                className={`fixed bottom-4 z-9999 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
                    showButton
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none opacity-0 translate-y-4"
                }`}
            >
                <div className="">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white w-15 h-15 dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        {/* Inline SVG instead of react-icons: importing a
                            single icon from react-icons/fa pulled the whole
                            Font Awesome set (~1.3 MB) into the main bundle. */}
                        <svg
                            className="h-6 w-6 dark:text-white text-dark"
                            viewBox="0 0 448 512"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z" />
                        </svg>
                    </Button>
                </div>
            </button>
        </>
    );
};

export default FloatingButton;
