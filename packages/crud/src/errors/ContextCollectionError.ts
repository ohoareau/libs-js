import ApplicationError from './ApplicationError';
import ContextError from './ContextError';

export default class ContextCollectionError extends ApplicationError {
    constructor(errors: {[k: string]: ContextError[]}) {
        const kk = Object.keys(errors);
        let message = `Context info${(kk.length > 1) ? `s ${kk.join(' and ')} are ` : `${(kk.length > 1) ? `${kk[0]} is ` : ''}`}invalid`;
        if (kk.length === 1 && errors[kk[0]] && errors[kk[0]].length === 1) {
            message = errors[kk[0]][0].message;
        }
        super(1000, `contextcollection.error`, message, { errors, keys: Object.keys(errors) });
    }
}
