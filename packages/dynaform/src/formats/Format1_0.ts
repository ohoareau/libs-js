
import AbstractFormat from "./AbstractFormat";
import Ajv from "ajv";
import ValidationError from "../errors/ValidationError";
import {violation} from "../types";

export class Format1_0 extends AbstractFormat {
    private v;

    constructor() {
        super();
        this.setValidator(new Ajv().compile(require('../../assets/schema-1.0.json')));
    }

    setValidator(v): void {
        this.v = v;
    }
    validate(def: any): void {
        const violations = [];
        this.analyzeModels(def, violations);
        if (violations.length) throw new ValidationError(violations);
    }
    protected analyzeModels(def: {models: any, [key: string]: any}, violations: violation[]) {
        if (this.v(def)) {
            return;
        }

        this.v.errors.reduce((acc, {dataPath, message, params}) => {
            acc.push({
                path: dataPath,
                error: new Error(`${message} ${Object.keys(params).length > 0 ? '(' + JSON.stringify(params) + ')' : ''}`.trim())
            });
            return acc;
        }, violations);
    }
}

export default Format1_0