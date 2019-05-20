import ApplicationError from './ApplicationError';

export default class BackendError extends ApplicationError {
    constructor(backend: string, type: string, data: object = {}, defaultMessage: string|undefined = undefined) {
        super(1200, `backend.${type}`, defaultMessage || `Backend ${backend} ${type}`, { ...data, backend });
    }
}