import * as responses from '../responses';
import getLambdaConfig from "./getLambdaConfig";
import getRequestInfosFromEvent from "./getRequestInfosFromEvent";
import {ctx} from "../types";

export function createRouterHandler(processHandler: (ctx: ctx, event, context) => Promise<any>) {
    return async function (event, context) {
        const config = await getLambdaConfig();
        const requestInfos = getRequestInfosFromEvent(event);
        const ctx = {...requestInfos, config, responses};
        if ((config['statics'] || {})[ctx.path]) {
            return responses.staticFile({root: config.root, ...config['statics'][ctx.path]});
        }

        try {
            // we do the `await` here because we need to catch error here
            return await processHandler(ctx, event, context);
        } catch (e) {
            console.error(e);
            return responses.httpError({statusCode: 500});
        }
    }
}

export default createRouterHandler