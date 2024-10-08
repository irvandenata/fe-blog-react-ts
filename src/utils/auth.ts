import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
export const getAuthToken = () => {
    const token = Cookies.get("token");
    return token;
};

export const tokenLoader = () => {
    const token = getAuthToken();
    if (token) {
        return token;
    }
    return null;
};

export const checkAuthLoader = () => {
    const token = tokenLoader();
    if (!token) {
        return redirect("/login");
    }
    return true;
};

export const ifLogin = () => {
    const token = tokenLoader();
    if (token) {
        return redirect("/admin/dashboard");
    }
    return true;
};

export const logout = () => {
    Cookies.remove("token");
    console.log("Unauthorized");
    return redirect("/login");
    // dispatch(resetDataUserState());
};

export const forceLogout = () => {
    Cookies.remove("token");
    console.log("Unauthorized");
    window.location.href = "/login";
};

export const removeToken = () => {
    Cookies.remove("token");
};
