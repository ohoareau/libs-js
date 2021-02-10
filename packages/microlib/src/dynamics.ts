export const uuid = () => () => require('uuid').v4();
export const value = ({value}) => () => value;
export const s3 = ({s3}) => async data => {
    let [bucket, key] = s3.split(':');
    bucket = replaceVars(bucket, data);
    key = replaceVars(key, data);
    return require('@ohoareau/aws').s3.getFileContent({bucket, key});
}
export const s3url_dl = ({s3url_dl, s3url = undefined}) => async data => {
    let [bucket, key, name = undefined] = (s3url_dl || s3url || '').split(':');
    bucket = replaceVars(bucket, data);
    key = replaceVars(key, data);
    name = name ? replaceVars(name, data) : undefined;
    return require('@ohoareau/aws').s3.getFileDownloadUrl({bucket, key, name});
}
export const s3url_view = ({s3url_view, s3url = undefined}) => async data => {
    let [bucket, key, contentType = undefined] = (s3url_view || s3url || '').split(':');
    bucket = replaceVars(bucket, data);
    key = replaceVars(key, data);
    contentType = contentType ? replaceVars(contentType, data) : undefined;
    return require('@ohoareau/aws').s3.getFileViewUrl({bucket, key, contentType});
}
export const s3url = s3url_view;
export const s3url_ul = ({s3url_ul, s3url = undefined}) => async data => {
    let [bucket, key, expires = undefined] = (s3url_ul || s3url || '').split(':');
    bucket = replaceVars(bucket, data);
    key = replaceVars(key, data);
    expires = replaceVars(`${expires}`, data);
    if ((expires === '') || (expires === '-1') || (expires === 'undefined') || (expires === 'false')) {
        expires = undefined
    } else {
        expires = parseInt(expires);
    }
    return require('@ohoareau/aws').s3.getFileUploadUrl({bucket, key, expires});
}
export const pattern = ({pattern}) => data => replaceVars(pattern, data);
export const url = ({url}) => data => replaceVars(url, data);
export const operation = ({operation, dir}) => async (data, query) => {
    operation = replaceVars(operation, data);
    return require('./services/caller').default.execute(operation, [{...query, ...data}], `${dir}/services/crud`);
}

function replaceVars(pattern, data = {}) {
    const envVarMatch = pattern.match(/^\[\[process.env.([^\]]+)]]$/);
    if (envVarMatch) {
        pattern = process.env[envVarMatch[1]] || '';
    }

    const r = new RegExp('\{\{([^\}]+)\}\}', 'g');
    const matches = [...pattern.matchAll(r)];
    const getValue = k => ('undefined' === typeof data[k]) ? '' : data[k];

    return matches.reduce((acc, m) => {
        for (let i = 0; i < (m.length - 1); i++) {
            acc = acc.replace(m[0], getValue(m[i + 1]));
        }
        return acc;
    }, pattern);
}