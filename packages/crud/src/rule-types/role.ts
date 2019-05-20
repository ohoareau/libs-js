import Context from '../Context';
import { rule } from './rule';

export const role = (name: string, description: string, isValid: (ctx: Context, execCtx: Context) => boolean) => {
    return rule('@', 'prepare', `define role \`${name}\` as ${description}`, (ctx: Context, execCtx: Context) => {
        let roles = ctx.get('roles');
        if (!roles) {
            roles = {};
            ctx.set('roles', roles);
        }
        roles[name] = isValid;
    });
};