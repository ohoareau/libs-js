import h from "@ohoareau/handler";

const handler = (container: object & {get: (id: string) => object}, service, method: string, type: string|undefined = undefined, extraData: string[] = []): Function => {
    type = type || method;
    const hc = {noerror: true, caller: e => (<any>container.get('identities')).identifyFromEvent(e)};
    switch (type) {
        case 'create':
            return h(({ params: { data, ...rest }, caller }) => container.get(service)[<string>method]({...data, ...filterExtraData(rest, extraData)}, {caller}), hc);
        case 'get':
            return h(({ params: { id }, tenant, caller }) => container.get(service)[<string>method](id, [], {caller, tenant}), hc);
        case 'getPublic':
            return h(({ params: { id }, tenant, caller }) => container.get(service)[<string>method](id, [], {caller, tenant}), hc);
        case 'suspend':
            return h(({ params: { id, ...rest }, tenant, caller }) => container.get(service)[<string>method](id, filterExtraData(rest, extraData), {caller, tenant}), hc);
        case 'unsuspend':
            return h(({ params: { id, ...rest }, tenant, caller }) => container.get(service)[<string>method](id, filterExtraData(rest, extraData), {caller, tenant}), hc);
        case 'event':
            return h(({ params: { id, ...rest }, tenant, caller }) => container.get(service)[<string>method](id, filterExtraData(rest, extraData), {caller, tenant}), hc);
        default:
            throw new Error(`Unsupported handler type '${type}'`);
    }
};

export {
    h,
    handler,
    handler as default,
};

function filterExtraData(rest: {[k: string]: any}, extra: string[]): {[k: string]: any} {
    return extra.reduce((acc, k) => {
        rest[k] && (acc[k] = rest[k]);
        return acc;
    }, {})
}