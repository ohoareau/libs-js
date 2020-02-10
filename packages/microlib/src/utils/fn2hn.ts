const compose = (...f) => f.length === 0  ? a => a : (f.length === 1 ? f[0] : f.reduce((a, b) => (...c) => a(b(...c))));
const fn2hn = (fn, xn) => async request => (await (await xn(a => Object.assign(a, {...a, response: {...a.response, result: fn(a.request)}}))({request, response: {}})).response).result;

export default (fn, middlewares, options) => {
    const hn = fn2hn(fn, compose(...middlewares));
    return async (event, context) => hn({
        ...((options && options.params) ? ((event || {}).params) : event || {}),
        user: event.user,
        headers: event.headers,
        requestId: context['awsRequestId'],
        event,
        context,
    });
}