import {Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    if (!c.globals || (0 === Object.keys(c.globals).length)) return;
    Object.entries(c.globals).forEach(([k, v]) => c[k] = (<Function>v)(c));
}