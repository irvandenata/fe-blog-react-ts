import { setActiveMenu } from "@/redux/slices/landingSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function StickyNavbar() {
    const [openNav, setOpenNav] = React.useState(false);

    const activeMenu = useSelector((state: any) => state.landing.activeMenu);
    const [isDark, setIsDark] = React.useState(true);
    const dispatch = useDispatch();
    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    const handleClickTheme = () => {
        // get id theme-toggle-dark-icon
        const darkIcon = document.getElementById("theme-toggle-dark-icon");
        const lightIcon = document.getElementById("theme-toggle-light-icon");
        // check if dark mode is enabled
        if (isDark) {
            // enable dark mode
            document.documentElement.classList.remove("dark");
            darkIcon?.classList.remove("hidden");
            lightIcon?.classList.add("hidden");
            setIsDark(false);
        } else {
            // disable dark mode
            document.documentElement.classList.add("dark");
            darkIcon?.classList.add("hidden");
            lightIcon?.classList.remove("hidden");
            setIsDark(true);
        }
    };

    // function for direct to the section
    const handleDirectToSection = (id: string) => {
        openNav ? setOpenNav(false) : null;
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: "smooth",
        });
        dispatch(setActiveMenu(id));
    };

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2">
            <li className=" dark:text-white font-normal">
                <Link
                    to="/#home"
                    onClick={() => handleDirectToSection("home")}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "home" ? "bg-primary text-white" : "")
                    }
                >
                    Home
                </Link>
            </li>
            <li className=" dark:text-white font-normal">
                <Link
                    to="/#work-experience"
                    onClick={() => handleDirectToSection("work-experience")}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "work-experience"
                            ? "bg-primary text-white"
                            : "")
                    }
                >
                    Work Experience
                </Link>
            </li>
            <li className=" dark:text-white font-normal">
                <Link
                    to="/#tech-stack"
                    onClick={() => handleDirectToSection("tech-stack")}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "tech-stack"
                            ? "bg-primary text-white"
                            : "")
                    }
                >
                    Tech Stack
                </Link>
            </li>
            <li className=" dark:text-white font-normal">
                <Link
                    to="/#projects"
                    onClick={() => handleDirectToSection("projects")}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "projects"
                            ? "bg-primary text-white"
                            : "")
                    }
                >
                    Projects
                </Link>
            </li>
            <li className=" dark:text-white font-normal">
                <Link
                    to="/#get-in-touch"
                    onClick={() => handleDirectToSection("get-in-touch")}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "get-in-touch"
                            ? "bg-primary text-white"
                            : "")
                    }
                >
                    Get in touch
                </Link>
            </li>
            <li className=" dark:text-white font-normal">
                <Link
                    to="/blogs"
                    onClick={() => {
                        openNav ? setOpenNav(false) : null;
                        dispatch(setActiveMenu("blogs"))
                    }}
                    className={
                        "flex items-center px-2 py-1 rounded-lg hover:bg-primary hover:text-white " +
                        (activeMenu === "blogs" ? "bg-primary text-white" : "")
                    }
                >
                    Blogs
                </Link>
            </li>
        </ul>
    );

    return (
        <nav className="absolute top-0 z-10 w-full  max-w-full dark:border-dark dark:bg-dark bg-white  dark:text-white rounded-none px-4 py-2 lg:px-8 lg:py-4">
            <div className="flex items-center dark:text-white justify-between text-blue-gray-900">
                <Link
                    to="/"
                    className="mr-4 w-auto flex cursor-pointer py-1.5 font-medium"
                >
                    <div className="w-6 h-6">
                        <svg
                            fill="#81263A"
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 94.504 94.504"
                            stroke="#81263A"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g>
                                    {" "}
                                    <g>
                                        {" "}
                                        <path d="M93.918,45.833L69.799,21.714c-0.75-0.75-2.077-0.75-2.827,0l-5.229,5.229c-0.781,0.781-0.781,2.047,0,2.828 l17.477,17.475L61.744,64.724c-0.781,0.781-0.781,2.047,0,2.828l5.229,5.229c0.375,0.375,0.884,0.587,1.414,0.587 c0.529,0,1.039-0.212,1.414-0.587l24.117-24.118C94.699,47.881,94.699,46.614,93.918,45.833z"></path>{" "}
                                        <path d="M32.759,64.724L15.285,47.248l17.477-17.475c0.375-0.375,0.586-0.883,0.586-1.414c0-0.53-0.21-1.039-0.586-1.414 l-5.229-5.229c-0.375-0.375-0.884-0.586-1.414-0.586c-0.53,0-1.039,0.211-1.414,0.586L0.585,45.833 c-0.781,0.781-0.781,2.047,0,2.829L24.704,72.78c0.375,0.375,0.884,0.587,1.414,0.587c0.53,0,1.039-0.212,1.414-0.587l5.229-5.229 C33.542,66.771,33.542,65.505,32.759,64.724z"></path>{" "}
                                        <path d="M60.967,13.6c-0.254-0.466-0.682-0.812-1.19-0.962l-4.239-1.251c-1.058-0.314-2.172,0.293-2.484,1.352L33.375,79.382 c-0.15,0.509-0.092,1.056,0.161,1.521c0.253,0.467,0.682,0.812,1.19,0.963l4.239,1.251c0.189,0.056,0.38,0.083,0.567,0.083 c0.863,0,1.66-0.564,1.917-1.435l19.679-66.644C61.278,14.612,61.221,14.065,60.967,13.6z"></path>{" "}
                                    </g>{" "}
                                </g>{" "}
                            </g>
                        </svg>
                    </div>
                    &nbsp; IVD
                </Link>

                <div className="flex items-center gap-4">
                    <div className="mr-4 hidden lg:block">{navList}</div>
                    <div
                        id="theme-toggle"
                        onClick={handleClickTheme}
                        className="text-dark cursor-pointer dark:text-white 
                            hover:bg-slate-200 dark:outline dark:outline-slate-500 
                            dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg text-sm p-2.5"
                    >
                        <svg
                            id="theme-toggle-dark-icon"
                            className="w-4 h-4 hidden"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        <svg
                            id="theme-toggle-light-icon"
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <button
                        className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                    {/* Mobile Nav */}
                    <div
                        className={`${
                            openNav ? "block" : "hidden"
                        } lg:hidden absolute top-0 left-0 w-full h-full bg-white dark:bg-dark dark:text-white
                        
                            animate-fade-in-down animate-duration-300 animate-ease-in-out
                        `}
                    >
                        <div className="flex flex-col  bg-white dark:bg-dark dark:text-white text-dark items-center justify-center h-screen">
                            {navList}
                        </div>

                        <button
                            className="absolute top-0 right-0 mt-4 mr-4 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
                            onClick={() => setOpenNav(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
