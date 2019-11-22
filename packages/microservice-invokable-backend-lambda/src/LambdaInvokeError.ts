export default class LambdaInvokeError extends Error {
    protected type: string;
    protected operation: string;
    protected arn: string;
    protected requestPayload: {[key: string]: any};
    protected responsePayload: {errorType: string, errorMessage: string};
    constructor(type, operation, arn, requestPayload, responsePayload) {
        super(`Invoking operation '${operation}' on service '${type}' raise an error when invoking lambda '${arn}': ${responsePayload.errorMessage} (errorType: ${responsePayload.errorType})`);
        this.type = type;
        this.operation = operation;
        this.arn = arn;
        this.requestPayload = requestPayload;
        this.responsePayload = responsePayload;
    }
    getType(): string {
        return this.type;
    }
    getOperation(): string {
        return this.operation;
    }
    getArn(): string {
        return this.arn;
    }
    getRequestPayload(): {[key: string]: any} {
        return this.requestPayload;
    }
    getResponsePayload(): {errorType: string, errorMessage: string} {
        return this.responsePayload;
    }
}