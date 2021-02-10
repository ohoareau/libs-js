export const uuid = () => () => require('uuid').v4();
export const pattern = ({pattern}) => data => {
    const envVarMatch = pattern.match(/^\[\[process.env.([^\]]+)]]$/);
    if (envVarMatch) {
        pattern = process.env[envVarMatch[1]] || '';
    }

    const r = new RegExp('\{\{([^\}]+)\}\}');
    const matches = [...pattern.matchAll(r)];
    const getValue = k => data[k];

    return matches.reduce((acc, m) => {
        for (let i = 0; i < (m.length - 1); i++) {
            acc = acc.replace(m[0], getValue(m[i + 1]));
        }
        return acc;
    }, pattern);
}