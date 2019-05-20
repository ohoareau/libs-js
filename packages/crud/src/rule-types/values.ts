import { rule } from './rule';
import Context from "../Context";
import { converter, stringifyValues } from '../utils';

export const values = (values: {[k: string]: any}|Function, prepareCallback: ((ctx: Context) => any)|undefined = undefined, title: string|undefined = undefined, overwrite = true) => {
    let keys = ('function' !== typeof values) ? (values ? Object.keys(values) : []) : undefined;
    if (keys !== undefined && !keys.length) {
        return undefined;
    }
    return rule('@create', 'before', title || `set${!keys ? '' : ` ${stringifyValues(values)}`}${overwrite ? '' : ` if not provided (defaults)`}`, async (ctx: Context, execCtx: Context) => {
        const prepared = {};
        if (prepareCallback) {
            Object.assign(prepared, (await prepareCallback(ctx)) || {});
        }
        if (!keys) {
            values = await (<Function>values)(ctx, execCtx, prepared);
            keys = Object.keys(values);
        }
        const vals = keys.reduce((a, k) => {
            if ('function' === typeof values[k]) {
                a[k] = values[k](prepared);
            } else {
                a[k] = values[k];
            }
            return a;
        }, {});
        let dd = ctx.get('data');
        if (!dd) {
            dd = {};
            ctx.set('data', dd);
        }
        Object.assign(dd, overwrite ? converter(vals, ctx, execCtx) : Object.assign(converter(vals, ctx, execCtx), dd));
    });
};