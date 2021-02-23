import {ctx} from "../types";

export async function root(ctx: ctx) {
    return ctx.helpers.httpOk({body: {}});
}

export default root