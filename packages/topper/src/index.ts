export type topper = {
    start: (b: string, info?: any) => void,
    stop: (b: string, info?: any) => void,
    fail: (b: string, info?: any) => void,
    duration: (b: string) => number,
};

export const createTopper = ({info, log, error}: {info?: string, log?: Function, error?: Function} = {}): topper => {
    const ctx = {info, timers: {}} as {info?: string, timers: {[key: string]: number}};
    const duration = b => Math.round((ctx.timers[`stop_${b}`] - ctx.timers[`start_${b}`])) / 1000;
    return {
        start: (b, info = undefined) => {
            ctx.timers[`start_${b}`] = Date.now();
            log && log(`[${b}] STARTED ${(info || ctx.info) ? (info || ctx.info) : ''}`);
        },
        stop: (b, info = undefined) => {
            ctx.timers[`stop_${b}`] = Date.now();
            log && log(`[${b}] COMPLETED in ${duration(b)}s ${(info || ctx.info) ? (info || ctx.info) : ''}`);
        },
        fail: (b, info = undefined) => {
            ctx.timers[`stop_${b}`] = Date.now();
            error && error(`[${b}] FAILED in ${duration(b)}s ${info ? ('string' === typeof info ? info : (info && info.message ? info.message : '')) : ''}`);
        },
        duration,
    }
};

export const createRunner = (topper?: topper) => async (
    x,
    tryCallback: Function|undefined = undefined,
    catchCallback: Function|undefined = undefined,
    finallyCallback: Function|undefined = undefined
) => {
    topper = topper || createTopper({log: console.log, error: console.error});
    x = Array.isArray(x) ? x : [x];
    let result;
    try {
        topper.start(...(x as [any, ...any[]]));
        result = tryCallback && (await tryCallback());
        topper.stop(x[0]);
    } catch (e) {
        topper.fail(x[0], e);
        if (catchCallback) {
            await catchCallback(e);
        } else {
            throw e;
        }
    } finally {
        finallyCallback && (await finallyCallback());
    }
    return result;
};


export default createTopper