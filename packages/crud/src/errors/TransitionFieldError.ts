import ApplicationError from './ApplicationError';
import FieldError from './FieldError';

export default class TransitionFieldError extends FieldError {
    constructor(field: string, value: any, oldValue: any, data: object = {}) {
        super(field, 'transition', {...data, value, oldValue}, `Field ${field} transition from ${ApplicationError.format(oldValue)} to ${ApplicationError.format(value)} is not allowed`);
    }
}
