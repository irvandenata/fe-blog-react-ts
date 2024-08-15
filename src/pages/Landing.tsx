import FloatingButton from "@/components/FloatingButton";
import AnimateSection from "@/components/UI/AnimateSection";
import { Meteors } from "@/components/UI/meteors";
import { setHeader } from "@/redux/slices/landingSlice";
import { fetchDataSetting } from "@/services/landing";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LandingPage = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const header = useSelector((state: any) => state.landing.header);
    const loader = useRef<HTMLDivElement | null>(null);
    const handleDirectToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useState(() => {
        const url = window.location.href;
        const urlSplit = url.split("#");

        if (urlSplit.length > 1) {
            const id = urlSplit[1];
            setUrl(id);
        }
    });

    useEffect(() => {
        if (!header.is_load) {
            fetchDataSetting().then((res) => {
                dispatch(setHeader(res.data.header));
                // animate make loader fade out
                loader.current?.classList.add("animate-fade-out");
                loader.current?.addEventListener("animationend", () => {
                    loader.current?.classList.add("hidden");
                });
                setTimeout(() => {
                    setIsLoad(true);
                }, 700);
            });
        }
        if (url) {
            handleDirectToSection(url);
        }
    }, [url]);

    return !isLoad ? (
        <div className="dark:bg-dark h-screen w-screen relative z-999999">
            <div
                id="spinner"
                ref={loader}
                className="w-full bg-white 
            
            h-screen z-99999 flex justify-center bg-background items-center fixed top-0 left-0"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    className="animate-spin"
                    viewBox="0 0 512 512"
                >
                    <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"></path>
                </svg>
            </div>
        </div>
    ) : (
        <>
            <div
                id="background"
                className="p-5 bg-white dark:bg-dark h-screen w-full"
            ></div>
            <div className="lg:mx-20">
                <FloatingButton />
                <div
                    id="home"
                    className="justify-center items-center h-screen w-full"
                >
                    <div className="flex h-screen">
                        <div className="w-1/2  my-auto ">
                            <div className="mx-auto text-center">
                                <AnimateSection
                                    id="home"
                                    className="animate-jump-in duration-500 delay-1400"
                                    outAnimate="animate-jump-out"
                                >
                                    <img
                                        src={header.data.image}
                                        alt="profile"
                                        className="p-10 relative z-9999 rounded w-full max-w-[60%] mx-auto"
                                    />
                                </AnimateSection>
                            </div>
                        </div>

                        <div className="w-1/2  my-auto  ">
                            <AnimateSection
                                id="home"
                                className="animate-fade-in duration-1000 delay-500"
                            >
                                <h1 className="md:text-3xl text-left mx-auto text-2xl lg:text-6xl font-bold dark:text-white text-dark-custom-200 relative z-20">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: header.data.title,
                                        }}
                                    ></span>
                                </h1>
                            </AnimateSection>
                            <AnimateSection
                                id="home"
                                className="animate-fade-in duration-1000 delay-1000"
                            >
                                <div
                                    className="lg:pr-32 mt-3"
                                    dangerouslySetInnerHTML={{
                                        __html: header.data.description,
                                    }}
                                ></div>
                            </AnimateSection>
                        </div>
                    </div>
                </div>
                <div
                    id="work-experience"
                    className="w-full h-screen grid place-content-center"
                >
                    Work Experience
                </div>
                <div
                    id="tech-stack"
                    className="w-full h-screen grid place-content-center"
                >
                    Tech Stack
                </div>
                <div
                    id="projects"
                    className="w-full h-screen grid place-content-center"
                >
                    Project
                </div>
                <div
                    id="get-in-touch"
                    className="w-full h-screen grid place-content-center"
                >
                    Get in touch
                </div>
                <div className="fixed inset-0 max-h-screen max-w-screen overflow-hidden">
                    <Meteors number={80} className="" />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
