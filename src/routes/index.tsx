import { Navigate, createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/Error";
import MainLayout from "../pages/MainLayout";
import AdminLayout from "../pages/AdminLayout";
import LandingPage from "../pages/Landing";
import LoginPage from "../pages/Auth/Login";
import DashboardPage from "../pages/Admin/Dashboard";
import SettingPage from "../pages/Admin/Setting";
import { checkAuthLoader, ifLogin, logout } from "@/utils/auth";
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
                    loader:ifLogin,
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
            children: [
                {
                    path: "dashboard",
                    element: <DashboardPage />,
                },
                {
                    path: "settings",
                    element: <SettingPage />,
                },
            ],
        },
    ],
    {}
);
