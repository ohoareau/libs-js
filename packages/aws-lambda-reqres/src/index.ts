// inspired from the work of Daniel Conde Marin (in https://github.com/serverless-nextjs/serverless-next.js)
import detect from '@ohoareau/aws-event-detector';

function wrapper(callback: (req, res) => any|Promise<any>) {
    return async function (event, context) {
        const {req, res, promise, reject, debug, mapErrorToResponse} = convertEventToReqRes(event, context);
        debug && console.log(
            'event/context',
            JSON.stringify(event, null, 4),
            JSON.stringify(context, null, 4)
        );
        try {
            debug && console.log('executing callback');
            await callback(req, res);
        } catch (e) {
            debug && console.error('prepare-error', e);
            reject(e);
        }
        try {
            debug && console.log('awaiting promise');
            // the `return await` is required to trigger the potential error and use the try/catch
            const r = await promise;
            debug && console.log('result', JSON.stringify(r, null, 4));
            return r;
        } catch (e) {
            debug && console.error('execute-error', e);
            return mapErrorToResponse(e);
        }
    };
}

function convertEventToReqRes(event, context) {
    let resolve: any = undefined;
    let reject: any = undefined;
    const promise = new Promise((a, b) => { resolve = a; reject = b; })
    const x = {
        debug: false,
        ...require(`./converters/${detect(event, context)}`).default(event, context, resolve),
        promise,
        reject,
    };
    !!process.env.LAMBDA_DEBUG && (x.debug = true);
    return x;
}

export default wrapper;