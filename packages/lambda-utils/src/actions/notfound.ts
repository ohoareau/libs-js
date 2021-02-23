import {ctx} from "../types";

export async function notfound(ctx: ctx) {
    return ctx.helpers.httpNotFound();
}

export default notfound