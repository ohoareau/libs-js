import {request, rule} from "../types";

export function isMatchingRule(rule: rule, request: request) {
    let test = false;
    rule.uri && (test = test || rule.uri.test(request.uri));
    if (!test) return false;
    return test;
}

export default isMatchingRule