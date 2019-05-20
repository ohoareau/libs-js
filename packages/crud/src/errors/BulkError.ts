import ApplicationError from './ApplicationError';

export default class BulkError extends ApplicationError {
    constructor(errors: Error[], data: object = {}, defaultMessage: string|undefined = undefined) {
        super(1300, `bulk`, defaultMessage || `Bulk`, { ...data, errors});
    }
    getErrors(): Error[] {
        return this.data.errors;
    }
}