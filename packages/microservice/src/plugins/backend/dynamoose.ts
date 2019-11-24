import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';
import {TypedMap} from "../..";
import {DocumentNotFoundError} from "../../errors/DocumentNotFoundError";

const globalOptions = (config: TypedMap) => ({
    prefix: process.env[`DYNAMODB_${config.type.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || undefined,
    suffix: process.env[`DYNAMODB_${config.type.toUpperCase()}_TABLE_SUFFIX`] || process.env.DYNAMODB_TABLE_SUFFIX || undefined,
});

export default (config: TypedMap) => {
    const { name, schema, schemaOptions, options } = {
        name: config.type,
        schema: {},
        schemaOptions: {},
        options: {},
    };
    const model = dynamoose.model(
        name,
        new dynamoose.Schema(schema, schemaOptions),
        {...globalOptions(config), ...options}
    );
    return async (operation: string, payload: any) => {
        switch (operation) {
            case 'find':
                return {items: await runQuery(model, payload)};
            case 'get':
                const doc = await model.get(payload.id);
                if (!doc) throw new DocumentNotFoundError(config.type, payload.id);
                return doc;
            case 'delete':
                return model.delete({id: payload.id});
            case 'create':
                return model.create({...payload, ...((payload && payload.id) ? {} : {id: uuidv4()})});
            case 'update':
                return model.update({id: payload.id}, payload);
            default:
                return undefined;
        }
    }
}

const parseAndModifiers = (modifiers: any[], s: string, callback: Function) =>
    s.split(/\s*&\s*/).reduce((acc, t, i) => {
        (i > 0) && acc.push({type: 'and'});
        return callback(acc, t);
    }, modifiers)
;
const parseOrModifiers = (modifiers: any[], s: string, callback: Function) =>
    s.split(/\s*\|\s*/).reduce((acc, t, i) => {
        (i > 0) && acc.push({type: 'or'});
        return callback(acc, t);
    }, modifiers)
;
const parseModifier = (modifiers: any[], s: string) => {
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

export const buildQueryModifiers = s => {
    if (!s || !('string' === typeof s) || !s.length) return [];
    return parseOrModifiers([], s,
        (modifiers, s) => parseAndModifiers(modifiers, s,
            (modifiers, s) => parseModifier(modifiers, s)
        )
    );
};

export const buildQueryDefinitionFromCriteria = criteria => {
    const localCriteria = {...criteria};
    let modifiers: any[] = [];
    let query: any = undefined;
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

export const applyModifiers = (q, modifiers) => modifiers.reduce((qq, m) => {
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

export const runQuery = async (m, {criteria, fields, limit, offset, sort, options}) => {
    const {query, modifiers} = buildQueryDefinitionFromCriteria(criteria);
    let q = query ? m.query(query) : m.scan();
    if (!q || !q.exec) throw new Error('Unable to build query/scan from definition');
    q = applyModifiers(q, modifiers);
    if (limit) q.limit(limit);
    if (fields && fields.length) q.attributes(fields);
    if (offset) q.startAt(offset);
    if (sort) Object.entries(sort).reduce((qq, [k, s]) => qq.where(k)[s === -1 ? 'descending' : 'ascending' ](), q);
    if (options.consistent) q.consistent();
    if (options.all && q.all) q.all();
    return q.exec();
};