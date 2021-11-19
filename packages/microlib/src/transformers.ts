import {replaceVars} from "./utils";

export const truncate = ({length}) => v => (undefined !== length) ? v.slice(0, length) : v;
export const prefix = ({prefix}) => v => `${prefix || ''}${v}`;
export const suffix = ({suffix}) => v => `${v}${suffix || ''}`;
export const upper = () => v => `${v}`.toUpperCase();
export const lower = () => v => `${v}`.toLowerCase();
export const json2string = () => v => JSON.stringify(v);
export const password = ({rounds}) => v => require('bcryptjs').hashSync(v, rounds);
export const s3file = ({bucket, key, name, contentType}) => async (v, query) => {
    const vars = {...query, ...(query.oldData || {}), ...(query.data || {})};
    bucket = replaceVars(bucket, vars)
    key = replaceVars(key, vars);
    name = name ? replaceVars(name, vars) : undefined;
    contentType = contentType ? replaceVars(contentType, vars) : undefined;
    await require('@ohoareau/aws').s3.setFileContent({bucket, key}, v);
    return {bucket, key, name, contentType};
}
export const image = ({bucket, key, name, contentType, algorithm = 'sha256'}) => async (v, query) => {
    const s3 = require('@ohoareau/aws').s3;
    const vars = {...query, ...(query.oldData || {}), ...(query.data || {})};
    bucket = replaceVars(bucket, vars)
    key = replaceVars(key, vars);
    name = name ? replaceVars(name, vars) : undefined;
    contentType = contentType ? replaceVars(contentType, vars) : undefined;
    const fingerprint = await require('./services/crypto').default.hash(await s3.getFileContent(v), algorithm)
    return {bucket, key, name, contentType, fingerprint};
}
export const list = () => v => {
    // for now, only array of STRINGs
    let x: any[] = [];
    if (undefined !== v) {
        if (!Array.isArray(v)) {
            if ('string' === typeof v) x = v.split(',');
            else x = [v];
        }
    }
    return x.length ? x.map(xx => `${xx}`) : undefined;
}