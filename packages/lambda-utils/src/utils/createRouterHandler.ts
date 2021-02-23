import * as helpers from '../responses';
import getLambdaConfig from "./getLambdaConfig";
import getRequestInfosFromEvent from "./getRequestInfosFromEvent";
import {ctx} from "../types";
import mergeConfig from "./mergeConfig";
import defaultProcessHandler from "./defaultProcessHandler";

export function createRouterHandler(defaultConfig: any = {}, customProcessHandler: ((ctx: ctx) => Promise<any>)|undefined = undefined) {
    return async function (event, context) {
        const config = mergeConfig(await getLambdaConfig(), defaultConfig);
        const request = getRequestInfosFromEvent(event, config['routes']);

        const ctx = {
            request,
            config,
            helpers,
            event,
            context,
            query: {
                ...(request.params || {}),
                ...(request.data ? {data: request.data || {}} : {}),
            },
        };

        if ((config['statics'] || {})[request.uri]) {
            const staticInfos = config['statics'][request.uri];
            return helpers.staticFile({
                root: config.root,
                ...staticInfos,
                headers: {
                    ...(ctx.config?.defaultStaticsHeaders || {}),
                    ...(staticInfos.headers || {})
                }
            });
        }

        try {
            // we do the `await` here because we need to catch error here
            return await (customProcessHandler || defaultProcessHandler)(ctx);
        } catch (e) {
            return helpers.httpError({statusCode: 500});
        }
    }
}

export default createRouterHandler