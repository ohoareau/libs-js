import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';
import {DocumentNotFoundError} from "./errors";
import {hooked} from "./hook";
import {runQuery} from "./query";

const globalOptions = type => {
    return {
        prefix: process.env[`DYNAMODB_${type.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || undefined,
        suffix: process.env[`DYNAMODB_${type.toUpperCase()}_TABLE_SUFFIX`] || process.env.DYNAMODB_TABLE_SUFFIX || undefined,
    };
};

export default ({ type, schema, hooks = {} }) => {
    schema = Array.isArray(schema) ? schema : [schema, {}];
    const service = {};
    const options = {create: false, update: false, waitForActive: false, ...globalOptions(type)};
    const Model = dynamoose.model(type, new dynamoose.Schema(schema[0], schema[1]), options);
    const get = hooked('get', async (id: string): Promise<any> => {
        const doc = await Model.get(id);
        if (!doc) {
            throw new DocumentNotFoundError(type, id);
        }
        return doc;
    }, hooks, service, type);
    const find = hooked('find', async (criteria = {}, fields = [], limit = undefined, offset = undefined, sort = undefined, options = {}): Promise<any> => ({ items: await runQuery(Model, {criteria, fields, limit, offset, sort, options}) }), hooks, service, type);
    const create = hooked('create', async (data): Promise<any> => Model.create({...data, ...((data && data.id) ? {} : {id: uuidv4()})}), hooks, service, type);
    const update = hooked('update', async (id: string, data: any): Promise<any> => Model.update({ id }, data), hooks, service, type);
    const remove = hooked('remove', async (id: string): Promise<any> => Model.delete({ id }), hooks, service, type);
    return Object.assign(service, { get, find, create, update, remove });
};