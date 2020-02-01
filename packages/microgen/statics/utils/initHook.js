module.exports = (operation, model) => async (n, d, c = {}, opts = {}) => {
    if (opts.ensureKeys && Array.isArray(opts.ensureKeys)) {
        opts.ensureKeys.reduce((acc, k) => {
            acc[k] = acc.hasOwnProperty(k) ? acc[k] : '';
            return acc;
        }, Array.isArray(d) ? d[0] : d);
    }
    if (opts.trackData && Array.isArray(opts.trackData) && (0 < opts.trackData.length)) {
        const data = Array.isArray(d) ? d[1] : d;
        if (0 === opts.trackData.filter(f => data.hasOwnProperty(f)).length) return Array.isArray(d) ? d[0] : d;
    }
    // @todo consume opts.loop by reducing (async !)
    return require(`../hooks/${n}`)({...c, o: operation, model})(...(Array.isArray(d) ? d : [d]));
};