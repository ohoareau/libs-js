import {Context, Config, register, Map} from "../..";
import m from '../middleware/schema';
import * as fieldTypes from '../fieldtype';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.schema) return;
    Object.entries(fieldTypes).forEach(([k, v]) => register('fieldtype', k, v));
    c.createField = def => {
        if (!plugins.fieldtype || !plugins.fieldtype[def.type]) {
            throw new Error(`Unknown field type '${def.type}'`);
        }
        return plugins.fieldtype[def.type]((def || {}).config || {});
    };
    c.setSchemaModel = sm => {
        c.schemaModel = sm;
    };
    c.getSchemaModel = () => c.schemaModel || {};
    c.middlewares.push(m);
}