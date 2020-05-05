import AbstractError from './AbstractError';

export default class InvokeError extends AbstractError {
    public readonly type: string;
    public readonly operation: string;
    public readonly dsn: string;
    public readonly requestPayload: any;
    public readonly responsePayload: any;
    constructor(type: string, operation: string, dsn: string, requestPayload: any, responsePayload: any) {
        super(
            `Invoking operation '${operation}' on service '${type}' raise an error when invoking '${dsn}': ${responsePayload.errorMessage} (errorType: ${responsePayload.errorType})`,
            500,
            'invoke',
            {},
            {type, operation, dsn}
        );
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
}