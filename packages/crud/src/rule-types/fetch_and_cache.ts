import {rule} from "./rule";
import Context from "../Context";

export const fetch_and_cache = (
    operations: string|string[],
    field: string,
    service: any,
    fields: string[] = [],
    extraFields: string[] = []) => rule(
        operations,
    'fetch',
    `retrieve ${field} ${fields.length ? fields.join(',') : ''} and cache`,
    async (ctx: Context, execCtx: Context) => {
            const dd = ctx.get('data');
            if (!dd || !dd.hasOwnProperty(field) || !dd[field]) {
                return;
            }
            const allFields = extraFields.length ? fields.concat(extraFields) : fields;
            if ('function' === typeof service) {
                service = <(object & {get: (id: string, fields: string[]) => Promise<object>})>(<() => object>service)();
            }
            let ref = await service.get(<string>dd[field], allFields);
            let caches = ctx.get('caches');
            if (!caches) {
                caches = {};
                ctx.set('caches', caches);
            }
            if (!caches[field]) {
                caches[field] = {};
            }
            caches[field][dd[field]] = ref;
        }
    )
;
