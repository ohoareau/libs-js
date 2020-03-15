export const boolean = () => ({test: v => 'boolean' === typeof v, message: v => `Not a boolean (actual: ${v})`});
export const minLength = ({min: x}) => ({test: v => v.length >= x, message: v => `Min length not satisfied (${v.length} < ${x})`});
export const maxLength = ({max: x}) => ({test: v => v.length <= x, message: v => `Max length exceeded (${v.length} > ${x})`});
export const values = ({values: x}) => ({test: v => !!x.find(a => a === v), message: v => `Value not allowed (actual: ${v}, allowed: ${x.join(',')})`});
export const match = ({pattern, flags = undefined, message = undefined}: {pattern: string, flags?: any, message: string|undefined}) => ({test: v => new RegExp(pattern, flags).test(v), message: v => message ? (<any>message).replace('{{v}}', v) : `Malformed (actual: ${v}, expected: ${pattern})`});
export const hasUpperLetter = () => match({pattern: '[A-Z]+', message: 'At least one upper case letter is required'});
export const hasLowerLetter = () => match({pattern: '[a-z]+', message: 'At least one lower case letter is required'});
export const hasDigit = () => match({pattern: '[0-9]+', message: 'At least one digit is required'});
export const hasSpecialChar = () => match({pattern: '[!:$@&%()\\[\\];,/]+', message: 'At least one special character is required'});
export const email = () => match({pattern: '[^@]+@.+\.[^.]+$', message: 'Not a valid email'});
export const uuid = () => match({pattern: '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', flags: 'i', message: `Not a valid uuid (actual: {{v}}, expected: v4 format)`});
export const url = () => match({pattern: '^http[s]?://.$', flags: 'i', message: `Not a valid URL`});
export const arn = () => match({pattern: '^arn:[^:]*:[^:]*:[^:]*:[^:]*:.+$', message: `Not a valid AWS ARN`});
export const unknown = () => ({test: () => false, message: () => `Unknown validator`});
export const reference = ({type, localField, idField, fetchedFields = [], dir}) => {
    // @todo fix problem with c.fetchReference :(
    const fetchReference = async (value) => require('./services/caller').default.execute(`${type}_get`, {[idField]: value, fields: fetchedFields}, `${dir}/services/crud`);
    return ({
        test: async (value, localCtx) => {
            if (undefined === value) return true;
            try {
                const k = `${type}.${value}`;
                const existingData = {...(localCtx.data || {}), ...((localCtx.data || {})[k] || {})};
                let requiredData;
                const trackedFields = (fetchedFields && !!fetchedFields.length) ? fetchedFields : ['id'];
                if (!!trackedFields.find(f => !existingData.hasOwnProperty(f) || (undefined === existingData[f]))) {
                    requiredData = await fetchReference(value) || {};
                } else {
                    requiredData = trackedFields.reduce((acc, k) => {
                        acc[k] = existingData[k];
                        return acc;
                    }, <any>{});
                }
                localCtx.data[k] = requiredData;
                return true;
            } catch (e) {
                console.log(`Reference validator Error: type=${type}, localField=${localField} value=${value} => ${e.message}`);
                return false;
            }
        },
        message: (value) => `Unknown ${type} reference ${value} for ${localField}`,
    });
};