import * as helpers from '../responses';
import getLambdaConfig from "./getLambdaConfig";
import getRequestInfosFromEvent from "./getRequestInfosFromEvent";
import {ctx} from "../types";
import mergeConfig from "./mergeConfig";
import defaultProcessHandler from "./defaultProcessHandler";

export function createRouterHandler(defaultConfig: any = {}, customProcessHandler: ((ctx: ctx) => Promise<any>)|undefined = undefined) {
    return async function (event, context) {
        try {
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

            try {
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
            } catch (e1) {
                return helpers.httpError({error: e1, phase: 'static'});
            }

            try {
                // we do the `await` here because we need to catch error here
                return await (customProcessHandler || defaultProcessHandler)(ctx);
            } catch (e) {
                return helpers.httpError({
                    error: e,
                    phase: 'process',
                    headers: {
                        ...(request.route?.name ? {'X-Error-Route-Name': request.route!.name} : {}),
                        ...(request.route?.type ? {'X-Error-Route-Type': request.route!.type} : {}),
                    }
                });
            }
        } catch (e0) {
            return helpers.httpError({error: e0, phase: 'init'});
        }
    }
}

export default createRouterHandler