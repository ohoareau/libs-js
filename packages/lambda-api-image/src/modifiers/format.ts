import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function format(order: order, request: http_request) {
    if (!request.qsParams?.format) return;
    order.format = {type: request.qsParams!.format};
}