import {createRouterHandler} from "@ohoareau/lambda-utils";
import imageman from '@ohoareau/imageman';
import {parseEvent} from "./utils";

export default function() {
    return createRouterHandler(async function ({config, responses}, event, context) {
        const {options, ...order} = await parseEvent(event, config, context);
        return responses.buffer({buffer: await imageman(order), ...options})
    })
}