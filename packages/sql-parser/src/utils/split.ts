export function split(sql: string): string[] {
    const v = sql
        ? sql.replace(/\r\n/g, "\n").split(/\n/).filter(x => ('#' !== x.slice(0, 1))).join("\n").split(/\s*;\n/g).map(x => x.trim())
        : []
    ;
    if (v && v.length) {
        if ((v.length === 1) && (v[0] === '')) return [];
        if (v[v.length - 1].slice(-1) === ';') v[v.length - 1] = v[v.length - 1].slice(0, -1);
    }
    return v;
}

export default split