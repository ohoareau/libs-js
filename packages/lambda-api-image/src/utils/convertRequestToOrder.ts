import {request, order} from "../types";
import * as modifiers from '../modifiers';

export async function convertRequestToOrder(request: request, config: any) {
    const modifierNames = [
        'preset', 'size', 'trim', 'flip', 'format', 'radius', 'filter',
        'rotation', 'theme', 'color', 'quality',
    ];

    return modifierNames.reduce(async (acc: any, modifier: string) => {
        acc = await acc;
        if (!modifiers[modifier]) return acc;
        return (await modifiers[modifier](acc, request, config)) || acc;
    }, Promise.resolve({input: undefined, operations: [], options: {}} as unknown as order));
}

export default convertRequestToOrder