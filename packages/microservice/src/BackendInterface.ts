import {
    BackendConfig,
    CreateQuery,
    DeleteQuery,
    DeleteResponse,
    Document,
    DocumentPage,
    FindQuery,
    GetQuery, TypeConfig,
    UpdateQuery, UpdateResponse,
} from "./types";

interface BackendInterface {
    get: (query: GetQuery) => Promise<Document>;
    find: (query: FindQuery) => Promise<DocumentPage>;
    delete: (query: DeleteQuery) => Promise<DeleteResponse>;
    create: (query: CreateQuery) => Promise<Document>;
    update: (query: UpdateQuery) => Promise<UpdateResponse>;
}

interface BackendInterfaceConstructor {
    new(config: BackendConfig, typeConfig: TypeConfig): BackendInterface;
}

declare const BackendInterface: BackendInterfaceConstructor;

export default BackendInterface;