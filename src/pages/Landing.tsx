import { Card3D } from "@/components/Cards/Card3D";
import CardGetInTouch from "@/components/Cards/CardGetInTouch";
import WorkExperienceCard from "@/components/Cards/WorkExperienceCard";
import FloatingButton from "@/components/FloatingButton";
import SocialMediaButton from "@/components/SocialMediaButton";
import AnimateSection from "@/components/UI/AnimateSection";
import { BorderMoveCard } from "@/components/UI/BorderMoveCard";
import { TechStack } from "@/components/UI/TechStack";
import { Meteors } from "@/components/UI/meteors";
import { Button } from "@/components/UI/moving-border";
import {
    setActiveMenu,
    setHeader,
    setProjects,
    setSocialMedia,
    setTechStack,
    setWorkExperience,
} from "@/redux/slices/landingSlice";
import {
    fetchDataProjects,
    fetchDataSetting,
    fetchDataSocialMedia,
    fetchDataTechStack,
    fetchDataWorkExperience,
} from "@/services/landing";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LandingPage = () => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const header = useSelector((state: any) => state.landing.header);
    const loader = useRef<HTMLDivElement | null>(null);
    const techStack = useSelector((state: any) => state.landing.techStack);
    const projects = useSelector((state: any) => state.landing.projects);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const workExperience = useSelector(
        (state: any) => state.landing.workExperience
    );
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
                if (url === "") {
                    dispatch(setActiveMenu("home"));
                } else {
                    dispatch(setActiveMenu(url));
                }
                await fetchDataSetting().then((res) => {
                    dispatch(setHeader(res.data.header));
                    // animate make loader fade out
                    loader.current?.classList.add("animate-fade-out");
                    loader.current?.addEventListener("animationend", () => {
                        loader.current?.classList.add("hidden");
                    });
                    setIsLoad(true);
                    setTimeout(() => {
                        handleDirectToSection(url);
                    }, 1000);
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

                fetchDataWorkExperience().then((res) => {
                    const response = res.data;
                    dispatch(
                        setWorkExperience({ data: response, is_load: true })
                    );
                });

                fetchDataProjects().then((res) => {
                    const response = res.data;
                    dispatch(setProjects({ data: response, is_load: true }));
                });

                fetchDataSocialMedia().then((res) => {
                    const response = res.data;
                    dispatch(setSocialMedia({ data: response, is_load: true }));
                });
            } else {
                setIsLoad(true);
                setTimeout(() => {
                    handleDirectToSection(url);
                }, 700);
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

    return !isLoad ? (
        <div className="h-screen w-full relative z-9999">
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
            <FloatingButton />
            <div
                id="home"
                className="relative z-10 justify-center items-center lg:h-screen w-full"
            >
                <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-8 place-content-center grid-col-1 min-h-screen">
                    <div className="lg:basis-1/2 md:basis-1/2 basis-1 mt-10 lg:my-auto md:my-auto">
                        <div className="mx-auto text-center">
                            <AnimateSection
                                id="home-image"
                                parentId="home"
                                className="lg:max-w-[50%] md:max-w-[50%]  max-w-[100%] relative z-10 mx-auto"
                                inAnimate="animate-jump-in delay-1200 opacity-0"
                                outAnimate="animate-go-away"
                            >
                                <BorderMoveCard
                                    borderRadius="10px"
                                    className="w-full border-2 "
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

                    <div className="basis-1/2 my-auto  ">
                        <AnimateSection
                            id="home-title"
                            parentId="home"
                            className=""
                            inAnimate="animate-fade-in delay-500 opacity-0"
                            outAnimate="animate-go-away "
                        >
                            <h1 className="md:text-2xl text-left mx-auto text-xl lg:text-4xl font-bold dark:text-white text-dark-custom-200 relative z-20">
                                <span
                                    className="text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: header.data.title,
                                    }}
                                ></span>
                            </h1>
                        </AnimateSection>
                        <AnimateSection
                            id="home-description"
                            parentId="home"
                            className=""
                            inAnimate="animate-fade-in delay-1000 opacity-0"
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
                className="w-full z-10 lg:py-10 md:py-20 py-20 min-h-[80vh]"
            >
                <AnimateSection
                    className="text-3xl py-10 text-center font-bold dark:text-white text-dark-custom-200"
                    id="we-title"
                    parentId="work-experience"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away delay-0 "
                    bottom={600}
                >
                    <div>Work Experience</div>
                </AnimateSection>
                <div className="w-full" id="work-experience-container">
                    <div className="flex lg:md:px-10  rounded-2xl mx-auto lg:w-3/4 md:w-3/4 w-full">
                        <WorkExperienceCard
                            workExperience={workExperience.data}
                        />
                    </div>
                </div>
            </div>
            <div
                id="tech-stack"
                className="w-full relative z-10 grid grid-cols-1 place-content-center  min-h-[80vh]"
            >
                <AnimateSection
                    className="text-3xl py-10  text-center font-bold dark:text-white text-dark-custom-200"
                    id="ts-t"
                    parentId="tech-stack"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={200}
                >
                    <div>Tech Stack</div>
                </AnimateSection>
                <div className="w-full">
                    <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1">
                        <div className=" lg:mx-6">
                            <AnimateSection
                                className="text-start"
                                id="be-title"
                                parentId="tech-stack"
                                inAnimate="animate-fade-on"
                                outAnimate="animate-go-away"
                                bottom={200}
                            >
                                <h2 className="text-lg">Frontend</h2>
                            </AnimateSection>
                            <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-3 gap-5 md:gap-3 mt-4 mb-14">
                                {techStack.frontend.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={item.id}
                                            id={`icon-stack-` + item.id}
                                            className="flex-row justify-center static"
                                        >
                                            <AnimateSection
                                                className={`text-start `}
                                                id={`icon-stack-` + item.id}
                                                parentId="tech-stack"
                                                inAnimate={`animate-fade-in delay-${
                                                    200 * index
                                                }`}
                                                outAnimate="animate-go-away"
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
                                                        className="icon-stack p-2 dark:bg-gray-dark bg-slate-50 rounded-lg hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
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
                                                    id={`caption-id-` + item.id}
                                                    className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2  text-sm absolute invisible   dark:font-thin font-medium text-center mt-2 bg-slate-50 dark:bg-gray-dark p-1 rounded"
                                                >
                                                    {item.title}
                                                </p>
                                            </AnimateSection>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className=" lg:mx-6">
                            <AnimateSection
                                className="text-start"
                                id="be-title"
                                parentId="tech-stack"
                                inAnimate="animate-fade-on"
                                outAnimate="animate-go-away"
                                bottom={200}
                            >
                                <h2 className="text-lg">Backend</h2>
                            </AnimateSection>
                            <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-3 gap-5 md:gap-3 mt-4 mb-14">
                                {techStack.backend.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={item.id}
                                            id={`icon-stack-` + item.id}
                                            className="flex-row justify-center static"
                                        >
                                            <AnimateSection
                                                className={`text-start `}
                                                id={`icon-stack-` + item.id}
                                                parentId="tech-stack"
                                                inAnimate={`animate-fade-in delay-${
                                                    200 * index
                                                }`}
                                                outAnimate="animate-go-away"
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
                                                        className="icon-stack p-2 dark:bg-gray-dark bg-slate-50 rounded-lg hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
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
                                                    id={`caption-id-` + item.id}
                                                    className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2  text-sm absolute invisible   dark:font-thin font-medium text-center mt-2 bg-slate-50 dark:bg-gray-dark p-1 rounded"
                                                >
                                                    {item.title}
                                                </p>
                                            </AnimateSection>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className=" lg:mx-6">
                            <AnimateSection
                                className="text-start"
                                id="be-title"
                                parentId="tech-stack"
                                inAnimate="animate-fade-on"
                                outAnimate="animate-go-away"
                                bottom={200}
                            >
                                <h2 className="text-lg">Others</h2>
                            </AnimateSection>
                            <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-3 gap-5 md:gap-3 mt-4 mb-14">
                                {techStack.others.map(
                                    (item: any, index: number) => (
                                        <div
                                            key={item.id}
                                            id={`icon-stack-` + item.id}
                                            className="flex-row justify-center static"
                                        >
                                            <AnimateSection
                                                className={`text-start `}
                                                id={`icon-stack-` + item.id}
                                                parentId="tech-stack"
                                                inAnimate={`animate-fade-in delay-${
                                                    200 * index
                                                }`}
                                                outAnimate="animate-go-away"
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
                                                        className="icon-stack p-2 dark:bg-gray-dark rounded-lg bg-slate-50 hover:border-primary dark:hover:border-primary  hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
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
                                                    id={`caption-id-` + item.id}
                                                    className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2  text-sm absolute invisible   dark:font-thin font-medium text-center mt-2 bg-slate-50 dark:bg-gray-dark p-1 rounded"
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
                className="w-full py-10 lg:py-2 md:py-2 relative grid place-content-center grid-cols-1 z-10 min-h-screen"
            >
                <AnimateSection
                    className="text-3xl py-10 text-center font-bold dark:text-white text-dark-custom-200"
                    id="prj"
                    parentId="prj"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={0}
                >
                    Projects
                </AnimateSection>
                <div className="w-full" id="projects-container">
                    <div className="grid grid-cols-1  lg:grid-cols-3 md:grid-cols-3 gap-4 ">
                        {projects.data.map((item: any, index: number) => (
                            <div key={index + "-projects"} className="lg:mx-6 ">
                                <AnimateSection
                                    className=""
                                    id={`project-content-` + item.id}
                                    parentId={
                                        isMobile
                                            ? `project-content-` + item.id
                                            : `projects-container`
                                    }
                                    inAnimate={`animate-fade-in delay-${
                                        isMobile ? 0 : 500 * index
                                    }`}
                                    outAnimate="animate-go-away"
                                    bottom={600}
                                >
                                    <Card3D
                                        title={item.title}
                                        category={item.category.name}
                                        image_url={item.image_url}
                                        slug={item.slug}
                                    />
                                </AnimateSection>
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-10">
                        <div className="w-full text-center">
                            <AnimateSection
                                className=""
                                id="more-project"
                                parentId={
                                    isMobile ? "more-project" : "projects"
                                }
                                inAnimate="animate-fade-on delay-1500"
                                outAnimate="animate-go-away"
                                bottom={200}
                            >
                                <Button
                                    borderRadius="1.75rem"
                                    className="bg-white px-10 py-2
                                        dark:hover:bg-primary
                                    dark:bg-slate-900 text-black font-extrabold dark:text-white border-neutral-200 dark:border-slate-800"
                                >
                                    More Projects
                                </Button>
                            </AnimateSection>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id="get-in-touch"
                className="w-full grid grid-cols-1 place-content-center mx-auto  min-h-screen relative z-10"
            >
                <CardGetInTouch />
            </div>
        </>
    );
};

export default LandingPage;
