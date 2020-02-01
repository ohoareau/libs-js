const boolean = () => ({test: v => 'boolean' === typeof v, message: v => `Not a boolean (actual: ${v})`});
const maxLength = ({max: x}) => ({test: v => v.length <= x, message: v => `Max length exceeded (${v.length} > ${x})`});
const values = ({values: x}) => ({test: v => !!x.find(a => a === v), message: v => `Value not allowed (actual: ${v}, allowed: ${x.join(',')})`});
const match = ({pattern, flags = undefined, message = undefined}) => ({test: v => new RegExp(pattern, flags).test(v), message: v => message ? (message).replace('{{v}}', v) : `Malformed (actual: ${v}, expected: ${pattern})`});
const email = () => match({pattern: '[^@]+@.+\.[^.]+$', message: 'Not a valid email'});
const uuid = () => match({pattern: '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', flags: 'i', message: `Not a valid uuid (actual: {{v}}, expected: v4 format)`});
const url = () => match({pattern: '^http[s]?://.$', flags: 'i', message: `Not a valid URL`});
const arn = () => match({pattern: '^arn:[^:]*:[^:]*:[^:]*:[^:]*:.+$', message: `Not a valid AWS ARN`});
const unknown = () => ({test: () => false, message: () => `Unknown validator '${type}'`});

const reference = ({type, localField, idField, fetchedFields}) => {
    // @todo fix problem with c.fetchReference :(
    return ({
        test: async (value, localCtx) => {
            try {
                const k = `${type}.${value}`;
                const existingData = {...(localCtx.data || {}), ...((localCtx.data || {})[k] || {})};
                let requiredData;
                if (!!fetchedFields.find(f => !existingData.hasOwnProperty(f) || (undefined === existingData[f]))) {

                    requiredData = await c.fetchReference({ // <<------- HERE
                        type,
                        value,
                        idField,
                        fetchedFields
                    }, localCtx) || {};
                } else {
                    requiredData = fetchedFields.reduce((acc, k) => {
                        acc[k] = existingData[k];
                        return acc;
                    }, {});
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

module.exports = {boolean, maxLength, values, match, email, uuid, url, arn, unknown, reference};