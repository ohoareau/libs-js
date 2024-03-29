import AbstractError from './AbstractError';

export class DocumentNotFoundError extends AbstractError {
    constructor(type, value, key: string = 'id') {
        value = ('string' === typeof value) ? value : JSON.stringify(value);
        super(`Unknown ${type} ${'id' === key ? '' : `with ${key} is `}'${value}'`, 404, 'document-not-found', {}, {type, key: key, value: value, [key]: value});
    }
}

export default DocumentNotFoundError;