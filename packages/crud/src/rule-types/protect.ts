import Context from '../Context';
import { rule } from './rule';
import UnsatisfiedRoleError from '../errors/UnsatisfiedRoleError';

export const protect = (
    operation: string|string[],
    role: string|string[],
    title: string|undefined = undefined
) => {
    const roles = Array.isArray(role) ? [...role] : [role];
    return rule(operation, 'preAuthorize', title || `restrict only to role${roles.length>1 ? 's' : ''} ${roles.join('|')}`, async (ctx: Context, execCtx: Context) => {
        const declaredRoles = ctx.get('roles', {});
        const checks = {};
        roles.forEach(r => {
            if (!declaredRoles[r]) {
                return;
            }
            checks[r] = (declaredRoles[r]);
        });
        if (!((await Promise.all(Object.keys(checks).map(async c => checks[c](ctx)))).find(b => !!b))) {
            throw new UnsatisfiedRoleError(roles);
        }
    })
};
