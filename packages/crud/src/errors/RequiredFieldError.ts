import FieldError from './FieldError';

export default class RequiredFieldError extends FieldError {
    constructor(field: string, data: object = {}) {
        super(field, 'required', data);
    }
}
