import dynamoose from 'dynamoose';
import DocumentNotFoundError from '../errors/DocumentNotFoundError';

const globalOptions = ({name}) => ({
    prefix: process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || undefined,
    suffix: process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_SUFFIX`] || process.env.DYNAMODB_TABLE_SUFFIX || undefined,
});

const parseAndModifiers = (modifiers, s, callback) =>
    s.split(/\s*&\s*/).reduce((acc, t, i) => {
        (i > 0) && acc.push({type: 'and'});
        return callback(acc, t);
    }, modifiers)
;
const parseOrModifiers = (modifiers, s, callback) =>
    s.split(/\s*\|\s*/).reduce((acc, t, i) => {
        (i > 0) && acc.push({type: 'or'});
        return callback(acc, t);
    }, modifiers)
;
const parseModifier = (modifiers, s) => {
    const [a, b, ...c] = s.split(':');
    const value = (c.join(':') || '').trim();
    modifiers.push({type: 'filter', attribute: a});
    switch (b) {
        case 'null':
            modifiers.push({type: 'null'});
            break;
        case 'eq':
            modifiers.push({type: 'eq', value});
            break;
        case 'lt':
            modifiers.push({type: 'lt', value});
            break;
        case 'le':
            modifiers.push({type: 'le', value});
            break;
        case 'gt':
            modifiers.push({type: 'gt', value});
            break;
        case 'ge':
            modifiers.push({type: 'ge', value});
            break;
        case '^':
            modifiers.push({type: 'beginsWith', value});
            break;
        case '[]':
            const [lowerBound, upperBound] = value.split(/\s*[;,]\s*/);
            modifiers.push({type: 'between', lowerBound, upperBound});
            break;
        case '*':
            modifiers.push({type: 'contains', value});
            break;
        case 'in':
            modifiers.push({type: 'in', values: value.split(/\s*[;,]\s*/)});
            break;
        default:
            throw new Error(`Unable to parse unknown modifier: ${b} (in: ${s})`);
    }
    return modifiers;
};

const buildQueryModifiers = s => {
    if (!s || !('string' === typeof s) || !s.length) return [];
    return parseOrModifiers([], s,
        (modifiers, s) => parseAndModifiers(modifiers, s,
            (modifiers, s) => parseModifier(modifiers, s)
        )
    );
};

const buildQueryDefinitionFromCriteria = criteria => {
    const localCriteria = {...criteria};
    let modifiers = [];
    let query:any = undefined;
    if (localCriteria._) modifiers = buildQueryModifiers(localCriteria._);
    delete localCriteria._; // always delete even if empty
    const keys = Object.keys(localCriteria);
    if (keys.length) {
        query = keys.reduce((acc, k) => {
            acc[k] = {eq: localCriteria[k]};
            return acc;
        }, {});
    }
    return {query, modifiers};
};

const applyModifiers = (q, modifiers) => modifiers.reduce((qq, m) => {
    switch (m.type) {
        case 'filter':
            return qq.filter(m.attribute);
        case 'and':
            return qq.and();
        case 'or':
            return qq.or();
        case 'not':
            return qq.not();
        case 'null':
            return qq.null();
        case 'eq':
            return qq.eq(m.value);
        case 'lt':
            return qq.lt(m.value);
        case 'le':
            return qq.le(m.value);
        case 'gt':
            return qq.gt(m.value);
        case 'ge':
            return qq.ge(m.value);
        case 'beginsWith':
            return qq.beginsWith(m.value);
        case 'between':
            return qq.between(m.lowerBound, m.upperBound);
        case 'contains':
            return qq.contains(m.value);
        case 'in':
            return qq.in(m.values);
        default:
            throw new Error(`Unknown query modifier type '${m.type}'`);
    }
}, q);

const runQuery = async (m, {criteria, fields, limit, offset, sort, options = {}}) => {
    const {query, modifiers} = buildQueryDefinitionFromCriteria(criteria);
    let q = query ? m.query(query) : m.scan();
    if (!q || !q.exec) throw new Error('Unable to build query/scan from definition');
    q = applyModifiers(q, modifiers);
    if (limit) q.limit(limit);
    if (fields && fields.length) q.attributes(fields);
    if (offset) q.startAt(offset);
    if (sort) Object.entries(sort).reduce((qq, [k, s]) => qq.where(k)[s === -1 ? 'descending' : 'ascending' ](), q);
    if (options) {
        if (options['consistent']) q.consistent();
        if (options['all'] && q.all) q.all();
    }
    return q.exec();
};

const convertToQueryDsl = v => {
    if (Array.isArray(v)) {
        return `id:in:${v.join(',')}`;
    }
    let op;
    return Object.entries(v).reduce((acc, [k, vv]) => {
        op = Array.isArray(vv) ? `in:${vv.join(',')}` : `eq:${vv}`;
        acc.push(`${k}:${op}`);
        return acc;
    }, <string[]>[]).join('&');
};

export default {
    getDb: ({name, schema = {}, schemaOptions = {}, options = {}}) => {
        const model = dynamoose.model(
            name,
            new dynamoose.Schema(schema, schemaOptions),
            {...options, ...globalOptions({name})}
        );
        return {
            find: async (payload) => {
                return {items: (await runQuery(model, payload) || []).map(d => ({...(d || {})}))};
            },
            get: async (payload) => {
                let doc;
                let docs;
                if ('string' === typeof payload.id) {
                    doc = await model.get(payload.id);
                } else if (Array.isArray(payload.id)) {
                    docs = await model.batchGet(payload.id.map(id => ({id})));
                } else if ('object' === typeof payload.id) {
                    [doc = undefined] = (await runQuery(model, {
                        criteria: {_: convertToQueryDsl(payload.id)},
                        fields: payload.fields || {},
                        limit: 1,
                        offset: undefined,
                        sort: undefined,
                    }) || []).map(d => ({...(d || {})}));
                }
                if (docs) return [...docs];
                if (!doc) throw new DocumentNotFoundError(name, payload.id);
                return {...(doc || {})};
            },
            delete: async (payload) => {
                let doc;
                let docs;
                if ('string' === typeof payload.id) {
                    doc = {...(await model.delete({id: payload.id}) || {})};
                } else if(Array.isArray(payload.id)) {
                    await model.batchDelete(payload.id.map(id => ({id})));
                    docs = payload.id.map(id => ({id}));
                } else if ('object' === typeof payload.id) {
                    const toDeleteIds = (await runQuery(model, {
                        criteria: {_: convertToQueryDsl(payload.id)},
                        fields: ['id'],
                        limit: undefined,
                        offset: undefined,
                        sort: undefined,
                    }) || []);
                    await model.batchDelete(toDeleteIds.map(doc => ({id: doc.id})));
                    docs = toDeleteIds;
                }
                if (docs) return [...docs];
                if (!doc) throw new DocumentNotFoundError(name, payload.id);
                return {...(doc || {})};
            },
            create: async (payload) => {
                return {...(await model.create({...(payload.data || {})}) || {})};
            },
            update: async (payload) => {
                let doc: any;
                let docs;
                let ids = [];
                if ('string' === typeof payload.id) {
                    doc = {...(await model.update({id: payload.id}, payload.data || {}) || {})};
                } else if (Array.isArray(payload.id)) {
                    docs = await Promise.all(payload.id.map(async id => model.update({id}, payload.data || {}) || {}));
                } else if ('object' === typeof payload.id) {
                    ids = (await runQuery(model, {
                        criteria: {_: convertToQueryDsl(payload.id)},
                        fields: ['id'],
                        limit: undefined,
                        offset: undefined,
                        sort: undefined,
                    }) || []);
                    docs = await Promise.all(ids.map(async doc => model.update({id: (<any>doc).id}, payload.data || {}) || {}));
                }
                if (docs) return [...docs];
                if (!doc) throw new DocumentNotFoundError(name, payload.id);
                return {...(doc || {})};
            },
        };
    },
}