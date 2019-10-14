import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';

const globalOptions = {
    prefix: process.env.DYNAMODB_TABLE_PREFIX || undefined,
    suffix: process.env.DYNAMODB_TABLE_SUFFIX || undefined,
};

export default ({ type, schema }) => {
    const options = {create: false, update: false, waitForActive: false, ...globalOptions};
    const Model = dynamoose.model(type, schema, options);
    const get = async (id: string): Promise<any> => Model.get(id);
    const find = async (): Promise<any> => ({items: await Model.scan().exec()});
    const create = async (data): Promise<any> => Model.create({...data, id: uuidv4()});
    const update = async (id: string, data: any): Promise<any> => Model.update({ id }, data);
    const remove = async (id: string): Promise<any> => Model.delete({ id });
    return {
        get, find, create, update, remove,
    };
};