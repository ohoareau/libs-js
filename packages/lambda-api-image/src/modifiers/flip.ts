import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function flip(order: order, request: http_request) {
    let flip = request.qsParams?.flip;
    if (!flip) return;
    if (Array.isArray(flip)) flip = flip[0];
    order.operations.push({type: 'flip', direction: flip});
}