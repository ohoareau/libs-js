import httpError from "./httpError";

export async function httpNotFound({headers = {}}) {
    return httpError({headers, statusCode: 404});
}

export default httpNotFound