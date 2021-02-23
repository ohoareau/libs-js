import {http_request, route} from '../types';
import {buildDataFromEvent} from "./buildDataFromEvent";
import testRoute from "./testRoute";

export function getRequestInfosFromEvent(event, routes = []): http_request {
    const path = `${(((event || {})['requestContext'] || {})['http'] || {})['path']}`;
    const method = `${(((event || {})['requestContext'] || {})['http'] || {})['method'] || 'unknown'}`.toUpperCase();
    const data = buildDataFromEvent(event);
    const resourcePath = `${method} ${path}`;

    const [uri, y = undefined] = path.split('?');
    const params = {};
    new URLSearchParams(`?${y || ''}`).forEach((k, v) => {
        params[k] = v;
    });
    const testedRoutes: route[] = [...routes];
    let r: route|undefined;
    let found: any = undefined;
    const qsParams = Object.entries(event?.queryStringParameters || {}).reduce((acc, [k, v]) => {
        if (!v) return acc;
        if (-1 === (v as string).indexOf(',')) {
            acc[k] = v;
            return acc;
        }
        acc[k] = (v as string).split(/,/g);
        return acc;
    }, {});
    const headers = Object.entries(event?.headers || {}).reduce((acc, [k, v]) => {
        if (!v) return acc;
        if (-1 === (v as string).indexOf(',')) {
            acc[k] = v;
            return acc;
        }
        acc[k] = (v as string).split(/,/g);
        return acc;
    }, {});
    const request = {uri, path, resourcePath, method, params, data, qsParams, headers} as http_request;
    do {
        r = testedRoutes.shift();
        if (!r) break;
        const match = testRoute(r, request);
        if (match) {
            found = {route: r, params: {...(match || {}), ...(r.params || {})}};
        }
    } while (!found && testedRoutes.length);
    if (found) {
        request['route'] = {...found['route']};
        request['params'] = {...request['params'], ...found['params']};
    }
    return request;
}

export default getRequestInfosFromEvent