import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';

class DocumentNotFoundError extends Error {
    public type: String;
    public id: String;
    constructor(type, id) {
        super(`${type} '${id}' does not exist`);
        this.type = type;
        this.id = id;
    }
}
const globalOptions = {
    prefix: process.env.DYNAMODB_TABLE_PREFIX || undefined,
    suffix: process.env.DYNAMODB_TABLE_SUFFIX || undefined,
};

const createJobHook = def => ctx => {
    console.log(ctx, def);
};

const createMessageHook = def => ctx => {
    console.log(ctx, def);
};

const createHook = callback => (callback instanceof Function)
    ? callback
    : () => {
        throw new Error(`Malformed hook callback (not a function)`);
    }
;

const applyHook = async (name, hooks, ctx, hookFactory = createHook) => hooks[name] ? hookFactory(hooks[name]).apply(null, [ctx]) : undefined;

const hooked = (operation, callback, hooks, service) => async (...args): Promise<any> => {
    const ctx = { args, result: undefined, service};
    const operationUpper = `${operation.substr(0, 1).toUpperCase()}${operation.substr(1)}`;
    await applyHook(`before${operationUpper}`, hooks, ctx);
    ctx.result = await callback.apply(null, args);
    await applyHook(operation, hooks, ctx);
    await applyHook(`${operation}Job`, hooks, ctx, createJobHook);
    await applyHook(`${operation}Message`, hooks, ctx, createMessageHook);
    return ctx.result;
};
const buildQueryDefinitionFromCriteria = (criteria) => {
    return Object.keys(criteria).reduce((acc, k) => {
        acc[k] = {eq: criteria[k]};
        return acc;
    }, {});
};

const runQuery = async (m, {criteria, fields, limit, offset, sort, options}) => {
    let q = m.query(buildQueryDefinitionFromCriteria(criteria));
    console.log(m, criteria, fields, limit, offset, sort, options, q);
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
    if (options.all) {
        q.all();
    }
    console.log(q);
    return q.exec();
};

export default ({ type, schema, hooks = {} }) => {
    const service = {};
    const options = {create: false, update: false, waitForActive: false, ...globalOptions};
    const Model = dynamoose.model(type, schema, options);
    const get = hooked('get', async (id: string): Promise<any> => {
        const doc = await Model.get(id);
        if (!doc) {
            throw new DocumentNotFoundError(type, id);
        }
        return doc;
    }, hooks, service);
    const find = hooked('find', async (criteria = {}, fields = [], limit = undefined, offset = 0, sort = undefined, options = {}): Promise<any> => ({ items: await runQuery(Model, {criteria, fields, limit, offset, sort, options}) }), hooks, service);
    const create = hooked('create', async (data): Promise<any> => Model.create({...data, id: uuidv4()}), hooks, service);
    const update = hooked('update', async (id: string, data: any): Promise<any> => Model.update({ id }, data), hooks, service);
    const remove = hooked('remove', async (id: string): Promise<any> => Model.delete({ id }), hooks, service);
    return Object.assign(service, { get, find, create, update, remove });
};