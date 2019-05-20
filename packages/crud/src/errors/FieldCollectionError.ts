import ApplicationError from './ApplicationError';
import FieldError from './FieldError';

export default class FieldCollectionError extends ApplicationError {
    constructor(errors: {[k: string]: FieldError[]}) {
        const kk = Object.keys(errors);
        let message = `Field${(kk.length > 1) ? `s ${kk.join(' and ')} are ` : `${(kk.length > 1) ? `${kk[0]} is ` : ''}`}invalid`;
        if (kk.length === 1 && errors[kk[0]] && errors[kk[0]].length === 1) {
            message = errors[kk[0]][0].message;
        }
        super(1000, `fieldcollection.error`, message, { errors, fields: Object.keys(errors) });
    }
}
