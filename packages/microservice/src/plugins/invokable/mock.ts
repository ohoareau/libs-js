import {Map} from "../..";

export const calls: {operation: string, payload: Map, options: Map}[] = [];

export default () => async (operation: string, payload: Map, options: Map): Promise<any> => {
    calls.push({operation, payload, options});
    return {};
}