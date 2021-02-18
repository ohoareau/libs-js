import {order, request} from '../types';

export async function trim(order: order, request: request) {
    let trim = request.params?.trim;
    if (!trim) return;
    if (Array.isArray(trim)) trim = trim[0];
    if (!trim) return;
    trim = parseFloat(trim as string) as any;
    if (!trim) return;
    order.operations.push({
        type: 'trim',
        threshold: trim,
    });
}