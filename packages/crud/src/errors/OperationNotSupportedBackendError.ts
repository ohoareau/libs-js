import BackendError from "./BackendError";

export default class OperationNotSupportedBackendError extends BackendError{
    constructor(backend: string, operation: string, data: object = {}) {
        super(backend, 'operation.not-supported', {...data, operation}, `Operation ${operation} is not supported by backend ${backend}`);
    }
}