import {Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    if (!c.actions || (0 === Object.keys(c.actions).length)) return;
    Object.entries(c.actions).forEach(([k, v]) => c[k] = <Function>((<Function>v)(c)));
}