import {request} from "../types";

export class ResourceNotFoundError extends Error {
    protected readonly request;
    constructor(request: request) {
        super(ResourceNotFoundError.buildMessageFromRequest(request));
        this.request = request;
    }
    getRequest(): request {
        return this.request;
    }
    static buildMessageFromRequest(request: request): string {
        return `Resource not found: ${request.uri}`;
    }
}

export default ResourceNotFoundError