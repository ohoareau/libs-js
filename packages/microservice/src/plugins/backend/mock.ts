export const calls: {method: string, args: any[]}[] = [];

export default () => async (operation: string, payload: any) => {
    switch (operation) {
        case 'find':
            calls.push({method: 'find', args: [payload]});
            return {items: []};
        case 'get':
            calls.push({method: 'get', args: [payload]});
            return {};
        case 'delete':
            calls.push({method: 'delete', args: [payload]});
            return {};
        case 'create':
            calls.push({method: 'create', args: [payload]});
            return {};
        case 'update':
            calls.push({method: 'update', args: [payload]});
            return {};
        default:
            return undefined;
    }
}