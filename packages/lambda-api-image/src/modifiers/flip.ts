import {order, request} from '../types';

export async function flip(order: order, request: request) {
    let flip = request.params?.flip;
    if (!flip) return;
    if (Array.isArray(flip)) flip = flip[0];
    order.operations.push({type: 'flip', direction: flip});
}