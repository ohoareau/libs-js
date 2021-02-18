import {order, request} from '../types';

export async function radius(order: order, request: request) {
    let radius = request.params?.radius;
    if (!radius) return;
    if (Array.isArray(radius)) radius = radius[0];
    const [rx = undefined, ry = undefined] = radius.split('x');
    order.operations.push({type: 'round_corner', rx, ry});
}