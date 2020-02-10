export default class InvokeError extends Error {
    public readonly type: string;
    public readonly operation: string;
    public readonly dsn: string;
    public readonly requestPayload: any;
    public readonly responsePayload: any;
    constructor(type: string, operation: string, dsn: string, requestPayload: any, responsePayload: any) {
        super(`Invoking operation '${operation}' on service '${type}' raise an error when invoking '${dsn}': ${responsePayload.errorMessage} (errorType: ${responsePayload.errorType})`);
        this.type = type;
        this.operation = operation;
        this.dsn = dsn;
        this.requestPayload = requestPayload;
        this.responsePayload = responsePayload;
    }
    getType() {
        return this.type;
    }
    getOperation() {
        return this.operation;
    }
    getDsn() {
        return this.dsn;
    }
    getRequestPayload() {
        return this.requestPayload;
    }
    getResponsePayload() {
        return this.responsePayload;
    }
    serialize() {
        return {
            errorType: 'invoke',
            message: this.message,
            data: {},
            errorInfo: {
                type: this.type,
                operation: this.operation,
                dsn: this.dsn,
            }
        }
    }
}