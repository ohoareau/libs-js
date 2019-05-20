import { values } from "./values";
import Context from "../Context";

export const defaults = (
    defs,
    prepareCallback: ((ctx: Context) => any)|undefined = undefined,
    title: string|undefined = undefined
) => values(
    defs,
    prepareCallback,
    title,
    false
);