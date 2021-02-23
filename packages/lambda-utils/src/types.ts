export type query_data = string | {
    [key: string]: any
}

export type query_event = {
    [key: string]: any,
}

export type query_context = {
    [key: string]: any,
}

export type query = {
    data?: query_data,
    event?: query_event,
    context?: query_context,
    [key: string]: any,
}
export type config_route = route;
export type config_static = any;
export type config_action = Function;
export type config = {
    routes?: config_route[],
    statics?: {[key: string]: config_static},
    actions?: {[key: string]: config_action},
    [key: string]: any,
}
export type helpers = {
    [key: string]: Function,
}

export type ctx = {
    request: http_request,
    config: config,
    helpers: helpers,
    query: query,
    event: any,
    context: any,
}

export type http_response = {
    body?: string|object
    contentType?: string,
    headers?: any,
    statusCode?: number,
}

export type route = {
    name: string,
    uri?: string,
    method?: string,
    type?: string,
    params?: any,
    headers?: response_headers,
    cache?: response_cache_header_value,
};

export type http_request = {
    uri: string,
    path: string,
    resourcePath: string,
    method: 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT' | 'OPTIONS' | 'PATCH',
    headers: request_headers,
    params: request_params,
    qsParams: {[key: string]: string|string[]},
    route?: route,
    data?: {[key: string]: string} | string,
}
export type request_header_value = string | string[];
export type request_headers = {
    [key: string]: request_header_value,
}
export type request_param_value = string | string[];

export type request_params = {
    [key: string]: request_param_value,
}

export type response_cache_header_value = string;
export type response_header_value = string;
export type response_headers = {
    [key: string]: response_header_value,
}
