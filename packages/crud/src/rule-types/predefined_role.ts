import Context from '../Context';
import { role } from './role';
import {ruleType} from "./rule";
import UnknownPredefinedRoleError from "../errors/UnknownPredefinedRoleError";

const has_one_of_these_member_roles = (ctx: Context, roles: string[]) => {
    const caller = ctx.get('caller');
    const old = ctx.get('old');
    return old && old.members && caller && caller.id && old.members[caller.id] && old.members[caller.id].role && roles.includes(old.members[caller.id].role);
};

const is_authenticated = (ctx: Context): boolean => !!<any>ctx.get('caller', {authenticated: false}).authenticated;

export const anonymous_role = () => role('anonymous', 'not authenticated', (ctx: Context, execCtx: Context): boolean => {
    return !is_authenticated(ctx);
});

export const user_role = () => role('user', 'authenticated', (ctx: Context, execCtx: Context): boolean => {
    return is_authenticated(ctx);
});

export const owner_role = () => role('owner', 'member who have exactly owner role', (ctx: Context, execCtx: Context): boolean => {
    return has_one_of_these_member_roles(ctx, ['owner']);
});

export const admin_role = () => role('admin', 'member who have admin or owner role', (ctx: Context, execCtx: Context): boolean => {
    return has_one_of_these_member_roles(ctx, ['owner', 'admin']);
});

export const exactly_admin_role = () => role('admin!', 'member who have exactly admin role', (ctx: Context, execCtx: Context): boolean => {
    return has_one_of_these_member_roles(ctx, ['admin']);
});

export const member_role = () => role('member', 'member who have member, admin or owner role', (ctx: Context, execCtx: Context): boolean => {
    return has_one_of_these_member_roles(ctx, ['owner', 'admin', 'member']);
});

export const exactly_member_role = () => role('member!', 'member who have exactly member role', (ctx: Context, execCtx: Context): boolean => {
    return has_one_of_these_member_roles(ctx, ['member']);
});

export const any_role = () => role('any', 'always true', (ctx: Context, execCtx: Context): boolean => {
    return true;
});

export const platform_admin_role = () => role('admin@platform', 'technical account of the platform', (ctx: Context, execCtx: Context): boolean => {
    return !!ctx.get('caller', {}).platform;
});

export const predefined_role = (name: string|string[]): ruleType|ruleType[] => {
    let rules = <ruleType[]>(Array.isArray(name) ? name : [name]).map(n => {
        switch (n) {
            case 'anonymous': return anonymous_role();
            case 'user': return user_role();
            case 'owner': return owner_role();
            case 'admin': return admin_role();
            case 'admin!': return exactly_admin_role();
            case 'member': return member_role();
            case 'member!': return exactly_member_role();
            case 'any': return any_role();
            case 'admin@platform': return platform_admin_role();
            default:
                throw new UnknownPredefinedRoleError(n);
        }
    });
    return (1 === rules.length) ? (<ruleType[]>rules)[0] : rules;
};