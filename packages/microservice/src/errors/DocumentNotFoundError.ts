export class DocumentNotFoundError extends Error {
    public type: String;
    public id: String;
    constructor(type, id) {
        super(`${type} '${id}' does not exist`);
        this.type = type;
        this.id = id;
    }
}