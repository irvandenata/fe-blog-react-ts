import callAPI from "../utils/callApi";
import { API_ENDPOINT, API_VERSION, ROOT_API } from "@/constants/api";

export async function fetchData(query?: {}): Promise<any> {
    const queryParam = new URLSearchParams(query).toString();
    const url = `${API_ENDPOINT}/article-categories?${queryParam}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function createData(data: FormData): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/article-categories`;
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
    const url = `${API_ENDPOINT}/article-categories/${slug}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(data: FormData, slug: string): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/article-categories/${slug}?_method=PATCH`;
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
    const url = `${API_ENDPOINT}/article-categories/${slug}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "DELETE",
        token: true,
    });
    return response;
}
