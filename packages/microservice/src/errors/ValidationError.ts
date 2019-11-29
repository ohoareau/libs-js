import {ErrorSerialization, Map} from '..';
import SerializableErrorInterface from "./SerializableErrorInterface";

export class ValidationError extends Error implements SerializableErrorInterface {
    private readonly errors: Map<Error[]>;
    private readonly schemaModel: Map;
    constructor(errors: Map<Error[]>, schemaModel: Map) {
        super(ValidationError.buildMessage(errors, schemaModel));
        this.errors = errors;
        this.schemaModel = schemaModel;
    }
    getErrors(): Map<Error[]> {
        return this.errors;
    }
    getSchemaModel(): Map {
        return this.schemaModel;
    }
    getErrorMessages(): Map<string[]> {
        return ValidationError.buildErrorMessages(this.getErrors());
    }
    serialize(): ErrorSerialization {
        return {
            errorType: 'validation',
            data: {},
            errorInfo: this.getErrorMessages(),
            message: 'Validation error',
        };
    }
    private static buildErrorMessage(k: string, v: Error): string {
        return `${k}: ${v.message}`;
    }
    private static buildErrorMessages(errors: Map<Error[]>): Map<string[]> {
        return Object.entries(errors).reduce((m, [k, v]) => {
            m[k] = v.map(vv => vv.message);
            return m;
        }, <Map<string[]>>{});
    }
    private static buildFlatErrorMessages(errors: Map<Error[]>): string[] {
        return Object.entries(errors).reduce((m, [k, v]) =>
            m.concat(v.map(vv => ValidationError.buildErrorMessage(k, vv)))
        , <string[]>[]);
    }
    private static buildMessage(errors: Map<Error[]>, schemaModel: Map): string {
        const n = Object.values(errors).reduce((n, a) => n + a.length, 0);
        return `Validation error (${n})\n\nerrors:\n  - ${ValidationError.buildFlatErrorMessages(errors).join("\n  - ")}`;
    }
}