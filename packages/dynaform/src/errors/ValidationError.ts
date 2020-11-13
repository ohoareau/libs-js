import {violation} from "../types";

export class ValidationError extends Error {
    constructor(violations: violation[] = []) {
        super(ValidationError.buildMessage(violations));
    }
    static buildMessage(violations: any[]) {
        return `Validation error (${violations.length} violation${violations.length > 1 ? 's' : ''})`;
    }
}

export default ValidationError