import IRuleExporter from "../IRuleExporter";
import Rule, { JsonRule } from "../Rule";

export default class StringRuleExporter implements IRuleExporter {
    export(rules: Rule[], options: object): string[] {
        return rules.map((r: Rule) => StringRuleExporter.convertToString(r.toJson()));
    }
    static convertToString(r: JsonRule): string {
        return `${r.name}: ${r.conditional ? 'conditionnally ' : ''}on ${r.types.join('/')} ${StringRuleExporter.formatOperations(r.operations)}, ${r.title}`;
    }
    static formatOperations(operations: string[]) {
        return operations.map(v => v === '@' ? 'for any core operations' : v).join(' or ');
    }
}