import { defaults } from './defaults';
import {rule} from "./rule";
import Context from "../Context";
import SameValueFieldError from '../errors/SameValueFieldError';
import { track_change_with_timestamp } from "./track_change_with_timestamp";

const operation_flag = (
    operations,
    types,
    field: string
) => {
    return rule(operations, types, `check flag transition is allowed on \`${field}\` (_=>true|false, true=>false, false=>true)`, (ctx: Context, execCtx: Context) => {
        const newValueRaw = ctx.get('data', {})[field];
        const oldValueRaw = ctx.get('old', {})[field];
        if (undefined === newValueRaw && undefined === oldValueRaw) {
            return;
        }
        const newValue = undefined === newValueRaw ? false : newValueRaw;
        const oldValue = undefined === oldValueRaw ? false : oldValueRaw;
        if (newValue === oldValue) {
            throw new SameValueFieldError(field, newValue);
        }
    });
};

export const flag = (field: string, defaultValue: any = false, timestamp = false) => [
    defaults({[field]: defaultValue}),
    operation_flag('@update', 'validate', field),
    timestamp ? track_change_with_timestamp(field) : undefined,
];
