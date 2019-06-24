import ApplicationError from './ApplicationError';

export default class UnauthorizedTenantError extends ApplicationError {
    constructor(tenant: string|undefined) {
        super(1900, 'tenant.unauthorized', `Unauthorized tenant`, { tenant });
    }
}