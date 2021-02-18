import {order, request} from '../types';

export async function format(order: order, request: request) {
    if (!request?.params?.format) return;
    order.format = {type: request.params.format};
}