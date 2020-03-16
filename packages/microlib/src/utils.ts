import caller from './services/caller';

export const compose = (...f) => f.length === 0  ? a => a : (f.length === 1 ? f[0] : f.reduce((a, b) => (...c) => a(b(...c))));
export const fn2ex = (fn, xn) => async request => (await (await xn(a => Object.assign(a, {...a, response: {...a.response, result: fn(a.request)}}))({request, response: {}})).response).result;
export const fn2hn = (fn, middlewares, options = {}) => {
    const hn = fn2ex(fn, compose(...middlewares));
    return async (event, context) => hn({
        ...((options && options['params']) ? ((event || {}).params) : event || {}),
        ...((options && options['rootDir']) ? {rootDir: options['rootDir']} : {}),
        user: event.user,
        headers: event.headers,
        requestId: context['awsRequestId'],
        event,
        context,
    });
};
const pattern = /^\[\[[^\]]+]]$/;

const computeConfig = (c, d) => {
    if ('object' === typeof c) return Object.entries(c).reduce((acc, [k, v]) =>
        Object.assign(acc, {[k]: computeConfig(v, d)})
    , {});
    if (Array.isArray(c)) return c.map(v => computeConfig(v, d));
    if (('string' === typeof c) && pattern.test(c)) return ('[[value]]' === c) ? d : d[c.substr(2, c.length - 4)];
    return c;
};

export const isTransition = (attribute, from, to, data) => {
    const old = (data && data.oldData) ? data.oldData[attribute] : undefined;
    const current = (data && data.data) ? data.data[attribute] : undefined;
    if (old === current) return false;
    return (('*' === to) || (current === to)) && (('*' === from) || (old === from));
};

export const isValue = (attribute, value, data) => data && data.data && (value === data.data[attribute]);

export const createOperationHelpers = (operation, model, dir) => {
    const origDir = dir;
    dir = `${dir}/../..`;
    const operationName = operation.substr(model.name.length + 1);
    const hook = async (n, d, c = {}, opts = {}) => {
        if (opts['ensureKeys'] && Array.isArray(opts['ensureKeys'])) {
            opts['ensureKeys'].reduce((acc, k) => {
                acc[k] = acc.hasOwnProperty(k) ? acc[k] : '';
                return acc;
            }, Array.isArray(d) ? d[0] : d);
        }
        if (opts['trackData'] && Array.isArray(opts['trackData']) && (0 < opts['trackData'].length)) {
            const data = Array.isArray(d) ? d[1] : d;
            if (0 === opts['trackData'].filter(f => data.hasOwnProperty(f)).length) return Array.isArray(d) ? d[0] : d;
        }
        let h;
        if ('@' === n.substr(0, 1)) {
            h = require(`./hooks/${n.substr(1)}`).default;
        } else {
            h = require(`${dir}/hooks/${n}`);
        }
        const args = Array.isArray(d) ? d : [d];
        if (!!opts['loop']) return (await Promise.all(((args[0] || {})[opts['loop']] || []).map(async item => h({...computeConfig(c, item), o: operation, model, dir, hook})(...args)))).pop();
        return h({...c, o: operation, operationName, model, dir, hook})(...args);
    };
    const call = async (name, ...args) => caller.execute(name, args, origDir);
    const updateReferences = async (name, key, value) => {
        // @todo handle multiple page
        try {
            const page = await call(`${name}_find`, {criteria: {[key]: value}, fields: ['id']});
            await Promise.all(((page || {}).items || []).map(async i => call(`${name}_update`, {
                id: i.id,
                data: {[key]: value}
            })));
        } catch (e) {
            console.error('Update references FAILED', {name, key, value}, e);
        }
    };
    const lambdaEvent = async (arn, payload) =>
        require('./services/aws/lambda').default.execute(arn, payload, {async: true})
    ;
    const snsPublish = async (topic, message, attributes = {}) =>
        require('./services/aws/sns').default.publish({message, attributes, topic})
    ;
    const deleteReferences = async (name, key, value) => {
        // @todo handle multiple page
        try {
            const page = await call(`${name}_find`, {criteria: {[key]: value}, fields: ['id']});
            await Promise.all(((page || {}).items || []).map(async i => call(`${name}_delete`, {id: i.id})));
        } catch (e) {
            console.error('Delete references FAILED', {name, key, value}, e);
        }
    };
    return {isTransition, hook, updateReferences, deleteReferences, call, lambdaEvent, snsPublish};
};