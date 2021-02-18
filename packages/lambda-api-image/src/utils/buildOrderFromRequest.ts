import executeRule from "./executeRule";
import defaultRules from '../default-rules';
import isMatchingRule from "./isMatchingRule";
import extractRuleParams from "./extractRuleParams";
import convertRequestToOrder from "./convertRequestToOrder";
import ResourceNotFoundError from "../errors/ResourceNotFoundError";
import {request, rule, order} from "../types";

export async function buildOrderFromRequest(request: request, config: any): Promise<order> {

    // from the config, and merged with defaults, we build an ordered list of rules (uri patterns)

    const rules: rule[] = [...(config?.rules || []), ...defaultRules];

    // then we try to find, in order, the first matching url (i.e. the uri pattern that match the request uri)

    let found: rule|undefined = rules.find(rule => isMatchingRule(rule, request));

    if (!found) throw new ResourceNotFoundError(request);

    // we now have a request, the microservice config, we need to convert the request to part of the order

    const {input = undefined, operations = [], options = undefined, format} = await convertRequestToOrder(request, config);

    // depending on the found rule, we need to potentially extract params from the uri (and queryString)

    const params = extractRuleParams(found, request);

    found = {...found, params: {...(found.params || {}), ...(params || {})}};

    // we are now ready to process the rule in order the complete the creation of the order that will contain
    // the list of operations to send to imageman.

    const order = await executeRule(found, request, config);

    // order is shaped but we need to merge it with default values from the request

    return {
        ...order,
        ...(format ? {format} : {}),
        ...(input ? {input}: {}),
        operations: [
            ...(order?.operations || []),
            ...(operations || []),
        ],
        options: {
            ...(order?.options || {}),
            ...(options || {}),
        },
    } as order;

}

export default buildOrderFromRequest