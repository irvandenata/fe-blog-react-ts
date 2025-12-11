import callAPI from "../utils/callApi";
import { ROOT_API, API_VERSION } from "@/constants/api";

export async function uploadImage(file: File): Promise<{ data: { url: string } }> {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${ROOT_API}/${API_VERSION}/upload/image`;
    const response = await callAPI({
        url,
        method: "POST",
        data: formData,
        token: true,
    });

    return response;
}

export async function uploadEditorImage(file: File): Promise<{ location: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${ROOT_API}/${API_VERSION}/upload/editor-image`;
    const response = await callAPI({
        url,
        method: "POST",
        data: formData,
        token: true,
    });

    return { location: response.data.url };
}
