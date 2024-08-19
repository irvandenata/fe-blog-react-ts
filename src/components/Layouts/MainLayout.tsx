import { Outlet } from "react-router-dom";
import StickyNavbar from "@/components/UI/StickyNavbar";
import { Meteors } from "../UI/meteors";
import AnimateSection from "../UI/AnimateSection";
import { useDispatch, useSelector } from "react-redux";
import SocialMediaButton from "../SocialMediaButton";
import FloatingButton from "../FloatingButton";
import { useState } from "react";
import { fetchDataSocialMedia } from "@/services/landing";
import { setSocialMedia } from "@/redux/slices/landingSlice";
import { Toaster } from "react-hot-toast";
function MainLayout() {
    const socialMedia = useSelector((state: any) => state.landing.socialMedia);
    const dispatch = useDispatch();
    useState(() => {
        fetchDataSocialMedia().then((res) => {
            const response = res.data;
            dispatch(setSocialMedia({ data: response, is_load: true }));
        });
    });
    return (
        <>
            <Toaster
                toastOptions={{
                    className:
                        "dark:bg-dark-custom-200 dark:text-white text-sm z-[9999]",
                    style: {
                        zIndex: 9999,
                    },
                }}
            />
            <div id="nav" className=" w-full">
                <StickyNavbar />
            </div>
            <main
                className=" bg-white dark:bg-dark relative h-full"
                id="main-layout"
            >
                <div
                    id="background"
                    className="p-5 bg-white dark:bg-dark h-screen w-full"
                ></div>
                <div className="lg:mx-20 md:mx-20 mx-6">
                    <div className="fixed z-9999 bottom-2 left-4">
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
                                            key={
                                                item.id + "-social-media-parent"
                                            }
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
                    <div className="relative bg-white dark:bg-dark">
                        <FloatingButton />
                        <Outlet />
                    </div>

                    <div className="fixed inset-0 z-4 max-h-screen max-w-screen overflow-hidden">
                        <Meteors number={80} className="" />
                    </div>
                </div>
            </main>
        </>
    );
}

export default MainLayout;
