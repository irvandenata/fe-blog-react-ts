import callAPI from "../utils/callApi";
import { API_VERSION, ROOT_API } from "@/constants/api";


export async function fetchSettingData(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/settings`;
    return callAPI({
        url,
        method: "GET",
        token: true,
    });
}   
