// inspired from the work of Daniel Conde Marin (in https://github.com/serverless-nextjs/serverless-next.js)
import detect from '@ohoareau/aws-event-detector';

function wrapper(callback: (req, res) => any) {
    return async (event, context) => {
        const {req, res, promise, reject} = convertEventToReqRes(event, context);
        try {
            await callback(req, res);
        } catch (e) {
            // @todo convert error to proper api gateway response payload
            reject(e);
        }
        return promise;
    };
}

function convertEventToReqRes(event, context) {
    let resolve: any = undefined;
    let reject: any = undefined;
    const promise = new Promise((a, b) => { resolve = a; reject = b; })
    return {
        ...require(`./converters/${detect(event, context)}`).default(event, context, resolve),
        promise,
        reject,
    };
}

export default wrapper;