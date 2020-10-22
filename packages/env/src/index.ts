export default (prefix: string|undefined, env: any[]|undefined = undefined): string => {
    const envs = <any[]>(env || process.env);
    const l = (prefix || '').length;
    return Object.entries(envs).reduce((acc, [name, value]) =>
        acc + ((!l || (prefix === name.slice(0, l))) ? ((acc ? "\n" : '') + `${name}=${valuify(value || '')}`) : '')
    , '').trim()
}

const valuify = v => {
    if ('string' !== typeof v) return v;
    if (0 === v.length) return '';
    if ((0 <= v.indexOf(' ')) || (0 <= v.indexOf(';'))) return `"${v}"`;

    return v;
}