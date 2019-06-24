import Context from '../Context';
import { rule } from './rule';
import ContextError from '../errors/ContextError';
import RequiredContextError from '../errors/RequiredContextError';
import ContextCollectionError from '../errors/ContextCollectionError';

type contextErrorAccumulator = {
    missings: string[],
    errors: {
        [key: string]: ContextError[],
    },
}

export const required_context = (
    keys: string[]|string = []
) => {
    keys = ('string' === typeof keys) ? [keys] : keys;
    keys = Object.keys(keys.reduce((a, f) => {a[f] = true; return a;}, <{[k: string]: boolean}>{}));
    if (!keys || !keys.length) {
        return undefined;
    }
    return rule(
        '@',
        'validate',
        `check mandatory context info${keys.length > 1 ? 's' : ''} ${keys.map(f => `\`${f}\``).join(', ')} ${keys.length > 1 ? 'are' : 'is'} present`,
        async (ctx: Context) => {
            const validation = (<string[]>keys).reduce((acc, f) => {
                if (!ctx.get(f, undefined)) {
                    acc.missings.push(f);
                    acc.errors[f] = [new RequiredContextError(f)];
                }
                return acc;
            }, <contextErrorAccumulator>{missings: [], errors: {}});
            if (0 < validation.missings.length) {
                throw new ContextCollectionError(validation.errors);
            }
        }
    );
};
