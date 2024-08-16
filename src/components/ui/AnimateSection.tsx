import React, { useEffect, useState } from "react";

const AnimateSection: React.FC<{
    children: React.ReactNode;
    id: string;
    parentId?: string;
    className?: string;
    outAnimate?: string;
    inAnimate?: string;
    top?: number;
    bottom?: number;
}> = ({
    children,
    id,
    parentId,
    className = "",
    outAnimate = "",
    inAnimate = "animate-fade-in",
    top = 300,
    bottom = 0,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleScroll = () => {
            if (!parentId){
                setIsVisible(true);
                return;
            }
            const section = document.getElementById(parentId);
            const rect = section!.getBoundingClientRect();
            if(id === "we-title"){
                console.log("rect top ", rect.top);
                console.log("rect bottom ", rect.bottom);
                console.log("window.innerHeight ", window.innerHeight);

            }
            const isInViewport =
                rect.top + top >= 0 && rect.bottom - bottom <= window.innerHeight ;
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
    }, [parentId]);

    return (
        <div
            id={id}
            ref={componentRef}
            className={` ${className} ${
                isVisible ? `  ${inAnimate} ` : ` ${outAnimate}`
            }   opacity-0`}
        >
            {children}
        </div>
    );
};

export default AnimateSection;
