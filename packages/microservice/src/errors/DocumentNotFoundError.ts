import SerializableErrorInterface from "./SerializableErrorInterface";
import {ErrorSerialization} from "../index";

export class DocumentNotFoundError extends Error implements SerializableErrorInterface {
    public type: String;
    public id: String;
    constructor(type, id) {
        super(`${type} '${id}' does not exist`);
        this.type = type;
        this.id = id;
    }
    serialize(): ErrorSerialization {
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