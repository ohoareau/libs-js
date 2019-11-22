import dynamoose from 'dynamoose';
import BackendInterface from "@ohoareau/microservice/lib/BackendInterface";
import {
    BackendConfig,
    CreateQuery,
    DeleteQuery,
    DeleteResponse,
    Document,
    DocumentPage,
    FindQuery,
    GetQuery, TypeConfig,
    UpdateQuery, UpdateResponse
} from "@ohoareau/microservice/lib/types";

type DynamooseModelConfig = {
    name: string,
    schema: any,
    schemaOptions: any,
    options: any,
}

export default class DynamooseBackend implements BackendInterface {
    private readonly model;
    constructor(config: BackendConfig, typeConfig: TypeConfig) {
        const { name, schema, schemaOptions, options } = DynamooseBackend.loadConfig(config, typeConfig);
        this.model = dynamoose.model(name, new dynamoose.Schema(schema, schemaOptions), options);
    }
    private static loadConfig(config: BackendConfig, typeConfig: TypeConfig): DynamooseModelConfig {
        // @todo
        return <DynamooseModelConfig>{
            name: config.type,
            schema: {},
            schemaOptions: {},
            options: {},
        };
    }
    getModel() {
        return this.model;
    }
    async find(query: FindQuery): Promise<DocumentPage> {
        return <DocumentPage>{items: []};
    }
    async get(query: GetQuery): Promise<Document> {
        console.log(query, this);
        return <Document>{};
    }
    async delete(query: DeleteQuery): Promise<DeleteResponse> {
        return <DeleteResponse>{};
    }
    async create(query: CreateQuery): Promise<Document> {
        return <Document>{};
    }
    async update(query: UpdateQuery): Promise<UpdateResponse> {
        return <UpdateResponse>{};
    }
}