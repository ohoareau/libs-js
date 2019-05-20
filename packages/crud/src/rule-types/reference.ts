import Context from '../Context';
import { on_create } from "./crud";
import { rule } from './rule';
import ReferencePreconditionFieldError from '../errors/ReferencePreconditionFieldError';
import MissingReferenceFieldError from "../errors/MissingReferenceFieldError";
import {fetch_and_cache} from "./fetch_and_cache";

export const reference = (
    field: string,
    service: (object & {get: (id: string, fields: string[]) => Promise<object>})|(() => object),
    fields: string[] = [],
    extraFields: string[] = []
) => [
        fetch_and_cache('@create|@update', field, service, (<string[]>[]).concat(fields, extraFields)),
        rule(
        '@create|@update',
        'before',
        `map reference from \`${field}\` id to ${fields.map(f => `\`${f}\``).join(', ')} of ${field}`,
        async (ctx: Context, execCtx: Context) => {
                const dd = ctx.get('data');
                if (!dd || !dd.hasOwnProperty(field)) {
                    return;
                }
                const diffFields = extraFields.filter(item => fields.indexOf(item) < 0);
                let caches = ctx.get('caches');
                if (!caches || !caches[field] || !caches[field][dd[field]]) {
                    throw new MissingReferenceFieldError(field, '<not-in-cache>');
                }
                dd[field] = diffFields.reduce((acc, k) => {
                    delete acc[k];
                    return acc;
                }, {...caches[field][dd[field]]});
            }
        ),
    ]
;

export const check_reference = (
    field: string,
    referenceField: string,
    value: string
) => {
    return on_create((ctx: Context, execCtx: Context) => {
        const dd = ctx.get('data');
        if (!dd || !dd[field] || !dd[field].id) {
            throw new MissingReferenceFieldError(field, dd);
        }
        const ref = ((ctx.get('caches', {})[field] || {})[dd[field].id] || {});
        if (value !== ref[referenceField]) {
            throw new ReferencePreconditionFieldError(field, referenceField, ref[referenceField], value);
        }
    });
};
