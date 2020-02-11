export const uuid = () => () => require('uuid/v4')();
export const now = () => () => new Date().valueOf();
export const ref_attribute_field = ({key, prefix, sourceField}) => ({data, contextData}) => {
    if (!data || !data[key]) return undefined;
    return (contextData[`${prefix}.${data[key]}`] || {})[sourceField] || undefined;
};
export const empty = () => () => undefined;
export const value = ({value}) => () => value;