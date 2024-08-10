import callAPI from "../utils/callApi";
import { LoginTypes } from "../interfaces/auth";
import { API_VERSION, ROOT_API } from "@/constants/api";


export async function login(data: LoginTypes): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/auth/login`;
    return callAPI({
        url,
        method: "POST",
        data,
    });
}   
