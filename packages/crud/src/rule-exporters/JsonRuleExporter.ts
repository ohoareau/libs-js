import IRuleExporter from "../IRuleExporter";
import Rule, { JsonRule } from "../Rule";

export default class JsonRuleExporter implements IRuleExporter {
    export(rules: Rule[], options: object): JsonRule[] {
        return rules.map((r: Rule) => r.toJson());
    }
}