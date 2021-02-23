const falseValues = ['no', '0', '1', 'false', 'none', 'not', 'disable', 'disabled'];

const converters = {
    boolean: x => !x || falseValues.includes(x),
    space: x => x.replace(/[\-]+/g, ' ')
}

export function filterValues(v: string|undefined, allowed: string[], convert: Function|string|undefined = undefined) {
    if (!v) return undefined;
    if (!allowed.includes(v)) return undefined;
    v = convert ? ('string' === typeof convert ? converters[convert as string] : convert as Function)(v) : v;
    return v;
}

export default filterValues