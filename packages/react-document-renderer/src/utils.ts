export const styling = (type: string|string[], stylesheet: any, forced: any = undefined) => {
    const types: string[] = (Array.isArray(type) ? type : [type]).filter(x => !!x);
    const styles = {};
    if (stylesheet && stylesheet.types) {
        const foundTypeStyle = types.find(t => !!stylesheet.types[t]);
        if (foundTypeStyle) Object.assign(styles, stylesheet.types[foundTypeStyle]);
    }
    Object.assign(styles, forced || {});
    return Object.entries(styles).reduce((acc, [k, v]) => {
        if ('string' !== typeof v) return acc;
        const x = (<string>v).indexOf('$');
        if (0 > x) return acc;
        if (0 === x) acc[k] = (stylesheet.variables || {})[v.slice(1)] || undefined;
        else {
            let array;
            while ((array = /\$([a-z0-9_]+)/i.exec(<string>v)) !== null) {
                v = (<string>v).replace(array[0], (stylesheet.variables || {})[array[1]] || undefined);
            }
            acc[k] = v;
        }
        return acc;
    }, styles);
};
