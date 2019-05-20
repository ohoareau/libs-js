export default (cfg: any, ctx: object) => {
    if (!cfg) {
        cfg = {};
    }
    if ('function' === typeof cfg) {
        cfg = {get: cfg};
    }
    if (!cfg.hasOwnProperty('get') || 'function' !== typeof cfg['get']) {
        throw new Error(`No get function provided, will be unable to retrieve caller from middleware`);
    }
    return next => async (event, context, callback) => {
        event.caller = {authenticated: false};
        Object.assign(event.caller, await cfg['get'](event));
        return next(event, context, callback);
    };
}
