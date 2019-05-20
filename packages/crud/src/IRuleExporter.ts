import Rule from "./Rule";

export default interface IRuleExporter {
    export(rules: Rule[], options: object);
}
