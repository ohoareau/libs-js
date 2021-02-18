import {order, request} from '../types';

export async function preset(order: order, request: request, config: any) {
    if (!request?.params?.preset) return;
    const presets = Array.isArray(request.params.preset) ? request.params.preset : [request.params.preset];
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