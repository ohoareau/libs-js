import ApplicationError from './ApplicationError';

export default class UnknownPredefinedRoleError extends ApplicationError {
    constructor(name: string, data: object = {}) {
        super(1600, `role.predefined.unknown`, `Unknown pre-defined role '${name}'`, { ...data, name });
    }
}