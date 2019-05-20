import Context from '../Context';
import { defaults } from './defaults';
import { rule } from './rule';
import BadValueFieldError from '../errors/BadValueFieldError';

export const restrict = (
    field: string,
    allowedValues: any[],
    defaultValue: any = undefined
) => [
    defaultValue ? defaults({[field]: defaultValue}) : undefined,
    rule('@create|@update', 'validate', `field \`${field}\` must match enum values ${JSON.stringify(allowedValues)}`, (ctx: Context, execCtx: Context) => {
        const dd = ctx.get('data');
        if (!dd || !dd.hasOwnProperty(field)) {
            return;
        }
        if (!allowedValues.includes(dd[field])) {
            throw new BadValueFieldError(field, dd[field], allowedValues);
        }
    }),
];