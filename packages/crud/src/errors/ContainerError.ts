import ApplicationError from './ApplicationError';

export default class ContainerError extends ApplicationError {
    constructor(type: string, message: string, data: object = {}) {
        super(1700, `container.${type}`, message, { ...data, type });
    }
}