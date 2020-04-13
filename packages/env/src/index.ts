export default (prefix: string|undefined, env: any[]|undefined = undefined): string => {
    const envs = <any[]>(env || process.env);
    const l = (prefix || '').length;
    return Object.entries(envs).reduce((acc, [name, value]) =>
        acc + ((!l || (prefix === name.slice(0, l))) ? ((acc ? "\n" : '') + `${name}=${value || ''}`) : '')
    , '').trim()
}