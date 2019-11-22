import BackendInterface from "../BackendInterface";
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
} from "../types";

export default class MemoryBackend implements BackendInterface {
    private readonly data: {[key: string]: any};
    constructor(config: BackendConfig, typeConfig: TypeConfig) {
        this.data = config.data;
    }
    getData(): {[key: string]: any} {
        return this.data;
    }
    async find(query: FindQuery): Promise<DocumentPage> {
        return <DocumentPage>{items: Object.values(this.data)};
    }
    async get(query: GetQuery): Promise<Document> {
        return <Document>this.data[query.id];
    }
    async delete(query: DeleteQuery): Promise<DeleteResponse> {
        const doc = this.data[query.id];
        delete this.data[query.id];
        return <DeleteResponse>doc;
    }
    async create(query: CreateQuery): Promise<Document> {
        this.data[query.id] = query.data;
        return <Document>this.data[query.id];
    }
    async update(query: UpdateQuery): Promise<UpdateResponse> {
        this.data[query.id] = {...this.data[query.id], ...query.data};
        return <UpdateResponse>this.data[query.id];
    }
}