import FloatingButton from "@/components/FloatingButton";
import AnimateSection from "@/components/UI/AnimateSection";
import { BorderMoveCard } from "@/components/UI/BorderMoveCard";
import { TechStack } from "@/components/UI/TechStack";
import { InfiniteMovingCards } from "@/components/UI/infinite-moving-cards";
import { Meteors } from "@/components/UI/meteors";
import { setHeader, setTechStack } from "@/redux/slices/landingSlice";
import { fetchDataSetting, fetchDataTechStack } from "@/services/landing";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LandingPage = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const header = useSelector((state: any) => state.landing.header);
    const loader = useRef<HTMLDivElement | null>(null);
    const techStack = useSelector((state: any) => state.landing.techStack);
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
        const loadPage = async () => {
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

                fetchDataTechStack().then((res) => {
                    const response = res.data;
                    let fe: any = [];
                    let be: any = [];
                    let ot: any = [];
                    response.forEach((item: any) => {
                        if (item.subtitle === "frontend") {
                            fe.push(item);
                        } else if (item.subtitle === "backend") {
                            be.push(item);
                        } else if (item.subtitle === "others") {
                            ot.push(item);
                        }
                    });
                    dispatch(
                        setTechStack({ frontend: fe, backend: be, others: ot })
                    );
                });
            }
            if (url) {
                handleDirectToSection(url);
            }
        };

        loadPage();
    }, [url]);

    const onMouseEnter = (e: any) => {
        const captions = document.getElementsByClassName("icon-caption");
        for (let i = 0; i < captions.length; i++) {
            captions[i].classList.add("invisible");
        }

        const caption = e.target.parentNode.nextSibling;
        if (caption) {
            caption.classList.remove("invisible");
        }
    };

    const onMouseLeave = (e: any) => {
        // get all caption and hide
        const captions = document.getElementsByClassName("icon-caption");
        for (let i = 0; i < captions.length; i++) {
            captions[i].classList.add("invisible");
        }
    };

    const testimonials = [
        {
            quote: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
            name: "Charles Dickens",
            title: "A Tale of Two Cities",
        },
        {
            quote: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
            name: "William Shakespeare",
            title: "Hamlet",
        },
        {
            quote: "All that we see or seem is but a dream within a dream.",
            name: "Edgar Allan Poe",
            title: "A Dream Within a Dream",
        },
        {
            quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
            name: "Jane Austen",
            title: "Pride and Prejudice",
        },
        {
            quote: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
            name: "Herman Melville",
            title: "Moby-Dick",
        },
    ];

    return !isLoad ? (
        <div className="dark:bg-dark h-screen w-screen relative z-999999">
            <div
                id="spinner"
                ref={loader}
                className="w-full bg-white 
            
            h-screen z-99999 flex justify-center  items-center fixed top-0 left-0"
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
                                    id="home-image"
                                    parentId="home"
                                    className="delay-1200 max-w-[50%] relative z-10 mx-auto"
                                    inAnimate="animate-jump-in"
                                    outAnimate="animate-go-away"
                                >
                                    <BorderMoveCard borderRadius="10px"
                                    className="w-full border-2"
                                    >
                                        <img
                                            src={header.data.image}
                                            alt="profile"
                                            className="rounded-xl w-full max-w-[100%] mx-auto"
                                        />
                                    </BorderMoveCard>
                                </AnimateSection>
                            </div>
                        </div>

                        <div className="w-1/2  my-auto  ">
                            <AnimateSection
                                id="home-title"
                                parentId="home"
                                className="delay-500"
                                inAnimate="animate-fade-in"
                                outAnimate="animate-go-away"
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
                                id="home-description"
                                parentId="home"
                                className="delay-1000"
                                inAnimate="animate-fade-in"
                                outAnimate="animate-go-away"
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
                    className="w-full relative z-10 h-screen grid grid-cols-1 place-content-center"
                >
                    <AnimateSection
                        className="text-3xl py-10  text-center font-bold dark:text-white text-dark-custom-200"
                        id="we-t"
                        parentId="work-experience"
                        inAnimate="animate-fade-on"
                        outAnimate="animate-go-away"
                        top={600}
                        bottom={200}
                    >
                        <div>Work Experience</div>
                    </AnimateSection>
                    <div className="w-full ">
                        <div className="flex w-full">
                            {/* <div className="w-1/4  my-auto ">box1</div>
                            <div className="w-1/4  my-auto ">box1</div>
                            <div className="w-1/4  my-auto ">box1</div>
                            <div className="w-1/4  my-auto ">box1</div> */}

                            <div className="rounded-md w-full flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                                <AnimateSection
                                    className="text-3xl py-10  text-center font-bold dark:text-white text-dark-custom-200"
                                    id="we-t"
                                    parentId="work-experience"
                                    inAnimate="animate-fade-on"
                                    outAnimate="animate-go-away"
                                    top={600}
                                    bottom={200}
                                >
                                    <InfiniteMovingCards
                                        items={testimonials}
                                        direction="right"
                                        speed="slow"
                                    />
                                </AnimateSection>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="tech-stack"
                    className="w-full relative z-10 h-screen grid grid-cols-1 place-content-center"
                >
                    <AnimateSection
                        className="text-3xl py-10 mb-10  text-center font-bold dark:text-white text-dark-custom-200"
                        id="we-t"
                        parentId="tech-stack"
                        inAnimate="animate-fade-on"
                        outAnimate="animate-go-away"
                        top={600}
                        bottom={200}
                    >
                        <div>Tech Stack</div>
                    </AnimateSection>
                    <div className="w-full">
                        <div className="flex">
                            <div className="w-1/3 lg:mx-6">
                                <AnimateSection
                                    className="text-start"
                                    id="be-title"
                                    parentId="tech-stack"
                                    inAnimate="animate-fade-on"
                                    outAnimate="animate-go-away"
                                    top={600}
                                    bottom={200}
                                >
                                    <h2 className="text-lg">Frontend</h2>
                                </AnimateSection>
                                <div className="grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-4 gap-5 md:gap-3 mt-4">
                                    {techStack.frontend.map(
                                        (item: any, index: number) => (
                                            <div
                                                key={item.id}
                                                id={`icon-stack-` + item.id}
                                                className="flex-row justify-center static"
                                            >
                                                <AnimateSection
                                                    className={`text-center `}
                                                    id={`icon-stack-` + item.id}
                                                    parentId="tech-stack"
                                                    inAnimate={`animate-fade-in delay-${
                                                        400 * index
                                                    }`}
                                                    outAnimate="animate-go-away"
                                                    top={600}
                                                    bottom={200}
                                                >
                                                    <div className="relative z-100">
                                                        <div
                                                            onMouseEnter={
                                                                onMouseEnter
                                                            }
                                                            onMouseLeave={
                                                                onMouseLeave
                                                            }
                                                            className="absolute bg-transparent  top-0 left-0 z-999 h-full w-full"
                                                        ></div>
                                                        <TechStack
                                                            captionId={
                                                                `caption-id-` +
                                                                item.id
                                                            }
                                                            borderRadius="10px"
                                                            className="icon-stack p-2 bg-gray-dark rounded-lg hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
                                                        >
                                                            <div
                                                                className=""
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.icon,
                                                                }}
                                                            />
                                                        </TechStack>
                                                    </div>
                                                    <p
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border border-gray dark:border text-sm absolute invisible  font-thin text-center mt-2 bg-gray-dark p-1 rounded"
                                                    >
                                                        {item.title}
                                                    </p>
                                                </AnimateSection>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 lg:mx-6">
                                <AnimateSection
                                    className="text-start"
                                    id="be-title"
                                    parentId="tech-stack"
                                    inAnimate="animate-fade-on"
                                    outAnimate="animate-go-away"
                                    top={600}
                                    bottom={200}
                                >
                                    <h2 className="text-lg">Backend</h2>
                                </AnimateSection>
                                <div className="grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-4 gap-5 md:gap-3 mt-4">
                                    {techStack.backend.map(
                                        (item: any, index: number) => (
                                            <div
                                                key={item.id}
                                                id={`icon-stack-` + item.id}
                                                className="flex-row justify-center static"
                                            >
                                                <AnimateSection
                                                    className={`text-center `}
                                                    id={`icon-stack-` + item.id}
                                                    parentId="tech-stack"
                                                    inAnimate={`animate-fade-in delay-${
                                                        400 * index
                                                    }`}
                                                    outAnimate="animate-go-away"
                                                    top={600}
                                                    bottom={200}
                                                >
                                                    <div className="relative z-100">
                                                        <div
                                                            onMouseEnter={
                                                                onMouseEnter
                                                            }
                                                            onMouseLeave={
                                                                onMouseLeave
                                                            }
                                                            className="absolute bg-transparent  top-0 left-0 z-999 h-full w-full"
                                                        ></div>
                                                        <TechStack
                                                            captionId={
                                                                `caption-id-` +
                                                                item.id
                                                            }
                                                            borderRadius="10px"
                                                            className="icon-stack p-2 bg-gray-dark rounded-lg hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
                                                        >
                                                            <div
                                                                className=""
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.icon,
                                                                }}
                                                            />
                                                        </TechStack>
                                                    </div>
                                                    <p
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border border-gray dark:border text-sm absolute invisible  font-thin text-center mt-2 bg-gray-dark p-1 rounded"
                                                    >
                                                        {item.title}
                                                    </p>
                                                </AnimateSection>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="w-1/3 lg:mx-6">
                                <AnimateSection
                                    className="text-start"
                                    id="be-title"
                                    parentId="tech-stack"
                                    inAnimate="animate-fade-on"
                                    outAnimate="animate-go-away"
                                    top={600}
                                    bottom={200}
                                >
                                    <h2 className="text-lg">Others</h2>
                                </AnimateSection>
                                <div className="grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-4 gap-5 md:gap-3 mt-4">
                                    {techStack.backend.map(
                                        (item: any, index: number) => (
                                            <div
                                                key={item.id}
                                                id={`icon-stack-` + item.id}
                                                className="flex-row justify-center static"
                                            >
                                                <AnimateSection
                                                    className={`text-center `}
                                                    id={`icon-stack-` + item.id}
                                                    parentId="tech-stack"
                                                    inAnimate={`animate-fade-in delay-${
                                                        400 * index
                                                    }`}
                                                    outAnimate="animate-go-away"
                                                    top={600}
                                                    bottom={200}
                                                >
                                                    <div className="relative z-100">
                                                        <div
                                                            onMouseEnter={
                                                                onMouseEnter
                                                            }
                                                            onMouseLeave={
                                                                onMouseLeave
                                                            }
                                                            className="absolute bg-transparent  top-0 left-0 z-999 h-full w-full"
                                                        ></div>
                                                        <TechStack
                                                            captionId={
                                                                `caption-id-` +
                                                                item.id
                                                            }
                                                            borderRadius="10px"
                                                            className="icon-stack p-2 bg-gray-dark rounded-lg hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
                                                        >
                                                            <div
                                                                className=""
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.icon,
                                                                }}
                                                            />
                                                        </TechStack>
                                                    </div>
                                                    <p
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border border-gray dark:border text-sm absolute invisible  font-thin text-center mt-2 bg-gray-dark p-1 rounded"
                                                    >
                                                        {item.title}
                                                    </p>
                                                </AnimateSection>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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
