import { reference } from './reference';
import { required } from './required';
import { defaults_from_reference } from "./defaults_from_reference";

type getterType = object & ({get: (id: string, fields: string[]) => Promise<object>});

export const parent = (field: string, service: getterType, fields: string[], defaultsFromFields: string[] = [], extraFetchedFields: string[] = []) => [
    reference(field, service, fields, (<string[]>[]).concat(defaultsFromFields, extraFetchedFields)),
    defaultsFromFields ? defaults_from_reference(field, defaultsFromFields) : undefined,
    required(field),
];