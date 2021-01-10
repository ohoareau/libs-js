export type topper = {
    start: (b: string, info?: any) => void,
    stop: (b: string, info?: any) => void,
    duration: (b: string) => number,
};

export const createTopper = ({info, log}: {info?: string, log?: Function} = {}): topper => {
    const ctx = {info, timers: {}} as {info?: string, timers: {[key: string]: number}};
    const duration = b => Math.round((ctx.timers[`stop_${b}`] - ctx.timers[`start_${b}`])) / 1000;
    return {
        start: (b, info = undefined) => {
            ctx.timers[`start_${b}`] = Date.now();
            log && log(`[${b}] STARTED ${info ? info : ctx.info}`);
        },
        stop: (b, info = undefined) => {
            ctx.timers[`stop_${b}`] = Date.now();
            log && log(`[${b}] COMPLETED in ${duration(b)}s ${info ? info : ctx.info}`);
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
    topper = topper || createTopper({log: console.log});
    x = Array.isArray(x) ? x : [x];
    let result;
    try {
        topper.start(...(x as [any, ...any[]]));
        result = tryCallback && (await tryCallback());
        topper.stop(x[0]);
    } catch (e) {
        if (catchCallback) {
            await catchCallback(e);
        } else {
            throw e;
        }
    } finally {
        topper.stop(x[0]);
        finallyCallback && (await finallyCallback());
    }
    return result;
};


export default createTopper