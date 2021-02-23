import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function filter(order: order, request: http_request) {
    const filter = request.qsParams?.filter;
    if (!filter) return;
    const filters = Array.isArray(filter) ? filter : [filter];
    return filters.reduce((acc, f) => {
        switch (f) {
            case 'grayscale': acc.operations.push({type: 'grayscale'}); break;
            default: break;
        }
        return acc;
    }, order);
}