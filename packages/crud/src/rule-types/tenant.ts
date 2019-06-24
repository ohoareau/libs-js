import { values } from './values';
import Context from "../Context";
import UnauthorizedTenantError from "../errors/UnauthorizedTenantError";
import { required_context } from "./required_context";

export const tenant = (allowed: string[]|undefined = undefined, field: string = 'tenant', defaultValue: string|undefined = undefined) => [
    values({
        [field]: ({tenant}) => tenant,
    }, (ctx: Context) => {
        const tenant = ctx.get('tenant', defaultValue) || defaultValue;
        if (allowed && !allowed.includes(tenant)) {
            throw new UnauthorizedTenantError(tenant);
        }
        return { tenant };
    }),
    defaultValue ? undefined : required_context('tenant'),
];
