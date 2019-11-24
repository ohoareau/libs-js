import dynamoose from 'dynamoose';
import {Map, TypedMap} from "../..";

export default (config: TypedMap) => {
    const { name, schema, schemaOptions, options } = {
        name: config.type,
        schema: {},
        schemaOptions: {},
        options: {},
    };
    const model = dynamoose.model(name, new dynamoose.Schema(schema, schemaOptions), options);
    console.log(model);
    return async (operation: string, payload: any, options?: Map) => {
        switch (operation) {
            case 'find':
                return {items: []};
            case 'get':
                return {};
            case 'delete':
                return {};
            case 'create':
                return {};
            case 'update':
                return {};
            default:
                return undefined;
        }
    }
}