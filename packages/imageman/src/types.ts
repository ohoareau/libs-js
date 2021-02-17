export type input = string;
export type output = string;

export type resize_operation = {
    type: 'resize',
    width?: bigint,
    height?: bigint,
}

export type round_corner_operation = {
    type: 'round-corner',
    rx: bigint,
    ry: bigint,
}

export type grayscale_operation = {
    type: 'grayscale',
}

export type flip_operation = {
    type: 'flip',
    direction: 'vertical' | 'horizontal',
}

export type noop_operation = {
    type: 'noop',
}

export type operation = resize_operation | round_corner_operation | grayscale_operation | noop_operation;

export type operations = operation[];

export type source_type = (config?: any) => Buffer|ReadableStream
export type target_type = (img: any, config?: any) => Buffer|ReadableStream

export type imageman_args = {
    input: input,
    operations?: operations,
    output: output,
    sourceTypes?: {[key: string]: source_type},
    targetTypes?: {[key: string]: target_type},
};

