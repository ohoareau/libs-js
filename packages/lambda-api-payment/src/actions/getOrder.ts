import orderService from '../services/order';
import {ctx, http_response} from "@ohoareau/lambda-utils";

export async function getOrder(ctx: ctx): Promise<http_response> {
    return ctx.helpers.http(await orderService.get(ctx.query));
}

export default getOrder