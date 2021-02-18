import {order, request} from '../types';

export async function filter(order: order, request: request) {
    const filter = request.params?.filter;
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