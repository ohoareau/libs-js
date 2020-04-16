const computeValue = (data, raw) => {
    if ('string' === typeof raw) {
        if ('@' === raw.slice(0, 1)) {
            return raw.slice(1).split(/\./g).reduce((acc, k) => acc[k], data);
        }
        return raw;
    }
    return raw;
};

export const noop = () => () => undefined;
export const defaults = def => ({data}) => Object.entries(def.data || {}).reduce((acc, [k, v]) =>
    Object.assign(acc, {[k]: acc[k] || computeValue(acc, v)})
, data);
export const populate = def => ({data}) => Object.entries(def.data || {}).reduce((acc, [k, v]) =>
    Object.assign(acc, {[k]: computeValue(acc, v)})
, data);