import { Card3D } from "@/components/Cards/Card3D";
import CardGetInTouch from "@/components/Cards/CardGetInTouch";
import WorkExperienceCard from "@/components/Cards/WorkExperienceCard";
import AnimateSection from "@/components/ui/AnimateSection";
import { BorderMoveCard } from "@/components/ui/BorderMoveCard";
import { TechStack } from "@/components/ui/TechStack";
import { Button } from "@/components/ui/moving-border";
import { setCategoryFilter } from "@/redux/slices/articleSlice";
import {
    setActiveMenu,
    setHeader,
    setProjects,
    setTechStack,
    setWorkExperience,
} from "@/redux/slices/landingSlice";
import {
    fetchDataProjects,
    fetchDataSetting,
    fetchDataTechStack,
    fetchDataWorkExperience,
} from "@/services/landing";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEO/SEOHead";
import {
    generateTitle,
    generateWebsiteSchema,
    generatePersonSchema,
    getAbsoluteUrl,
    stripHtmlTags,
} from "@/utils/seo";

const ANIMATION_DELAYS = {
    HEADER_SHOW: 1000,
    SCROLL_TO_SECTION: 700,
    LOADER_FADE: 1000,
};

const OBSERVER_CONFIG = {
    threshold: 0.7,
};

interface TechStackItem {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
}

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loader = useRef<HTMLDivElement | null>(null);

    const homeRef = useRef<HTMLDivElement>(null);
    const workExperienceRef = useRef<HTMLDivElement>(null);
    const techStackRef = useRef<HTMLDivElement>(null);
    const projectRef = useRef<HTMLDivElement>(null);
    const getInTouchRef = useRef<HTMLDivElement>(null);

    const [isLoad, setIsLoad] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const [isMobile] = useState(window.innerWidth < 768);

    const header = useSelector((state: any) => state.landing.header);
    const techStack = useSelector((state: any) => state.landing.techStack);
    const projects = useSelector((state: any) => state.landing.projects);
    const workExperience = useSelector((state: any) => state.landing.workExperience);

    const initialHashSection = useMemo(() => {
        const hash = window.location.hash.substring(1);
        return hash || "home";
    }, []);

    const scrollToSection = useCallback((id: string) => {
        if (!id) return;
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleLoaderFadeOut = useCallback(() => {
        if (!loader.current) return;

        loader.current.classList.add("animate-fade-out");
        const onAnimationEnd = () => {
            loader.current?.classList.add("hidden");
            loader.current?.removeEventListener("animationend", onAnimationEnd);
        };
        loader.current.addEventListener("animationend", onAnimationEnd);
    }, []);

    const loadInitialData = useCallback(async () => {
        if (header.is_load) {
            setIsLoad(true);
            setTimeout(() => scrollToSection(initialHashSection), ANIMATION_DELAYS.SCROLL_TO_SECTION);
            return;
        }

        dispatch(setActiveMenu(initialHashSection));

        try {
            const [settingRes, techStackRes, workExpRes, projectsRes] = await Promise.all([
                fetchDataSetting(),
                fetchDataTechStack(),
                fetchDataWorkExperience(),
                fetchDataProjects(),
            ]);

            dispatch(setHeader(settingRes.data.header));

            const categorizedTechStack = techStackRes.data.reduce(
                (acc: any, item: TechStackItem) => {
                    if (item.subtitle === "frontend") acc.frontend.push(item);
                    else if (item.subtitle === "backend") acc.backend.push(item);
                    else if (item.subtitle === "others") acc.others.push(item);
                    return acc;
                },
                { frontend: [], backend: [], others: [] }
            );
            dispatch(setTechStack(categorizedTechStack));

            dispatch(setWorkExperience({ data: workExpRes.data, is_load: true }));
            dispatch(setProjects({ data: projectsRes.data, is_load: true }));

            handleLoaderFadeOut();
            setIsLoad(true);

            setTimeout(() => scrollToSection(initialHashSection), ANIMATION_DELAYS.LOADER_FADE);
        } catch (error) {
            console.error("Error loading landing page data:", error);
            setIsLoad(true);
        }
    }, [header.is_load, initialHashSection, dispatch, scrollToSection, handleLoaderFadeOut]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        if (!isLoad) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    dispatch(setActiveMenu(entry.target.id));
                }
            });
        }, OBSERVER_CONFIG);

        const refs = [homeRef, workExperienceRef, techStackRef, projectRef, getInTouchRef];
        refs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            refs.forEach((ref) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, [isLoad, dispatch]);

    useEffect(() => {
        if (!isLoad) return;

        const timer = setTimeout(() => setShowHeader(true), ANIMATION_DELAYS.HEADER_SHOW);
        return () => {
            clearTimeout(timer);
            setShowHeader(false);
        };
    }, [isLoad]);

    const handleIconMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        document.querySelectorAll(".icon-caption").forEach((caption) => {
            caption.classList.add("invisible");
        });

        const caption = e.currentTarget.parentNode?.nextSibling;
        if (caption instanceof HTMLElement) {
            caption.classList.remove("invisible");
        }
    }, []);

    const handleIconMouseLeave = useCallback(() => {
        document.querySelectorAll(".icon-caption").forEach((caption) => {
            caption.classList.add("invisible");
        });
    }, []);

    const handleNavigateToBlog = useCallback(() => {
        dispatch(setCategoryFilter({ category: 1 }));
        navigate("/blogs");
    }, [dispatch, navigate]);

    const renderTechStackItem = useCallback(
        (item: TechStackItem, index: number) => (
            <div
                key={item.id}
                className="flex-row justify-center relative"
                style={{ zIndex: 100 - index }}
            >
                <AnimateSection
                    className="text-start"
                    id={`icon-stack-${item.id}`}
                    parentId="tech-stack"
                    inAnimate={`animate-fade-in delay-${Math.min(200 * index, 1000)}`}
                    outAnimate="animate-go-away"
                    bottom={600}
                >
                    <div className="relative">
                        <div
                            onMouseEnter={handleIconMouseEnter}
                            onMouseLeave={handleIconMouseLeave}
                            className="absolute bg-transparent top-0 left-0 z-20 h-full w-full"
                        />
                        <TechStack
                            captionId={`caption-id-${item.id}`}
                            borderRadius="10px"
                            className="icon-stack p-2 dark:bg-gray-dark bg-slate-50 rounded-lg hover:border-primary dark:hover:border-primary hover:border-2 border-2 dark:border-dark border-bodydark2 cursor-pointer flex items-center justify-center"
                        >
                            <div dangerouslySetInnerHTML={{ __html: item.icon }} />
                        </TechStack>
                    </div>
                    <p
                        id={`caption-id-${item.id}`}
                        className="icon-caption z-30 border-2 dark:border-2 border-bodydark2 text-sm absolute dark:font-thin font-medium text-center mt-2 bg-slate-50 dark:bg-gray-dark p-1 invisible rounded"
                    >
                        {item.title}
                    </p>
                </AnimateSection>
            </div>
        ),
        [handleIconMouseEnter, handleIconMouseLeave]
    );

    const renderTechStackSection = useCallback(
        (title: string, items: TechStackItem[], sectionId: string) => (
            <div className="lg:mx-6">
                <AnimateSection
                    className="text-start"
                    id={`${sectionId}-title`}
                    parentId="tech-stack"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={600}
                >
                    <h2 className="text-lg">{title}</h2>
                </AnimateSection>
                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-3 gap-5 md:gap-3 mt-4 mb-14">
                    {items.map(renderTechStackItem)}
                </div>
            </div>
        ),
        [renderTechStackItem]
    );

    // SEO configuration - memoized untuk performa
    const seoData = useMemo(() => {
        const title = header.data?.title ? stripHtmlTags(header.data.title) : "IRVAN DENATA";
        const description = header.data?.description
            ? stripHtmlTags(header.data.description).substring(0, 155)
            : "Portfolio website showcasing projects, blog articles, and technical expertise in full-stack development.";

        return {
            title: generateTitle(title, "Full Stack Developer Portfolio"),
            description,
            image: header.data?.image || `${window.location.origin}/og-image.png`,
            url: getAbsoluteUrl("/"),
            keywords: [
                "portfolio",
                "full-stack developer",
                "react developer",
                "typescript",
                "web development",
                "software engineer",
                "IRVAN DENATA",
            ],
        };
    }, [header.data]);

    // Structured Data untuk SEO
    const structuredData = useMemo(() => {
        const websiteSchema = generateWebsiteSchema({
            name: "IRVAN DENATA Portfolio",
            description: seoData.description,
            url: seoData.url,
        });

        const personSchema = generatePersonSchema({
            name: "IRVAN DENATA",
            description: seoData.description,
            image: seoData.image,
            url: seoData.url,
            jobTitle: "Full Stack Developer",
            sameAs: [
                // Tambahkan social media URLs
                "https://github.com/IRVAN DENATA",
                "https://linkedin.com/in/IRVAN DENATA",
            ],
        });

        return [websiteSchema, personSchema];
    }, [seoData]);

    if (!isLoad) {
        return (
            <>
                <SEOHead
                    title={seoData.title}
                    description={seoData.description}
                    keywords={seoData.keywords}
                    image={seoData.image}
                    url={seoData.url}
                    type="website"
                    structuredData={structuredData}
                />
                <div className="h-screen w-full relative z-9999">
                    <div
                        id="spinner"
                        ref={loader}
                        className="w-full dark:text-white dark:bg-dark bg-white text-dark h-screen z-99999 flex justify-center items-center fixed top-0 left-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            className="animate-spin"
                            viewBox="0 0 512 512"
                            fill="currentColor"
                        >
                            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEOHead
                title={seoData.title}
                description={seoData.description}
                keywords={seoData.keywords}
                image={seoData.image}
                url={seoData.url}
                type="website"
                structuredData={structuredData}
            />
            <div
                id="home"
                ref={homeRef}
                className="relative z-10 justify-center items-center lg:pt-0 md:pt-0 pt-12 lg:h-screen w-full"
            >
                <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-8 place-content-center grid-col-1 min-h-[100vh]">
                    <div className="lg:basis-1/2 md:basis-1/2 basis-1 lg:my-auto md:my-auto">
                        <div className="mx-auto text-center my-auto">
                            <AnimateSection
                                id="home-image"
                                parentId="home"
                                className={`lg:max-w-[50%] md:max-w-[50%] max-w-[100%] relative z-10 mx-auto transition-opacity duration-500 ${
                                    showHeader ? "opacity-100" : "opacity-0"
                                }`}
                                bottom={600}
                                inAnimate="animate-jump-in delay-1200"
                                outAnimate="animate-go-away"
                            >
                                <BorderMoveCard borderRadius="10px" className="w-full border-2">
                                    <img
                                        src={header.data.image}
                                        alt="profile"
                                        className="rounded-xl w-full max-w-[100%] mx-auto"
                                    />
                                </BorderMoveCard>
                            </AnimateSection>
                        </div>
                    </div>

                    <div className="basis-1/2 my-auto">
                        <AnimateSection
                            id="home-title"
                            parentId="home"
                            className={`transition-opacity duration-500 ${
                                showHeader ? "opacity-100" : "opacity-0"
                            }`}
                            bottom={600}
                            inAnimate="animate-fade-in delay-500"
                            outAnimate="animate-go-away"
                        >
                            <h1 className="md:text-2xl text-left mx-auto text-xl lg:text-4xl font-bold dark:text-white text-dark-custom-200 relative z-20">
                                <span
                                    className="text-justify"
                                    dangerouslySetInnerHTML={{ __html: header.data.title }}
                                />
                            </h1>
                        </AnimateSection>
                        <AnimateSection
                            id="home-description"
                            parentId="home"
                            bottom={600}
                            className={`transition-opacity duration-500 ${
                                showHeader ? "opacity-100" : "opacity-0"
                            }`}
                            inAnimate="animate-fade-in delay-1000"
                            outAnimate="animate-go-away"
                        >
                            <div
                                className="lg:pr-32 mt-3 lg:text-left md:text-left text-justify"
                                dangerouslySetInnerHTML={{ __html: header.data.description }}
                            />
                        </AnimateSection>
                    </div>
                </div>
            </div>

            <div
                id="work-experience"
                ref={workExperienceRef}
                className="w-full z-10 lg:py-10 md:py-20 py-20 min-h-[80vh]"
            >
                <AnimateSection
                    className="text-3xl py-10 text-center font-bold dark:text-white text-dark-custom-200"
                    id="we-title"
                    parentId="work-experience"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={900}
                >
                    <div>Work Experience</div>
                </AnimateSection>
                <div className="w-full" id="work-experience-container">
                    <div className="flex lg:md:px-10 rounded-2xl mx-auto lg:w-3/4 md:w-3/4 w-full">
                        <WorkExperienceCard workExperience={workExperience.data} />
                    </div>
                </div>
            </div>

            <div
                id="tech-stack"
                ref={techStackRef}
                className="w-full relative z-10 grid grid-cols-1 place-content-center min-h-[80vh]"
            >
                <AnimateSection
                    className="text-3xl py-10 text-center font-bold dark:text-white text-dark-custom-200"
                    id="ts-t"
                    parentId="tech-stack"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={600}
                >
                    <div>Tech Stack</div>
                </AnimateSection>
                <div className="w-full">
                    <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1">
                        {renderTechStackSection("Frontend", techStack.frontend, "fe")}
                        {renderTechStackSection("Backend", techStack.backend, "be")}
                        {renderTechStackSection("Others", techStack.others, "ot")}
                    </div>
                </div>
            </div>

            <div
                id="projects"
                ref={projectRef}
                className="w-full py-10 lg:py-2 md:py-2 relative grid place-content-center grid-cols-1 z-10 min-h-screen"
            >
                <AnimateSection
                    className="text-3xl py-10 text-center font-bold dark:text-white text-dark-custom-200"
                    id="prj"
                    parentId="projects"
                    inAnimate="animate-fade-on"
                    outAnimate="animate-go-away"
                    bottom={600}
                >
                    Projects
                </AnimateSection>
                <div className="w-full" id="projects-container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4">
                        {projects.data.map((item: any, index: number) => (
                            <div key={`project-${item.id}`} className="lg:mx-6">
                                <AnimateSection
                                    className=""
                                    id={`project-content-${item.id}`}
                                    parentId={isMobile ? `project-content-${item.id}` : "projects-container"}
                                    inAnimate={`animate-fade-in ${
                                        isMobile ? "" : `delay-${Math.min(500 * index, 1500)}`
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
                                parentId={isMobile ? "more-project" : "projects"}
                                inAnimate="animate-fade-on delay-1500"
                                outAnimate="animate-go-away"
                                bottom={600}
                            >
                                <Button
                                    onClick={handleNavigateToBlog}
                                    borderRadius="1.75rem"
                                    className="bg-white px-10 py-2 dark:hover:bg-primary dark:bg-slate-900 text-black font-extrabold dark:text-white border-neutral-200 dark:border-slate-800"
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
                ref={getInTouchRef}
                className="w-full lg:py-20 md:py-20 py-30 grid grid-cols-1 place-content-center mx-auto min-h-screen relative z-10"
            >
                <CardGetInTouch />
            </div>
        </>
    );
};

export default LandingPage;
