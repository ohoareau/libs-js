export type ctx = {
    path: string,
    resourcePath: string,
    method: string,
    config: any,
    responses: any,
}

export type http_response = {
    body?: string|object
    contentType?: string,
    headers?: any,
    statusCode?: number,
}
