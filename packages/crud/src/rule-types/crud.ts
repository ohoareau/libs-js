import Context from '../Context';
import { rule } from './rule';

export const on_create = (handler: (ctx: Context, execCtx: Context) => any) => rule('@create', 'before', 'custom', handler);
export const on_update = (handler: (ctx: Context, execCtx: Context) => any) => rule('@update', 'before', 'custom', handler);

