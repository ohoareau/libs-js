import {replaceVars} from "./utils";

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