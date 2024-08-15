import callAPI from "../utils/callApi";
import { API_VERSION, ROOT_API } from "@/constants/api";


export async function fetchDataSetting(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/settings`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}   