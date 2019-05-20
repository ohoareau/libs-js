import ApplicationError from './ApplicationError';
import FieldError from './FieldError';

export default class SameValueFieldError extends FieldError {
    constructor(field: string, value: any, data: object = {}) {
        super(field, 'same-value', {...data, value}, `Field ${field} already has value '${ApplicationError.format(value)}'`);
    }
}
