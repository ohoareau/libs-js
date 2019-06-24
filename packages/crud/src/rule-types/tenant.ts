import { values } from './values';
import Context from "../Context";
import UnauthorizedTenantError from "../errors/UnauthorizedTenantError";

export const tenant = (field: string = 'tenant', allowed: string[]|undefined = undefined) => [
    values({
        [field]: ({tenant}) => ({tenant}),
    }, (ctx: Context) => {
        const tenant = ctx.get('tenant');
        if (allowed && !allowed.includes(tenant)) {
            throw new UnauthorizedTenantError(tenant);
        }
        return { tenant };
    }),
];
