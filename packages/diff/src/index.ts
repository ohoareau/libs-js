export default (a, b) => {
    if (Array.isArray(a)) {
        if (Array.isArray(b)) return b.reduce((acc, v, k) =>
            ((('undefined' === typeof a[k]) && (undefined !== v)) || (a[k] !== v)) || acc
        , false) ? b : [];
        return b;
    }
    if ('object' === typeof a) {
        if ('object' === typeof b) return Object.entries(b).reduce((acc, [k, v]) => {
            if ('_' !== k.substr(0, 1)) {
                if (!a.hasOwnProperty(k) || a[k] !== v) acc[k] = v;
            }
            return acc;
        }, {});
        return b;
    }
    return (a !== b) ? b : undefined;
};
