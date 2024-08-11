import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { removeToken } from "./auth";


interface CallAPIProps extends AxiosRequestConfig {
    token?: boolean;
    serverToken?: string;
}

export default async function callAPI({
    url,
    method,
    data,
    token,
    serverToken,
}: CallAPIProps) {
    let headers = {};
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

    
    if (response.status > 300) {
        throw response.data;
    }

    if (response.status === 401) {
        removeToken();
    }

    const { length } = Object.keys(response.data);
    const res = {
        error: false,
        message: "success",
        data: response.data.data,
    };
    return res;
}
