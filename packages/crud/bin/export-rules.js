#!/usr/bin/env node

const { RuleService, JsonRuleExporter, StringRuleExporter } = require('@ohoareau/crud');

const e = new RuleService();
const ruleExporters = {
    json: JsonRuleExporter,
    string: StringRuleExporter,
};

const args = process.argv.slice(2);
const {positionals: services = [], options: {format = 'string'}} = args.reduce((acc, v) => {
    let matches = v.match(/^--([^=]{2,})=(.*)$/);
    if (!matches) {
        let matches = v.match(/^-([^=])$/);
        if (!matches) {
            acc.positionals.push(v);
        } else {
            acc.options[matches[1]] = true;
        }
    } else {
        acc.options[matches[1]] = matches[2];
    }
    return acc;
}, {positionals: [], options: {}});

if (!ruleExporters[format]) {
    throw new Error(`Unknown format '${format}', unable to export rules`);
}

e.addExporter(format, new ruleExporters[format]());

services.forEach(s => {
    const { default: serviceClass } = require(s);
    const service = new serviceClass();
    console.log(`${service.getName().toUpperCase()}:\n`);
    e.export(service.getRules(), format).forEach(k => {
        console.log(`  - ${k}`);
    });
    console.log();
});
