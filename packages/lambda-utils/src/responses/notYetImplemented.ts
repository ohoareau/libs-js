import httpError from "./httpError";

export async function notYetImplemented({headers = {}} = {}) {
    return httpError({headers, statusCode: 404});
}

export default notYetImplemented