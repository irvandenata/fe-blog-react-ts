import callAPI from "../utils/callApi";
import { API_ENDPOINT, API_VERSION, ROOT_API } from "@/constants/api";

export async function fetchData(query?: {}): Promise<any> {
    const queryParam = new URLSearchParams(query).toString();
    const url = `${API_ENDPOINT}/article-tags?${queryParam}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function createData(data: FormData): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/article-tags`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}

export async function getDataBySlug(slug: string): Promise<any> {
    const url = `${API_ENDPOINT}/article-tags/${slug}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(data: FormData, slug: string): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/article-tags/${slug}?_method=PATCH`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}

export async function deleteDataBySlug(slug: string): Promise<any> {
    const url = `${API_ENDPOINT}/article-tags/${slug}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "DELETE",
        token: true,
    });
    return response;
}
