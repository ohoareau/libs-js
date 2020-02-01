const uuid = () => () => require('uuid/v4')();
const now = () => () => new Date().valueOf();
const ref_attribute_field = ({key, prefix, sourceField}) => ({data, contextData}) => {
    if (!data || !data[key]) return undefined;
    return (contextData[`${prefix}.${data[key]}`] || {})[sourceField] || undefined;
};
const empty = () => () => undefined;
const value = ({value}) => () => value;

module.exports = {uuid, now, ref_attribute_field, empty, value};