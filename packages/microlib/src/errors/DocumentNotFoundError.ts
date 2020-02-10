export default class DocumentNotFoundError extends Error {
    public readonly type: string;
    public readonly id: string;
    constructor(type, id) {
        id = ('string' === typeof id) ? id : JSON.stringify(id);
        super(`${type} '${id}' does not exist`);
        this.type = type;
        this.id = id;
    }
    serialize() {
        return {
            errorType: 'document-not-found',
            message: this.message,
            data: {},
            errorInfo: {
                type: this.type,
                id: this.id,
            }
        }
    }
}