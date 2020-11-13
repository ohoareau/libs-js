import {violation} from "../types";
import ValidationError from "../errors/ValidationError";
import AbstractFormat from "./AbstractFormat";

export class Format1_0 extends AbstractFormat {
    constructor() {
        super();
    }
    validate(def: any): void {
        const violations = [];
        if (def.models) this.analyzeModels(def, violations);
        if (violations.length) throw new ValidationError(violations);

    }
    protected analyzeModels(def: {models: any, [key: string]: any}, violations: violation[]) {
        Object.entries(def.models).reduce((acc, [name, model]) => {
            const path = `${name}`;
            if (!model || ('object' !== typeof model)) acc.push({path, error: new Error('Missing type for field')});
            if (!(model as any).type) acc.push({path, error: new Error('Missing type for field')});
            return acc;
        }, violations);
    }
}

export default Format1_0