export type request_uri = string;
export type request_method = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT' | 'OPTIONS' | 'PATCH';
export type request_header_value = string | string[];
export type request_headers = {
    [key: string]: request_header_value,
}
export type request_param_value = string | string[];

export type request_params = {
    [key: string]: request_param_value,
}
export type request = {
    uri: request_uri,
    method: request_method,
    headers: request_headers,
    params: request_params,
}
export type rule_param_value = string;
export type rule_params = {
    [key: string]: rule_param_value,
}
export type rule = {
    name: string,
    uri?: RegExp,
    type: string,
    params?: rule_params,
}

export type order_operation = {
    type: string,
    [key: string]: any,
}
export type order = {
    input: string,
    output?: string,
    operations: order_operation[],
    sourceTypes?: any,
    targetTypes?: any,
    options: any,
    format?: any,
}