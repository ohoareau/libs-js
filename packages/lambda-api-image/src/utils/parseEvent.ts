import buildOrderFromRequest from "./buildOrderFromRequest";
import parseRequestEvent from "./parseRequestEvent";
import {order} from "../types";

export async function parseEvent(event: any, context: any, config: any = {}): Promise<order> {

    // first, we need to retrieve useful information from the API-gateway shaped event (uri, method, params, ...)

    const request = parseRequestEvent(event);

    // then, we need to convert this request into an imageman-compatible order
    // (with a list of operations, input location, ...).
    // essentially depending on the request uri with patterns that are detected based on rules from the config.

    const order = await buildOrderFromRequest(request, config);

    // the order is now dynamically built, we just need to define default values in case some information are missing.
    // the resulting order is always outputing to a buffer (for the lambda handler to serialize it).

    return {
        ...order,
        output: 'buffer',
        sourceTypes: {
            ...(config.sourceTypes || {}),
            ...(order.sourceTypes || {}),
        },
        targetTypes: {
            ...(config.targetTypes || {}),
            ...(order.targetTypes || {}),
        },
        options: {
            ...(order.options || {}),
        },
    }

}

export default parseEvent