import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ImageDetailModal from "../Modals/ImageDetailModal";
import { useDispatch } from "react-redux";
import { resetModal} from "@/redux/slices/imageModalSlice";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
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
            <div
                id="background"
                className="p-5 bg-white dark:bg-boxdark-2 h-screen w-full"
            ></div>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
                {/* <!-- ===== Page Wrapper Start ===== --> */}
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        <Header
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                <Outlet />
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
                {/* <!-- ===== Page Wrapper End ===== --> */}
            </div>
            <ImageDetailModal
                onClose={() => {
                    dispatch(resetModal());
                }}
            >
                <h1>Image Detail Modal</h1>
            </ImageDetailModal>
        </>
    );
}

export default AdminLayout;
