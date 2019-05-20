interface CreateData {
    data: object;
}
interface UpdateData {
    id: string;
    data: object;
}
interface GetData {
    id: string;
    fields: string[];
}
interface FindData {
    criteria: object;
    fields: string[];
    limit: number|undefined;
    sort: object|undefined;
    nextToken: string|undefined;
}
interface RemoveData {
    id: string;
}

export { CreateData, UpdateData, GetData, FindData, RemoveData };