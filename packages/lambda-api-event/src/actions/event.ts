import {ctx, http_response} from "@ohoareau/lambda-utils";

export async function event(ctx: ctx): Promise<http_response> {
    // @todo
    console.log(ctx);
    return {};
}

export default event