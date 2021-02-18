import {request, rule} from "../types";

export function extractRuleParams(rule: rule, request: request) {
    return {...(rule?.uri ? {...((request.uri.match(rule.uri) || {}).groups)} : {}), path: request.uri.slice(1)};
}

export default extractRuleParams