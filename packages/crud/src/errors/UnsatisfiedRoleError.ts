import ApplicationError from './ApplicationError';

export default class UnsatisfiedRoleError extends ApplicationError {
    constructor(role: string|string[], data: object = {}) {
        role = Array.isArray(role) ? [...role] : [role];
        super(1610, `role.unsatisfied`, `Missing ${role.length > 1 ? 'one of ' : ''}role${role.length > 1 ? 's' : ''} ${role.join(', ')}`, { ...data, roles: role });
    }
}