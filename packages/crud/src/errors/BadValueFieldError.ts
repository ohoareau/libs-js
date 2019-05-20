import ApplicationError from './ApplicationError';
import FieldError from './FieldError';

export default class BadValueFieldError extends FieldError {
    constructor(field: string, value: any, allowed: any[], data: object = {}) {
        super(field, 'bad-value', {...data, allowed}, `Field ${field} value '${ApplicationError.format(value)}' is not allowed (allowed: ${allowed.join(',')})`);
    }
}
