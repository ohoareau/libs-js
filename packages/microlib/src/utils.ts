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
const computeConfig = (c, item) => {
    const p = /\[\[[^\]]+]]/;
    return Object.entries(c).reduce((acc, [k, v]) => {
        if (('string' === typeof v) && p.test(v)) {
            if ('[[value]]' === v) {
                acc[k] = item;
            } else {
                acc[k] = item[v.substr(2, v.length - 4)];
            }
        } else {
            acc[k] = v;
        }
        return acc;
    }, {});
};

export const initHook = (operation, model, dir) => {
    dir = `${dir}/../..`;
    return async (n, d, c = {}, opts = {}) => {
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
        // @todo consume opts.loop by reducing (async !)
        let h;
        if ('@' === n.substr(0, 1)) {
            h = require(`./hooks/${n.substr(1)}`).default;
        } else {
            h = require(`${dir}/hooks/${n}`);
        }
        const args = Array.isArray(d) ? d : [d];
        if (!!opts['loop']) return await Promise.all(((args[0] || {})[opts['loop']] || []).map(async item => h({...computeConfig(c, item), o: operation, model, dir})(...args)));
        return h({...c, o: operation, model, dir})(...args);
    };
};