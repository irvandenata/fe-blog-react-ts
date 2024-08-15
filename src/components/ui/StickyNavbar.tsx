import React from "react";
import { Link } from "react-router-dom";

export default function StickyNavbar() {
    const [openNav, setOpenNav] = React.useState(false);

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
        if (localStorage.theme === "dark" || !("theme" in localStorage)) {
            //add class=dark in html element
            document.documentElement.classList.add("dark");
            darkIcon!.classList.add("hidden");
            lightIcon!.classList.remove("hidden");
        } else {
            //remove class=dark in html element
            document.documentElement.classList.remove("dark");
            darkIcon!.classList.remove("hidden");
            lightIcon!.classList.add("hidden");
        }

        if (localStorage.theme === "dark") {
            localStorage.theme = "light";
        } else {
            localStorage.theme = "dark";
        }
    };

    // function for direct to the section
    const handleDirectToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="p-1 dark:text-white font-normal">
                <Link
                    to="/#home"
                    onClick={() => handleDirectToSection("home")}
                    className="flex items-center"
                >
                    Home
                </Link>
            </li>
            <li className="p-1 dark:text-white font-normal">
                <Link
                    to="/#work-experience"
                    onClick={() => handleDirectToSection("work-experience")}
                    className="flex items-center"
                >
                    Work Experience
                </Link>
            </li>
            <li className="p-1 dark:text-white font-normal">
                <Link
                    to="/#tech-stack"
                    onClick={() => handleDirectToSection("tech-stack")}
                    className="flex items-center"
                >
                    Tech Stack
                </Link>
            </li>
            <li className="p-1 dark:text-white font-normal">
                <Link
                    to="/#projects"
                    onClick={() => handleDirectToSection("projects")}
                    className="flex items-center"
                >
                    Projects
                </Link>
            </li>
            <li className="p-1 dark:text-white font-normal">
                <Link
                    to="/#get-in-touch"
                    onClick={() => handleDirectToSection("get-in-touch")}
                    className="flex items-center"
                >
                    Get in touch
                </Link>
            </li>
            <li className="p-1 dark:text-white font-normal">
                <Link to="/login" className="flex items-center">
                    Blogs
                </Link>
            </li>
        </ul>
    );

    return (
        <nav className="absolute top-0 z-10 w-full  max-w-full dark:border-dark dark:bg-dark bg-white  dark:text-white rounded-none px-4 py-2 lg:px-8 lg:py-4">
            <div className="flex items-center dark:text-white justify-between text-blue-gray-900">
                <Link to="/" className="mr-4 cursor-pointer py-1.5 font-medium">
                    Ivd
                </Link>
                <div className="flex items-center gap-4">
                    <div className="mr-4 hidden lg:block">{navList}</div>

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
                        } lg:hidden absolute top-0 left-0 w-full h-full bg-white dark:bg-dark dark:text-white`}
                    >
                        <div className="flex flex-col  bg-white items-center justify-center h-screen">
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
                <div className="flex items-center gap-x-1">
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
                </div>
            </div>
        </nav>
    );
}
