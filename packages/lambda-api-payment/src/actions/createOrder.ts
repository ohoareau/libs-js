import orderService from '../services/order';
import {ctx, http_response} from "@ohoareau/lambda-utils";

export async function createOrder(ctx: ctx): Promise<http_response> {
    return ctx.helpers.http(await orderService.create(ctx.query));
}

export default createOrder