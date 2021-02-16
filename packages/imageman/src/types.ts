export type input = string;
export type output = string;

export type resize_operation = {
    type: 'resize',
    width?: bigint,
    height?: bigint,
}

export type round_corner_operation = {
    type: 'round-corner',
    'radius-x': bigint,
    'radius-y': bigint,
}

export type grayscale_operation = {
    type: 'grayscale',
}

export type noop_operation = {
    type: 'noop',
}

export type operation = resize_operation | round_corner_operation | grayscale_operation | noop_operation;

export type operations = operation[];