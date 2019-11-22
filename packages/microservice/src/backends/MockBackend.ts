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

export type Call = {
    method: string,
    args: any[],
}

export default class MockBackend implements BackendInterface {
    private readonly calls: Call[];
    constructor(config: BackendConfig, typeConfig: TypeConfig) {
        this.calls = [];
    }
    getCalls(): Call[] {
        return this.calls;
    }
    async find(query: FindQuery): Promise<DocumentPage> {
        this.calls.push({method: 'find', args: [query]});
        return <DocumentPage>{items: []};
    }
    async get(query: GetQuery): Promise<Document> {
        this.calls.push({method: 'get', args: [query]});
        return <Document>{};
    }
    async delete(query: DeleteQuery): Promise<DeleteResponse> {
        this.calls.push({method: 'delete', args: [query]});
        return <DeleteResponse>{};
    }
    async create(query: CreateQuery): Promise<Document> {
        this.calls.push({method: 'create', args: [query]});
        return <Document>{};
    }
    async update(query: UpdateQuery): Promise<UpdateResponse> {
        this.calls.push({method: 'update', args: [query]});
        return <UpdateResponse>{};
    }
}