import {GraphQLObjectType, GraphQLNonNull} from 'gatsby/graphql';
import {addTypes, modifyObjectFields} from '@graphql-tools/utils';

export class NamespaceUnderFieldTransform {
    private readonly fieldName: string;
    private readonly typeName: string;
    private readonly resolver: Function;
    constructor({typeName, fieldName, resolver}) {
        this.typeName = typeName
        this.fieldName = fieldName
        this.resolver = resolver
    }
    transformSchema(schema) {
        const queryConfig = schema.getQueryType().toConfig()
        const nestedQuery = new GraphQLObjectType({...queryConfig, name: this.typeName})
        let newSchema = addTypes(schema, [nestedQuery])
        const newRootFieldConfigMap = {
            [this.fieldName]: {
                type: new GraphQLNonNull(nestedQuery),
                resolve: (parent, args, context, info) => {
                    if (this.resolver != null) {
                        return this.resolver(parent, args, context, info)
                    }

                    return {}
                },
            },
        };
        return modifyObjectFields(newSchema, queryConfig.name, () => true, newRootFieldConfigMap)[0];
    }
}

export default NamespaceUnderFieldTransform