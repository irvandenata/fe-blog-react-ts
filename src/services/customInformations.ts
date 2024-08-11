import callAPI from "../utils/callApi";
import { API_ENDPOINT, API_VERSION, ROOT_API } from "@/constants/api";


export async function fetchData(query? : {}): Promise<any> {

    const queryParam = new URLSearchParams(query).toString();
    const url = `${API_ENDPOINT}/information-types?${queryParam}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(data: any): Promise<any> {
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
