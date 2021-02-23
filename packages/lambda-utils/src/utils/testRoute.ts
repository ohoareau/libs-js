import {http_request, route} from "../types";
import {Path} from "path-parser";

export function testRoute(route: route, request: http_request): any|undefined {
    if (route.method) {
        const methods = Array.isArray(route.method) ? route.method : [route.method];
        const found = methods.find(m => (m.toUpperCase() === (request.method || '').toUpperCase()));
        if (!found) return undefined;
    }
    if (!route.uri) return {}; // match with no parameters
    return new Path(route.uri).test(request.uri) || undefined;
}

export default testRoute
