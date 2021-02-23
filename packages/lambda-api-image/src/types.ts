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