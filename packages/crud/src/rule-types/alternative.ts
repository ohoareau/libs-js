import Context from '../Context';
import { ruleType } from './rule';

export const alternative = (
    field: string,
    alternative: {[key: string]: object|any[]|Function}
) => {
    return Object.keys(alternative).reduce((acc, k: string) => {
        return acc.concat(conditionalizeAlternative(alternative[k], field, k));
    }, <ruleType[]>[]);
};

const conditionalizeAlternativeSingle = (a, field: string, value: string): ruleType => {
    return <ruleType>Object.assign(a, {condition: (ctx: Context, execCtx: Context): boolean => {
        const dd = ctx.get('data', {});
        return dd[field] && (value === dd[field]);
    }});
};

const conditionalizeAlternative = (a, field: string, value: string): any => {
    if (Array.isArray(a)) {
        return a.map(aa => {
            if (Array.isArray(aa)) {
                return conditionalizeAlternative(aa, field, value);
            }
            if ('function' === typeof(aa)) {
                return conditionalizeAlternative(aa, field, value);
            }
            const r = conditionalizeAlternativeSingle(aa, field, value);
            return Array.isArray(r) ? <ruleType[]>r : <ruleType[]>([r]);
        });
    }
    if ('function' === typeof(a)) {
        return conditionalizeAlternative(a(), field, value);
    }
    const r = conditionalizeAlternativeSingle(a, field, value);
    return Array.isArray(r) ? <ruleType[]>r : <ruleType[]>([r]);
};