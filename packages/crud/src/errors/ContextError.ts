import ApplicationError from './ApplicationError';

export default class ContextError extends ApplicationError {
    constructor(key: string, type: string, data: object = {}, defaultMessage: string|undefined = undefined) {
        super(2000, `context.${type}`, defaultMessage || `Context info ${key} is ${type}`, { ...data, type, key });
    }
}