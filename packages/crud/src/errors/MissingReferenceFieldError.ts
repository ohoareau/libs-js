import ApplicationError from './ApplicationError';
import FieldError from './FieldError';

export default class MissingReferenceFieldError extends FieldError {
    constructor(field: string, value: any, data: object = {}) {
        super(field, 'missing-reference', {...data, value}, `Field ${field} does not contain a valid reference (value: ${ApplicationError.format(value)})`);
    }
}
