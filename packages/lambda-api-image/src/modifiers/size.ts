import {order, request} from '../types';

export async function size(order: order, request: request) {
    let size = request.params?.size;
    if (!size) return;
    if (Array.isArray(size)) size = size[0];
    const [width = undefined, height = undefined] = size.split('x');
    order.operations.push({type: 'resize', width, height});
}