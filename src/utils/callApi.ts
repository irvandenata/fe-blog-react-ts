import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { forceLogout } from "./auth";


interface CallAPIProps extends AxiosRequestConfig {
    token?: boolean;
    serverToken?: string;
}

export default async function callAPI({
    headers,
    url,
    method,
    data,
    token,
    serverToken,
}: CallAPIProps) {
    if (serverToken) {
        headers = {
            Authorization: `Bearer ${serverToken}`,
        };
    } else if (token) {
        const tokenCookies = Cookies.get("token");
        if (tokenCookies) {
            const jwtToken = atob(tokenCookies);
            headers = {
                Authorization: `Bearer ${jwtToken}`,
            };
        }
    }



    const response = await axios({
        url,
        method,
        data,
        headers,
    }).catch((err) => err.response);

    if (response.status === 401) {
        forceLogout();
    }
    if (response.status > 300) {
        throw response.data;
    }
    
    const meta = response.data.meta;

    const res = {
        error: false,
        message: "success",
        data: response.data.data,
        meta,
    };
    return res;
}
