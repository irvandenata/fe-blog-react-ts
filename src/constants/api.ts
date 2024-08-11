
const ROOT_API = import.meta.env.VITE_API_ENDPOINT ;
const API_VERSION = import.meta.env.VITE_API_VERSION ;
const API_ENDPOINT = `${ROOT_API}/${API_VERSION}`;
export {
    ROOT_API,
    API_VERSION,
    API_ENDPOINT
}