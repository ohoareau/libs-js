export default prefix =>
    Object.entries(process.env).reduce((acc, [name, defaultValue]) => {
        if (new RegExp(`^${prefix}`).test(name)) {
            acc += (acc ? "\n" : '') + `${name}=${(process.env.hasOwnProperty(name) ? process.env[name] : defaultValue) || ''}`;
        }
        return acc;
    }, '').trim()
;