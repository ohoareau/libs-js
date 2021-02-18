import {request, rule, order_operation} from "../types";
import * as availableRuleTypes from '../rule-types';

export async function executeRule(rule: rule, request: request, config: any): Promise<{input?: string, operations?: order_operation[], options?: any}> {
    const ruleTypes = {...availableRuleTypes, ...(config.ruleTypes || {})};
    const ruleType = ruleTypes[rule?.type];
    if (!ruleType) throw new Error(`Unknown rule type '${rule?.type}'`);
    const {input = undefined, operations = [], options = {}} = (await ruleType(request, rule, config)) || {};
    return {input, operations, options};
}

export default executeRule