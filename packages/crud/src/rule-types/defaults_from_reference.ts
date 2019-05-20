import Context from "../Context";
import { defaults } from "./defaults";

export const defaults_from_reference = (field: string, defs: string[]) => {
    const stringifiedDefs = defs.join(', ');
    return defaults(
        (ctx: Context) => {
            const dd = ctx.get('data');
            const o = ctx.get('caches')[field][dd[field].id];
            return defs.reduce((acc, k) => {
                if (!acc[k]) {
                    acc[k] = o[k] || undefined;
                }
                return acc;
            }, dd);
        },
        undefined,
        `set ${stringifiedDefs} from ${field} (reference)`
    );
};
