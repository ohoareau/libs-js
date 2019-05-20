import BackendError from "./BackendError";

export default class UnknownItemBackendError extends BackendError {
    constructor(backend: string, table: string, id: string, data: object = {}) {
        super(backend, 'item.unknown', {...data, table, id}, `Unknown item '${id}' in table '${table}' for backend ${backend}`);
    }
}