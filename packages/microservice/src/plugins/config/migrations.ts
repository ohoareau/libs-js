import {Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    if (false === c.migration) return;
    c.types = c.types || [];
    c.migration = ('string' === typeof c.migration) ? c.migration : `${ctx.root}/migrations/${c.type}`;
    (c.types||[]).push({type: 'migration', backend: c['backend'], migration: false});
}