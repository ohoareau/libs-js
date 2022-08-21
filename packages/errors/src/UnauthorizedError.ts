import AbstractError from './AbstractError';

export class UnauthorizedError extends AbstractError {
    constructor() {
        super(`Unauthorized`, 401, 'unauthorized');
    }
}

export default UnauthorizedError;