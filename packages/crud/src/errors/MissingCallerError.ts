import ApplicationError from './ApplicationError';

export default class MissingCallerError extends ApplicationError {
    constructor(data: object = {}) {
        super(1800, 'caller.missing', `Missing caller information`, data);
    }
}