import webhookService from '../services/webhook';
import {ctx, http_response} from "@ohoareau/lambda-utils";

export async function webhook(ctx: ctx): Promise<http_response> {
    return ctx.helpers.http(await webhookService.process(ctx.query));
}

export default webhook