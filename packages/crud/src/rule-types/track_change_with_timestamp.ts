import {rule} from "./rule";
import Context from "../Context";

export const track_change_with_timestamp = (field: string, timestampField: string|undefined = undefined) => rule('@create|@update', 'before', `set \`${timestampField ? timestampField : `${field}UpdatedAt`}\` to current date/time when \`${field}\` changes`, (ctx: Context, execCtx: Context) => {
    const date = new Date(Date.now()).toISOString();
    let dd = ctx.get('data');
    if (!dd) {
        dd = {};
        ctx.set('data', dd);
    }
    if (dd.hasOwnProperty(field)) {
        dd[timestampField || `${field}UpdatedAt`] = date;
    }
});
