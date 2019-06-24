import ContextError from './ContextError';

export default class RequiredContextError extends ContextError {
    constructor(key: string, data: object = {}) {
        super(key, 'required', data);
    }
}
