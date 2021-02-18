import {request, rule, order} from "../types";
import * as availableRuleTypes from '../rule-types';
import {detectFormatFromFileName} from "@ohoareau/imageman";
import detectContentTypeFromFileName from "./detectContentTypeFromFileName";

export async function executeRule(rule: rule, request: request, config: any): Promise<order> {
    const ruleTypes = {...availableRuleTypes, ...(config.ruleTypes || {})};
    const ruleType = ruleTypes[rule?.type];
    if (!ruleType) throw new Error(`Unknown rule type '${rule?.type}'`);
    const {input = undefined, operations = [], options = {}, format = undefined} = (await ruleType(request, rule, config)) || {};
    let formatFromFile: any = undefined;
    let contentTypeFromFile: string|undefined = undefined;
    if (!format && rule?.params?.file) {
        formatFromFile = detectFormatFromFileName(rule.params.file);
        contentTypeFromFile = detectContentTypeFromFileName(rule.params.file);
    }
    const headers = {...(rule.cache ? {'Cache-Control': rule.cache} : {})};
    const opts = {
        ...(options || {}),
        ...((options?.contentType || contentTypeFromFile)
                ? {contentType: contentTypeFromFile || options?.contentType}
                : {}),
    };
    return {
        input,
        operations,
        options: {
            ...opts,
            ...((opts.headers || headers) ? {headers: {...(headers || {}), ...(opts.headers || {})}} : {}),
        },
        format: format || formatFromFile,
    };
}

export default executeRule