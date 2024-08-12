import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../components/Layouts/AdminLayout";
import LandingPage from "../pages/Landing";
import LoginPage from "../pages/Auth/Login";
import DashboardPage from "../pages/Admin/Dashboard";
import SettingPage from "../pages/Admin/Setting";
import CustomInformationPage from "../pages/Admin/CustomInformation";
import CustomInformationTypePage from "../pages/Admin/CustomInformationType";
import { checkAuthLoader, ifLogin, logout } from "@/utils/auth";
import MainLayout from "@/components/Layouts/MainLayout";
import ErrorPage from "@/pages/Error";
import { middlewareLoader } from "@/utils/middleware";
export default createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <LandingPage />,
                },
                {
                    path: "login",
                    element: <LoginPage />,
                    loader: ifLogin,
                },
                {
                    path: "logout",
                    loader: logout,
                },
            ],
        },
        {
            path: "admin",
            element: <AdminLayout />,
            errorElement: <ErrorPage />,
            loader: checkAuthLoader,
            action: () => {
                return null;
            },
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage />,
                    loader: middlewareLoader,
                },
                {
                    path: "settings",
                    element: <SettingPage />,
                    loader: middlewareLoader,
                },
                {
                    path: "custom-informations/items",
                    element: <CustomInformationPage />,
                    loader: middlewareLoader,
                },
                {
                    path: "custom-informations/types",
                    element: <CustomInformationTypePage />,
                    loader: middlewareLoader,
                },
                {
                    path: "custom-informations/items",
                    element: <CustomInformationPage />,
                    loader: middlewareLoader,
                },
            ],
        },
    ],
    {}
);
