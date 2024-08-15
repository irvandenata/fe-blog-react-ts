import { Outlet } from "react-router-dom";
import StickyNavbar from "@/components/UI/StickyNavbar";
function MainLayout() {
    return (
        <>
            <div id="nav" className=" w-full">
                <StickyNavbar />
            </div>
            <main className="dark:bg-dark relative h-full">
                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;
