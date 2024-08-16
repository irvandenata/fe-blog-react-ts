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
    const workExperience = useSelector(
        (state: any) => state.landing.workExperience
    );
    const socialMedia = useSelector((state: any) => state.landing.socialMedia);
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
            <div className="lg:mx-20 md:mx-20 mx-6">
                <FloatingButton />
                <div className="fixed z-9999 bottom-0 left-4">
                    <AnimateSection
                        id="btn-social-media"
                        parentId=""
                        className="delay-1200"
                        inAnimate="animate-fade-in"
                        outAnimate=""
                    >
                        <div className="flex items-center">
                            {socialMedia.data.map((item: any) => {
                                return (
                                    <SocialMediaButton
                                        id={item.id + "-social-media"}
                                        icon={item.icon}
                                        link={item.link}
                                        label={item.subtitle}
                                    />
                                );
                            })}
                        </div>
                    </AnimateSection>
                </div>

                <div
                    id="home"
                    className="relative justify-center items-center h-screen w-full"
                >
                    <div className="flex lg:flex-row flex-col  h-screen">
                        <div className=" mt-10 lg:my-auto md:my-auto ">
                            <div className="mx-auto text-center">
                                <AnimateSection
                                    id="home-image"
                                    parentId="home"
                                    className="delay-1200 lg:max-w-[50%] max-w-[70%]   relative z-10 mx-auto mt-10 lg:mt-0 md:mt-0" 
                                    inAnimate="animate-jump-in"
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

                        <div className=" my-auto  ">
                            <AnimateSection
                                id="home-title"
                                parentId="home"
                                className="delay-500"
                                inAnimate="animate-fade-in"
                                outAnimate="animate-go-away"
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
                    className="w-full z-10 lg:pt-2 md:pt-20 min-h-[80vh]"
                >
                    <AnimateSection
                        className="text-3xl  text-center font-bold dark:text-white text-dark-custom-200"
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
                        <div className="flex lg:md:px-10  rounded-2xl mx-auto lg:w-3/4 md:w-3/4 w-full">
                            <WorkExperienceCard
                                workExperience={workExperience.data}
                            />
                        </div>
                    </div>
                </div>
                <div
                    id="tech-stack"
                    className="w-full z-10 min-h-[80vh]"
                >
                    <AnimateSection
                        className="text-3xl py-10 mb-10  text-center font-bold dark:text-white text-dark-custom-200"
                        id="ts-t"
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
                                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-4 gap-5 md:gap-3 mt-4">
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
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2  text-sm absolute invisible  font-thin text-center mt-2 bg-slate-50 dark:bg-gray-dark p-1 rounded"
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
                                <div className="grid lg:grid-cols-4   md:grid-cols-3 sm:grid-cols-4 gap-5 md:gap-3 mt-4">
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
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2 bg-slate-50 text-sm absolute invisible  font-thin text-center mt-2 dark:bg-gray-dark p-1 rounded"
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
                                                        id={
                                                            `caption-id-` +
                                                            item.id
                                                        }
                                                        className="icon-caption border-2 dark:border-2 dark:border-gray-dark border-bodydark2  text-sm absolute invisible  font-thin text-center mt-2 bg-slate-10 p-1 rounded"
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
                    className="w-full relative z-10 h-screen"
                >
                    <AnimateSection
                        className="text-3xl py-2 text-center font-bold dark:text-white text-dark-custom-200"
                        id="prj"
                        parentId="projects"
                        inAnimate="animate-fade-on"
                        outAnimate="animate-go-away"
                        top={100}
                        bottom={200}
                    >
                        <div>Projects</div>
                    </AnimateSection>
                    <div className="w-full">
                        <div className="flex">
                            {projects.data.map((item: any, index: number) => (
                                <div
                                    key={index + "-projects"}
                                    className="w-1/3 lg:mx-6"
                                >
                                    <AnimateSection
                                        className=""
                                        id={`project-content-` + item.id}
                                        parentId="projects"
                                        inAnimate={`animate-fade-in delay-${
                                            500 * index
                                        }`}
                                        outAnimate="animate-go-away"
                                        top={600}
                                        bottom={200}
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
                        <div className="flex">
                            <div className="w-full text-center">
                                <AnimateSection
                                    className=""
                                    id="more-project"
                                    parentId="projects"
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
                    className="w-full mx-auto relative z-10 h-screen"
                >
                    <CardGetInTouch />
                </div>
                <div className="fixed inset-0 max-h-screen max-w-screen overflow-hidden">
                    <Meteors number={80} className="" />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
