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

export async function fetchDataTechStack(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_subtitles[]=others&search_subtitles[]=frontend&search_subtitles[]=backend&"`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


export async function fetchDataSocialMedia(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_type_id=1&"`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}

export async function fetchDataWorkExperience(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/custom-informations?per_page=1000&search_type_id=3&"`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}


export async function fetchDataProjects(): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/data/articles?per_page=3&search_latest=true&search_category_id=1&"`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });

    return response;
}

