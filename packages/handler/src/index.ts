import asyncMiddleware from './middlewares/async';
import noerrorMiddleware from './middlewares/noerror';
import callerMiddleware from './middlewares/caller';

const configurableMiddlewares = {
    async: asyncMiddleware,
    noerror: noerrorMiddleware,
    caller: callerMiddleware,
};

export const h = (handler: Function, config: object = {}, ctx: object = {}): Function => {
    if ('function' !== typeof handler) {
        throw new Error(`Handler callback is not a function`);
    }
    const middlewares = <any>[];

    Object.keys(configurableMiddlewares).forEach(k => {
        (<any>config)[k] && middlewares.push([configurableMiddlewares[k], (<any>config)[k]]);
    });

    const chain = middlewares.map(([middleware, cfg]) => middleware(cfg, ctx));

    let enhancedHandler = handler;
    if (chain.length) {
        if (1 === chain.length) {
            enhancedHandler = chain[0](handler);
        } else {
            enhancedHandler = chain.reduce((a, b) => (...args) => a(b(...args)))(handler);
        }
    }
    return enhancedHandler;
};


export default h;