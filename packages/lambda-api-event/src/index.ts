import {createRouterHandler} from "@ohoareau/lambda-utils";

export default function() {
    return createRouterHandler(async function ({path, config, responses}, event, context) {
        return responses.httpOk({message: 'not yet implemented'});
    })
}