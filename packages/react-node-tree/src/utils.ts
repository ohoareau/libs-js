export const buildTree = (data, formatter: Function|undefined = undefined) => {
    data = formatter ? formatter(data) : data;
    if (Array.isArray(data)) return {
        items: data.reduce((acc, d, label) => {
            acc.push({label, ...buildTree(d, formatter)});
            return acc;
        }, <{label: string, [key: string]: any}[]>[]),
    };
    if (null !== data && 'object' === typeof data) return {
        items: Object.entries(data).reduce((acc, [k, v]) => {
            const {label: valueLabel, ...r} = buildTree(v, formatter);
            acc.push({label: valueLabel ? `${k} = ${valueLabel}` : k, ...r});
            return acc;
        }, <{label: string, [key: string]: any}[]>[]),
    };
    return {label: String(data)};
};