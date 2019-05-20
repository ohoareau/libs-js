import Context from '../Context';
import { rule } from './rule';
import { defaults } from './defaults';
import SameValueFieldError from "../errors/SameValueFieldError";
import TransitionFieldError from "../errors/TransitionFieldError";
import {track_change_with_timestamp} from "./track_change_with_timestamp";

const stringifyWorkflow = (transitions: {[k: string]: string[]}): string => {
    const r = Object.keys(transitions).reduce((acc, k) => {
        acc.steps[k] = true;
        transitions[k].forEach(t => {
            acc.steps[t] = true;
        });
        acc.transitions.push(`${k}=>${transitions[k].join('|')}`);
        return acc;
    }, {steps: <{[kk: string]: boolean}>{}, transitions: <string[]>[]});
    return `steps: ${Object.keys(r.steps).filter(z => z !== '_').join('|')}, transitions: ${r.transitions.join(',')}`;
};

const operation_workflow = (
    operations,
    types,
    field: string,
    transitions: {[k: string]: string[]}
) => {
    return rule(operations, types, `check transition is allowed on \`${field}\` (${stringifyWorkflow(transitions)})`, (ctx: Context, execCtx: Context) => {
        const newValueRaw = (ctx.get('data', {}) || {})[field];
        const oldValueRaw = (ctx.get('old', {}) || {})[field];
        if (undefined === newValueRaw && undefined === oldValueRaw) {
            return;
        }
        const newValue = newValueRaw || '_';
        const oldValue = oldValueRaw || '_';
        if (!transitions[oldValue] || !transitions[oldValue].includes(newValue)) {
            if (oldValue === newValue) {
                throw new SameValueFieldError(field, newValue);
            }
            throw new TransitionFieldError(field, newValue, oldValue);
        }
    });
};

export const workflow = (field: string, definition: any, defaultValue: any = undefined, timestamp = false) => [
    defaultValue ? defaults({[field]: defaultValue}) : undefined,
    operation_workflow('@create|@update', 'validate', field, definition),
    timestamp ? track_change_with_timestamp(field) : undefined,
];
