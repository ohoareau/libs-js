import Context from '../Context';
import { rule } from './rule';

export const timestamps = () => {
    return rule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time', (ctx: Context, execCtx: Context) => {
        const op = execCtx.get('operation');
        const date = new Date(Date.now()).toISOString();
        let dd = ctx.get('data');
        if (!dd) {
            dd = {};
            ctx.set('data', dd);
        }
        if ('@create' === op) {
            dd.createdAt = date;
            ctx.get('data').updatedAt = date;
        } else if ('@update' === op) {
            ctx.get('data').updatedAt = date;
        }
    });
};