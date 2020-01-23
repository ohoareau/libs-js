class InvokeError extends Error {
    constructor(type, operation, dsn, requestPayload, responsePayload) {
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

module.exports = InvokeError;