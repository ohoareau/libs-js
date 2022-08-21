import AbstractError from './AbstractError';

export class ResourceNotFoundError extends AbstractError {
    constructor() {
        super('Resource Not Found', 404, 'not-found');
    }
}

export default ResourceNotFoundError;