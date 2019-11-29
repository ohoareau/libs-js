import {Context, Config, register, Map} from "../..";
import * as fieldTypes from '../fieldtype';
import {ValidationError} from "../../errors/ValidationError";

export const transformers = {
    upper: v => `${v}`.toUpperCase(),
    lower: v => `${v}`.toLowerCase(),
};

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.schema) return;
    Object.entries(fieldTypes).forEach(([k, v]) => register('fieldtype', k, v));
    c.createField = def => {
        if (!plugins.fieldtype || !plugins.fieldtype[def.type]) {
            throw new Error(`Unknown field type '${def.type}'`);
        }
        return plugins.fieldtype[def.type]((def || {}).config || {});
    };
    c.schemaModel = parseSchema(c);
    const hks: [string, any][] = [
        ['validate_create', validateCreateHook(c)],
        ['validate_update', validateUpdateHook(c)],
    ];
    (0 < Object.keys(c.schemaModel.transformers).length) && hks.push(
        ['transform_create', transformCreateHook(c)],
        ['transform_update', transformUpdateHook(c)]
    );
    ((0 < Object.keys(c.schemaModel.values).length) || (0 < Object.keys(c.schemaModel.defaultValues).length)) && hks.push(
        ['populate_create', populateCreateHook(c)],
    );
    ((0 < Object.keys(c.schemaModel.updateValues).length) || (0 < Object.keys(c.schemaModel.updateDefaultValues).length)) && hks.push(
        ['populate_update', populateUpdateHook(c)],
    );
    (0 < Object.keys(c.schemaModel.volatileFields).length) && hks.push(
        ['prepare_create', prepareCreateHook(c)],
        ['prepare_update', prepareUpdateHook(c)],
        ['create', createHook(c)],
        ['update', updateHook(c)],
    );

    c.registerHooks(hks, true);
}

const parseSchema = (c: Config) => {
    const def = c.schema;
    return Object.entries(def.attributes).reduce((acc, [k, d]) => {
        d = {
            ...('string' === typeof d) ? parseFieldString(d, k) : d,
        };
        const forcedDef = {...(<Map>d || {})};
        delete forcedDef.config;
        delete forcedDef.type;
        let officialDef = c.createField(d);
        const def = {...officialDef, ...forcedDef};
        const {
            type = 'string', list = false, volatile = false, required = false, index = [], internal = false, validators = undefined, primaryKey = false,
            value = undefined, default: rawDefaultValue = undefined, defaultValue = undefined, updateValue = undefined, updateDefault: rawUpdateDefaultValue = undefined, updateDefaultValue = undefined,
            upper = false, lower = false, transform = undefined,
        } = def;
        acc.fields[k] = {
            type, primaryKey, volatile,
            ...((index && index.length > 0) ? {index} : {}),
            ...(list ? {list} : {}),
        };
        acc.transformers[k] = transform ? (Array.isArray(transform) ? [...transform] : [transform]) : [];
        required && (acc.requiredFields[k] = true);
        (validators && 0 < validators.length) && (acc.validators[k] = validators);
        value && (acc.values[k] = value);
        updateValue && (acc.updateValues[k] = updateValue);
        defaultValue && (acc.defaultValues[k] = defaultValue);
        rawDefaultValue && (acc.defaultValues[k] = () => rawDefaultValue);
        updateDefaultValue && (acc.updateDefaultValues[k] = updateDefaultValue);
        rawUpdateDefaultValue && (acc.updateDefaultValues[k] = () => rawUpdateDefaultValue);
        internal && (acc.privateFields[k] = true);
        index && (index.length > 0) && (acc.indexes[k] = index);
        volatile && (acc.volatileFields[k] = true);
        primaryKey && (acc.primaryKey = k);
        upper && (acc.transformers[k].push(transformers.upper));
        lower && (acc.transformers[k].push(transformers.lower));
        if (0 === acc.transformers[k]) delete acc.transformers[k];
        return acc;
    }, {
        primaryKey: <any>undefined,
        fields: {},
        privateFields: {},
        requiredFields: {},
        validators: {},
        values: {},
        updateValues: {},
        defaultValues: {},
        updateDefaultValues: {},
        indexes: {},
        volatileFields: {},
        transformers: {},
    });
};

const parseFieldString = (s, name) => {
    let required = false;
    let internal = false;
    let primaryKey = false;
    let volatile = false;
    let index = <any[]>[];
    if (/!$/.test(s)) {
        required = true;
        s = s.substr(0, s.length - 1);
    }
    if (/^&/.test(s)) {
        primaryKey = true;
        s = s.substr(1);
    }
    if (/^:/.test(s)) {
        internal = true;
        s = s.substr(1);
    }
    if (/^#/.test(s)) {
        s = s.substr(1);
        volatile = true;
    }
    if (/^@/.test(s)) {
        s = s.substr(1);
        index = [{name}];
    }
    return {type: s, index, internal, required, primaryKey, volatile, config: {}};
};

const validateCreateHook = c => ({req: {payload: {data}}}) => {
    const errors = {};
    const fields = c.schemaModel.fields;
    const privateFields = c.schemaModel.privateFields;
    Object.keys(data).forEach(k => {
        if (!fields[k] || privateFields[k]) delete data[k];
    });
    Object.keys(c.schemaModel.requiredFields).forEach(k => {
        if (!data.hasOwnProperty(k)) {
            if (!errors[k]) errors[k] = [];
            errors[k].push(new Error('Field is required'));
        }
    });
    Object.entries(data).forEach(([k, v]) => {
        if (!c.schemaModel.validators[k]) return;
        c.schemaModel.validators[k].forEach(validator => {
            if (!validator.test(v)) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(validator.message(v)));
            }
        })
    });
    if (0 < Object.keys(errors).length) throw new ValidationError(errors, c.schemaModel);
};
const validateUpdateHook = c => ({req: {payload: {data}}}) => {
    const errors = {};
    const fields = c.schemaModel.fields;
    const privateFields = c.schemaModel.privateFields;
    Object.keys(data).forEach(k => {
        if (!fields[k] || privateFields[k]) delete data[k];
    });
    Object.entries(data).forEach(([k, v]) => {
        if (!c.schemaModel.validators[k]) return;
        c.schemaModel.validators[k].forEach(validator => {
            if (!validator.test(v)) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(validator.message(v)));
            }
        })
    });
    if (0 < Object.keys(errors).length) throw new ValidationError(errors, c.schemaModel);
};
const hookOp = (c) => async (action) => {
    if (!action.req.payload.volatileData || 0 === Object.keys(action.req.payload.volatileData).length) {
        delete action.req.payload.volatileData;
        return;
    }
    Object.assign(action.req.payload.data, action.req.payload.volatileData);
    action.res.result = await action.res.result;
    Object.assign(action.res.result, action.req.payload.volatileData);
    delete action.req.payload.volatileData;
};
const hookCreatePopOp = c => (action) => {
    Object.entries(c.schemaModel.values).forEach(([k, valueGenerator]) => {
        action.req.payload.data[k] = (<Function>valueGenerator)();
    });
    Object.entries(c.schemaModel.defaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)();
    });
};
const hookUpdatePopOp = c => (action) => {
    Object.entries(c.schemaModel.updateValues).forEach(([k, valueGenerator]) => {
        action.req.payload.data[k] = (<Function>valueGenerator)();
    });
    Object.entries(c.schemaModel.updateDefaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)();
    });
};
const hookPrepOp = c => (action) => {
    const volatileFields = c.schemaModel.volatileFields;
    action.req.payload.volatileData = {};
    Object.entries(action.req.payload.data).forEach(([k, v]) => {
        if (volatileFields[k]) {
            action.req.payload.volatileData[k] = v;
            delete action.req.payload.data[k];
        }
    });
};
const hookTransOp = c => (action) => {
    const transformers = c.schemaModel.transformers;
    Object.entries(action.req.payload.data).forEach(([k, v]) => {
        if (transformers[k]) {
            action.req.payload.data[k] = transformers[k].reduce((acc, t) => t(acc), v);
        }
    });
};
const populateCreateHook = hookCreatePopOp;
const populateUpdateHook = hookUpdatePopOp;
const transformCreateHook = hookTransOp;
const transformUpdateHook = hookTransOp;
const prepareCreateHook = hookPrepOp;
const prepareUpdateHook = hookPrepOp;
const createHook = hookOp;
const updateHook = hookOp;