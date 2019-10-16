import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';

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

const hooked = (operation, callback, hooks, service) => async (...args) => {
    const ctx = { args, result: undefined, service};
    const operationUpper = `${operation.substr(0, 1).toUpperCase()}${operation.substr(1)}`;
    await applyHook(`before${operationUpper}`, hooks, ctx);
    ctx.result = await callback.apply(null, args);
    await applyHook(``, hooks, ctx);
    await applyHook(`${operation}Job`, hooks, ctx, createJobHook);
    await applyHook(`${operation}Message`, hooks, ctx, createMessageHook);
};

export default ({ type, schema, hooks = {} }) => {
    const service = {};
    const options = {create: false, update: false, waitForActive: false, ...globalOptions};
    const Model = dynamoose.model(type, schema, options);
    const get = hooked('get', async (id: string): Promise<any> => Model.get(id), hooks, service);
    const find = hooked('find', async (): Promise<any> => ({items: await Model.scan().exec()}), hooks, service);
    const create = hooked('create', async (data): Promise<any> => Model.create({...data, id: uuidv4()}), hooks, service);
    const update = hooked('update', async (id: string, data: any): Promise<any> => Model.update({ id }, data), hooks, service);
    const remove = hooked('remove', async (id: string): Promise<any> => Model.delete({ id }), hooks, service);
    return Object.assign(service, { get, find, create, update, remove });
};