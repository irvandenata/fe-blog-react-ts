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

export async function getDataById(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/article-categories/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(data: FormData, id: number): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/article-categories/${id}?_method=PATCH`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}

export async function deleteDataById(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/article-categories/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "DELETE",
        token: true,
    });
    return response;
}
