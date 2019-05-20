import Context from '../Context';
import { rule } from './rule';
import FieldError from '../errors/FieldError';
import RequiredFieldError from '../errors/RequiredFieldError';
import FieldCollectionError from '../errors/FieldCollectionError';

type fieldErrorAccumulator = {
    missings: string[],
    errors: {
        [key: string]: FieldError[],
    },
}

export const required = (
    fields: string[]|string = []
) => {
    fields = ('string' === typeof fields) ? [fields] : fields;
    fields = Object.keys(fields.reduce((a, f) => {a[f] = true; return a;}, <{[k: string]: boolean}>{}));
    if (!fields || !fields.length) {
        return undefined;
    }
    return rule(
        '@create',
        'validate',
        `check mandatory field${fields.length > 1 ? 's' : ''} ${fields.map(f => `\`${f}\``).join(', ')} ${fields.length > 1 ? 'are' : 'is'} present`,
        async (ctx: Context, execCtx: Context) => {
            const dd = ctx.get('data', {});
            const validation = (<string[]>fields).reduce((acc, f) => {
                if (!dd.hasOwnProperty(f)) {
                    acc.missings.push(f);
                    acc.errors[f] = [new RequiredFieldError(f)];
                }
                return acc;
            }, <fieldErrorAccumulator>{missings: [], errors: {}});
            if (0 < validation.missings.length) {
                throw new FieldCollectionError(validation.errors);
            }
        }
    );
};
