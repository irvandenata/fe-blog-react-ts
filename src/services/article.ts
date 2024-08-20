import callAPI from "../utils/callApi";
import { API_ENDPOINT, API_VERSION, ROOT_API } from "@/constants/api";

export async function fetchData(query?: {}): Promise<any> {
    const queryParam = new URLSearchParams(query).toString();
    const url = `${API_ENDPOINT}/articles?${queryParam}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}


export async function fetchDataCategories(): Promise<any> {
    const url = `${API_ENDPOINT}/data/article-categories?all_data=true`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function fetchDataNoAuth(query?: {}): Promise<any> {
    const queryParam = new URLSearchParams(query).toString();
    const url = `${API_ENDPOINT}/data/articles?${queryParam}&`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
    });
    return response;
}


export async function getDataBySlug(slug:string): Promise<any> {
    const url = `${API_ENDPOINT}/data/articles/${slug}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function createData(data: FormData): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/articles`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}

export async function getDataById(id:number): Promise<any> {
    const url = `${API_ENDPOINT}/articles/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(data: FormData, id:number): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/articles/${id}?_method=PATCH`;
    // handling when error
    const response = await callAPI({
        url,
        method: "POST",
        data,
        token: true,
    });

    return response;
}

export async function deleteDataById(id:number): Promise<any> {
    const url = `${API_ENDPOINT}/articles/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "DELETE",
        token: true,
    });
    return response;
}
