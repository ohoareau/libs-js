import caller from './services/caller';

const pattern = /^\[\[[^\]]+]]$/;

const computeConfig = (c, d) => {
    if ('object' === typeof c) return Object.entries(c).reduce((acc, [k, v]) =>
        Object.assign(acc, {[k]: computeConfig(v, d)})
    , {});
    if (Array.isArray(c)) return c.map(v => computeConfig(v, d));
    if (('string' === typeof c) && pattern.test(c)) return ('[[value]]' === c) ? d : d[c.substr(2, c.length - 4)];
    return c;
};

export const isTransition = (attribute, from, to, data) => {
    const old = (data && data.oldData) ? data.oldData[attribute] : undefined;
    const current = (data && data.data) ? data.data[attribute] : undefined;
    if (old === current) return false;
    return (('*' === to) || (current === to)) && (('*' === from) || (old === from));
};

export const isEqualTo = (attribute, value, data, key = 'data') => data && data[key] && (value === data[key][attribute]);
export const isNotEqualTo = (attribute, value, data, key = 'data') => !data || !data[key] || (value !== data[key][attribute]);
export const isLessThan = (attribute, value, data, key = 'data') => data && data[key] && (value > data[key][attribute]);
export const isLessOrEqualThan = (attribute, value, data, key = 'data') => data && data[key] && (value >= data[key][attribute]);
export const isGreaterThan = (attribute, value, data, key = 'data') => data && data[key] && (value < data[key][attribute]);
export const isGreaterOrEqualThan = (attribute, value, data, key = 'data') => data && data[key] && (value <= data[key][attribute]);
export const isModulo = (attribute, value, data, key = 'data') => data && data[key] && (0 === (value % data[key][attribute]));
export const isDefined = (attribute, data, key = 'data') => data && data[key] && ((undefined !== data[key][attribute]) && (null !== data[key][attribute]));
export const isNotDefined = (attribute, data, key = 'data') => !data || !data[key] || (undefined === data[key][attribute]) || (null === data[key][attribute]);

export const findPlugin = (type, name, dir) => {
    let h;
    if ('@' === name.substr(0, 1)) {
        h = require(`./${type}s/${name.substr(1)}`).default;
    } else {
        h = require(`${dir}/${type}s/${name}`);
    }
    return h;
};
export const loadPlugin = (pluginType, cfg, {dir}) => {
    const t = typeof cfg;
    if ('function' === t) return cfg;
    if ('string' === t) cfg = {type: '@operation', config: {operation: cfg}};
    const {type, config = {}} = cfg || {};
    return findPlugin(pluginType, type, dir)({...config, dir});
};

export const createOperationHelpers = (operation, model, dir) => {
    const origDir = dir;
    dir = `${dir}/../..`;
    const operationName = operation.substr(model.name.length + 1);
    const hook = async (n, d, c = {}, opts = {}) => {
        if (opts['ensureKeys'] && Array.isArray(opts['ensureKeys'])) {
            opts['ensureKeys'].reduce((acc, k) => {
                acc[k] = acc.hasOwnProperty(k) ? acc[k] : '';
                return acc;
            }, Array.isArray(d) ? d[0] : d);
        }
        if (opts['trackData'] && Array.isArray(opts['trackData']) && (0 < opts['trackData'].length)) {
            const data = Array.isArray(d) ? d[1] : d;
            if (0 === opts['trackData'].filter(f => data.hasOwnProperty(f)).length) return Array.isArray(d) ? d[0] : d;
        }
        const h = findPlugin('hook', n, dir);
        const args = Array.isArray(d) ? d : [d];
        if (!!opts['loop']) return (await Promise.all(((args[0] || {})[opts['loop']] || []).map(async item => h({...computeConfig(c, item), o: operation, model, dir, hook})(...args)))).pop();
        return h({...c, o: operation, operationName, model, dir, hook})(...args);
    };
    const call = async (name, ...args) => caller.execute(name, args, origDir);
    const updateReferences = async (name, key, value) => {
        // @todo handle multiple page
        try {
            const page = await call(`${name}_find`, {criteria: {[key]: value}, fields: ['id']});
            await Promise.all(((page || {}).items || []).map(async i => call(`${name}_update`, {
                id: i.id,
                data: {[key]: value}
            })));
        } catch (e) {
            console.error('Update references FAILED', {name, key, value}, e);
        }
    };
    const lambdaEvent = async (arn, payload) =>
        require('./services/aws/lambda').default.execute(arn, payload, {async: true})
    ;
    const snsPublish = async (topic, message, attributes = {}) =>
        require('./services/aws/sns').default.publish({message, attributes, topic})
    ;
    const deleteReferences = async (name, key, value) => {
        // @todo handle multiple page
        try {
            const page = await call(`${name}_find`, {criteria: {[key]: value}, fields: ['id']});
            await Promise.all(((page || {}).items || []).map(async i => call(`${name}_delete`, {id: i.id})));
        } catch (e) {
            console.error('Delete references FAILED', {name, key, value}, e);
        }
    };
    const validate = async (query, required = true) => hook('@validate', query, {required});
    const prefetch = async query => hook('@prefetch', query);
    const populate = async (query, prefix = undefined) => hook('@populate', query, {prefix});
    const prepare = async query => hook('@prepare', query);
    const after = async (result, query) => hook('@after', [result, query]);
    const dispatch = async (result, query) => hook('@dispatch', [result, query]);
    return {validate, populate, prefetch, dispatch, prepare, after, isTransition, isEqualTo, isNotEqualTo, isNotDefined, isDefined, isLessThan, isLessOrEqualThan, isGreaterThan, isGreaterOrEqualThan, isModulo, hook, updateReferences, deleteReferences, call, lambdaEvent, snsPublish};
};