import Context from '../Context';
import { rule } from './rule';

export const dump = (operations = '_', types = '_') => {
    return rule(operations, types, 'dump context', (ctx: Context, execCtx: Context) => console.log(ctx, execCtx));
};
