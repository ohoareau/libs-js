import {ctx, http_response} from "@ohoareau/lambda-utils";
import buildOrder from "../utils/buildOrder";
import build, {imageman_args} from "@ohoareau/imageman";

export async function imageman(ctx: ctx): Promise<http_response> {
    const {options, ...order} = await buildOrder(ctx);

    // the order is shaped, we now call the imageman processor and return
    // the content of the resulting buffer from imageman

    const buffer = await build(order as imageman_args);

    // the final response will be compatible with API Gateway (statusCode, body, ...)

    return ctx.helpers.buffer({buffer, ...options});
}

export default imageman