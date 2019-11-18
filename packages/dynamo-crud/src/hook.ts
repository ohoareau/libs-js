import {createHook, createJobHook, createMessageHook} from "./hook-types";

export const applyHook = async (name, hooks, ctx, hookFactory = createHook) => {
    return hooks[name] ? hookFactory(hooks[name]).apply(null, [ctx]) : undefined;
};

export const hooked = (operation, callback, hooks, service, type) => async (...args): Promise<any> => {
    const ctx = { args, result: undefined, service, type, operation};
    const operationUpper = `${operation.substr(0, 1).toUpperCase()}${operation.substr(1)}`;
    await applyHook(`before${operationUpper}`, hooks, ctx);
    ctx.result = await callback.apply(null, args);
    await applyHook(operation, hooks, ctx);
    await applyHook(`${operation}Job`, hooks, ctx, createJobHook);
    await applyHook(`${operation}Message`, hooks, ctx, createMessageHook);
    return ctx.result;
};