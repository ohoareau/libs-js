import {violation} from "../types";

export class ValidationError extends Error {
    constructor(violations: violation[] = []) {
        super(ValidationError.buildMessage(violations));
    }
    static buildMessage(violations: any[]): string {
        return `Validation error (${violations.length} violation${violations.length > 1 ? 's' : ''})\n ${ValidationError.buildSummary(violations)}`;
    }
    static buildSummary(violations: any[]): string {
        return violations.reduce((acc, v) => {
            return acc + `[${v.path}] : ${v.error}\n`
        }, '');
    }

}

export default ValidationError