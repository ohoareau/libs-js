import {order} from '../types';
import {http_request} from '@ohoareau/lambda-utils';

export async function preset(order: order, request: http_request, config: any) {
    if (!request.qsParams?.preset) return;
    const presets = Array.isArray(request.qsParams!.preset) ? request.qsParams!.preset : [request.qsParams!.preset];
    return presets.reduce((acc, p) => {
        let preset = (config.presets || {})[p] || {};
        ('function' === typeof preset) && (preset = preset(request) || {});
        return {
            ...acc,
            ...preset,
            operations: [
                ...(acc.operations || []),
                ...(preset.operations || []),
            ]
        }
    }, order);
}