import { ICustomInformationTypeCreate } from "@/interfaces/customInformation";
import callAPI from "../utils/callApi";
import { API_ENDPOINT, API_VERSION, ROOT_API } from "@/constants/api";

export async function fetchData(query?: {}): Promise<any> {
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

export async function createData(
    data: ICustomInformationTypeCreate
): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/information-types`;
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
    const url = `${API_ENDPOINT}/information-types/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "GET",
        token: true,
    });
    return response;
}

export async function updateData(
    data: ICustomInformationTypeCreate,
    id: number
): Promise<any> {
    const url = `${ROOT_API}/${API_VERSION}/information-types/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "PATCH",
        data,
        token: true,
    });

    return response;
}


export async function deleteDataById(id: number): Promise<any> {
    const url = `${API_ENDPOINT}/information-types/${id}`;
    // handling when error
    const response = await callAPI({
        url,
        method: "DELETE",
        token: true,
    });
    return response;
}
