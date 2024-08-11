import callAPI from "../utils/callApi";
import { API_VERSION, ROOT_API } from "@/constants/api";


export async function fetchSettingData(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/settings`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });

    return response;
}   


export async function updateSettingData(data: any): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/settings`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}
