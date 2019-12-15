import {Config, TypedMap} from "../..";
import dynamodbFactory from "../../factories/dynamodb";

export default (bc: TypedMap, c: Config) => {
    const db = dynamodbFactory({name: c.full_type, ...parseSchemaModel(c.schemaModel)});
    return async (operation: string, payload: any) => db[operation] ? db[operation](payload) : undefined;
}

const mutateField = def => {
    const field: {type: Function|string, [key: string]: any} = {type: String};
    switch (def.type) {
        case 'string':
            field.type = String;
            break;
        case 'number':
            field.type = Number;
            break;
        case 'boolean':
            field.type = Boolean;
            break;
        default:
            if (Array.isArray(def.type)) {
                field.type = 'list';
                field.list = def.type.map(l => mutateField(l));
            } else if ('object' === typeof def.type) {
                field.type = 'map';
                field.map = Object.entries(def.type).reduce((acc, [k, v]) => {
                    acc[k] = mutateField(v);
                    return acc;
                }, {});
            }
            break;
    }
    if (def.hasOwnProperty('default')) {
        field.default = def.default;
    }
    if (def.primaryKey) {
        field.hashKey = true;
    }
    if (def.index && (def.index.length > 0)) {
        field.index = def.index.map(i => ({
            global: true,
            name: i.name,
            throughput: {read: 1, write: 1},
            project: true,
        }));
    }
    return def.list ? [field] : field;
};

const parseSchemaModel = (s) => Object.entries(s.fields).reduce((acc: any, [k, def]: [string, any]) => {
    if (def.volatile) return acc;
    acc.schema[k] = mutateField(def);
    if (s.requiredFields && s.requiredFields[k]) {
        acc.schema[k].required = true;
    }
    return acc;
}, {schema: {}, schemaOptions: {}, options: {create: false, update: false, waitForActive: false}});