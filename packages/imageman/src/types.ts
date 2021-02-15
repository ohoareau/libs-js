export type input = string;
export type output = string;

export type resize_operation = {
    type: 'resize',
    width?: any,
    height?: any,
}

export type noop_operation = {
    type: 'noop',
}

export type operation = resize_operation | noop_operation;

export type operations = operation[];