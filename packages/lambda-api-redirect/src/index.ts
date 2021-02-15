import {createRouterHandler} from "@ohoareau/lambda-utils";
import * as ruleTypes from './rule-types';

export default function() {
        return createRouterHandler(async function ({path, config, responses}, event, context) {
        if (!config || !config.rules) return responses.httpNotFound();
        const found = config.rules.find(r => r.pattern && !!path.match(r.pattern));
        if (!found || !found.type || !ruleTypes[found.type]) return responses.httpNotFound();
        const redirect = await ruleTypes[found.type]({...found.type, path}, event, context);
        if (!redirect || !redirect.location) return responses.httpNotFound();
        return responses.redirect(redirect);
    })
}