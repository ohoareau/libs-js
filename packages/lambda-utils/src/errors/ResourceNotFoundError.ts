import {http_request} from "../types";

export class ResourceNotFoundError extends Error {
    protected readonly request;
    constructor(request: http_request) {
        super(ResourceNotFoundError.buildMessageFromRequest(request));
        this.request = request;
    }
    getRequest(): http_request {
        return this.request;
    }
    static buildMessageFromRequest(request: http_request): string {
        return `Resource not found: ${request.uri}`;
    }
}

export default ResourceNotFoundError