import FieldError from './FieldError';

export default class ReferencePreconditionFieldError extends FieldError {
    constructor(field: string, referenceField: string, value: any, expected: any, data: object = {}) {
        super(field, 'reference.precondition', {...data, value, expected}, `Forbidden because ${field} ${referenceField} is not ${expected} (currently: ${value})`);
    }
}
