export const buildQueryDefinitionFromCriteria = criteria => {
    const keys = Object.keys(criteria);
    if (!keys.length) {
        return undefined;
    }
    return keys.reduce((acc, k) => {
        acc[k] = {eq: criteria[k]};
        return acc;
    }, {});
};

export const runQuery = async (m, {criteria, fields, limit, offset, sort, options}) => {
    const cfg = buildQueryDefinitionFromCriteria(criteria);
    let q = cfg ? m.query(cfg) : m.scan();
    if (!q || !q.exec) {
        throw new Error('Unable to build query/scan from definition');
    }
    if (limit) {
        q.limit(limit);
    }
    if (fields && fields.length) {
        q.attributes(fields);
    }
    if (offset) {
        q.startAt(offset);
    }
    if (sort) {
        Object.keys(sort).reduce((qq, k) => {
            return qq.where(k)[sort[k] === -1 ? 'descending' : 'ascending' ]();
        }, q);
    }
    if (options.consistent) {
        q.consistent();
    }
    if (options.all && q.all) {
        q.all();
    }
    return q.exec();
};