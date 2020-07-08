import {mapSchema, MapperKind} from '@graphql-tools/utils';

export class StripNonQueryTransform {
    transformSchema(schema) {
        return mapSchema(schema, {
            [MapperKind.MUTATION]() { return null },
            [MapperKind.SUBSCRIPTION]() { return null },
        })
    }
}

export default StripNonQueryTransform