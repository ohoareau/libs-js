import ApplicationError from './ApplicationError';

export default class FieldError extends ApplicationError {
    constructor(field: string, type: string, data: object = {}, defaultMessage: string|undefined = undefined) {
        super(1100, `field.${type}`, defaultMessage || `Field ${field} is ${type}`, { ...data, type, field });
    }
}