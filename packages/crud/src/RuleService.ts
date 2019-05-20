import Rule from "./Rule";
import ApplicationError from "./errors/ApplicationError";
import IRuleExporter from "./IRuleExporter";

export default class RuleService {
    private exporters: IRuleExporter[];
    constructor() {
        this.exporters = [];
    }
    addExporter(type: string, exporter: IRuleExporter): this {
        this.exporters[type] = exporter;
        return this;
    }
    getExporter(type: string): IRuleExporter {
        this.checkExporter(type);
        return this.exporters[type];
    }
    checkExporter(type: string): this {
        if (!this.hasExporter(type)) {
            throw new ApplicationError(1400, 'rule.exporter.unknown', `Unknown rule exporter '${type}'`);
        }
        return this;
    }
    hasExporter(type: string): boolean {
        return !!this.exporters[type];
    }
    export(rules: Rule[], type: string, options: object = {}): any {
        return this.getExporter(type).export(rules, options);
    }
    convert(rules: object): Rule[] {
        return Object.keys(rules).reduce((acc, k) => acc.concat(this.convertRulesSub(rules[k], k, k)), <Rule[]>[]);
    }
    protected convertRulesSub(rr, prefix, prefixMultiple): Rule[] {
        if ('function' === typeof rr) {
            rr = rr();
        }
        if (Array.isArray(rr) && 1 === rr.length) {
            rr = rr[0];
        }
        if (!Array.isArray(rr)) {
            if (!rr) {
                return [];
            }
            if (Array.isArray(rr) || 'function' === typeof rr) {
                return this.convertRulesSub(rr, prefix, `${prefixMultiple}-A`);
            }
            let { operations, types, handler, title, condition = undefined } = rr;
            operations = (Array.isArray(operations) ? operations : (operations ? operations.split(/\s*\|\s*/) : []));
            types = (Array.isArray(types) ? types : (types ? types.split(/\s*\|\s*/) : []));
            return [new Rule(prefix, title, operations, types, handler || (() => {}), condition)];
        }
        return rr.reduce((acc, r, i) => {
            const ii = String.fromCharCode(65 + i);
            return acc.concat(this.convertRulesSub(r, (0 === i) ? prefix : `${prefixMultiple}-${ii}`, `${prefixMultiple}-${ii}`));
        }, []);
    }
    public static map(rules: object): Rule[] {
        return new RuleService().convert(rules);
    }
}