import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function radius(order: order, request: http_request) {
    let radius = request.qsParams?.radius;
    if (!radius) return;
    if (Array.isArray(radius)) radius = radius[0];
    const [rx = undefined, ry = undefined] = radius.split('x');
    order.operations.push({type: 'round_corner', rx, ry});
}