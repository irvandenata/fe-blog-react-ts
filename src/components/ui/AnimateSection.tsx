import React, { useEffect, useState } from "react";

const AnimateSection: React.FC<{
    children: React.ReactNode;
    id: string;
    className?: string;
    outAnimate?: string;
}> = ({ children, id, className = "", outAnimate = "animate-fade-out" }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById(id);
            const rect = section!.getBoundingClientRect();

            const isInViewport =
                rect.top + 100 >= 0 && rect.bottom - 100 <= window.innerHeight;
            if (isInViewport) {
                //remove hidden
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check on component mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, [id]);

    return (
        <div
            id={id}
            className={`${className}  ${
                isVisible ? ` opacity-100` : `opacity-0 ${outAnimate}`
            }`}
            onAnimationEnd={() => !isVisible && setIsVisible(false)}
        >
            {children}
        </div>
    );
};

export default AnimateSection;
