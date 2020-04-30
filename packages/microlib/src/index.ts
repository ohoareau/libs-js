import formatters from './formatters';

export const apply = async (ms: any[], args) =>
    ms[0](...args, async () => (ms.length > 1) ? apply(ms.slice(1), args) : undefined)
;

export const micro = (ms: any[] = [], ems: any[] = [], fn: Function|undefined, options: any = {}) =>
    async (event, context) => {
        const req: any = {
            headers: {},
            body: undefined,
            ...event,
            ...((options && options['params']) ? ((event || {}).params) : event || {}),
            ...((options && options['rootDir']) ? {rootDir: options['rootDir']} : {}),
            requestId: (context || {})['awsRequestId'],
            event,
            context,
        };
        const res: any = {headers: {}, statusCode: 200, body: {}, formatters, bodyOnly: true};
        req.res = res;
        res.req = req;
        res.send = res.json = x => { res.body = x; return res; };
        res.set = (k, v) => { res.headers[k] = v; return res; };
        res.header = res.setHeader = res.set;
        res.status = c => { res.statusCode = c; return res; };
        res.get = res.getHeader = k => res.headers[k];
        res.end = () => res;
        res.type = res.contentType = c => res.set('Content-Type', c);
        try {
            await apply(fn ? [...ms, async (req, res) => res.send(await fn(req))] : ms, [req, res]);
        } catch (e) {
            await apply([...ems, async e => { throw e; }], [e, req, res]);
        }
        (res.formatters[res.headers['Content-Type']] || res.formatters['default'])(res);
        return res.bodyOnly ? res.body : {statusCode: res.statusCode, body: res.body, headers: res.headers};
    }
;

export default micro