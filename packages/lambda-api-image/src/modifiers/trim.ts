import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function trim(order: order, request: http_request) {
    let trim = request.qsParams?.trim;
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