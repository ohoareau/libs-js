import {Map,Config} from '../..';
import {ValidationError} from "../../errors/ValidationError";

export default ({config: c}: {config: Config}) => {
    c.setSchemaModel(parseSchema(c));
    c.registerHooks([
        ['validate_create', validateCreateHook(c)],
        ['validate_update', validateUpdateHook(c)],
        ['validate_delete', validateDeleteHook(c)],
        ['populate_create', populateCreateHook(c)],
        ['populate_update', populateUpdateHook(c)],
        ['populate_delete', populateDeleteHook(c)],
        ['before_create', beforeCreateHook(c)],
        ['before_update', beforeUpdateHook(c)],
        ['before_delete', beforeDeleteHook(c)],
        ['prepare_create', prepareCreateHook(c)],
        ['prepare_update', prepareUpdateHook(c)],
        ['prepare_delete', prepareDeleteHook(c)],
        ['create', createHook(c)],
        ['update', updateHook(c)],
        ['delete', deleteHook(c)],
        ['notify_create', notifyCreateHook(c)],
        ['notify_update', notifyUpdateHook(c)],
        ['notify_delete', notifyDeleteHook(c)],
        ['clean_create', cleanCreateHook(c)],
        ['clean_update', cleanUpdateHook(c)],
        ['clean_delete', cleanDeleteHook(c)],
    ], true);
    return next => async action => next(action);
};

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
        } = def;
        acc.fields[k] = {
            type, primaryKey, volatile,
            ...((index && index.length > 0) ? {index} : {}),
            ...(list ? {list} : {}),
        };
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
    const fields = c.getSchemaModel().fields;
    const privateFields = c.getSchemaModel().privateFields;
    Object.keys(data).forEach(k => {
        if (!fields[k] || privateFields[k]) {
            delete data[k];
        }
    });
    Object.keys(c.getSchemaModel().requiredFields).forEach(k => {
        if (!data.hasOwnProperty(k)) {
            if (!errors[k]) errors[k] = [];
            errors[k].push(new Error('Field is required'));
        }
    });
    Object.entries(data).forEach(([k, v]) => {
        if (!c.getSchemaModel().validators[k]) {
            return;
        }
        c.getSchemaModel().validators[k].forEach(validator => {
            if (!validator.test(v)) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(validator.message(v)));
            }
        })
    });
    if (0 < Object.keys(errors).length) {
        throw new ValidationError(errors, c.getSchemaModel());
    }
};
const validateUpdateHook = c => ({req: {payload: {data}}}) => {
    const errors = {};
    const fields = c.getSchemaModel().fields;
    const privateFields = c.getSchemaModel().privateFields;
    Object.keys(data).forEach(k => {
        if (!fields[k] || privateFields[k]) {
            delete data[k];
        }
    });
    Object.entries(data).forEach(([k, v]) => {
        if (!c.getSchemaModel().validators[k]) {
            return;
        }
        c.getSchemaModel().validators[k].forEach(validator => {
            if (!validator.test(v)) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(validator.message(v)));
            }
        })
    });
    if (0 < Object.keys(errors).length) {
        throw new ValidationError(errors, c.getSchemaModel());
    }
};
const validateDeleteHook = c => () => {};
const populateCreateHook = c => (action) => {
    Object.entries(c.getSchemaModel().values).forEach(([k, valueGenerator]) => {
        action.req.payload.data[k] = (<Function>valueGenerator)();
    });
    Object.entries(c.getSchemaModel().defaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)();
    });
};
const populateUpdateHook = c => (action) => {
    Object.entries(c.getSchemaModel().updateValues).forEach(([k, valueGenerator]) => {
        action.req.payload.data[k] = (<Function>valueGenerator)();
    });
    Object.entries(c.getSchemaModel().updateDefaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)();
    });
};
const populateDeleteHook = c => () => {};
const beforeCreateHook = c => () => {};
const beforeUpdateHook = c => () => {};
const beforeDeleteHook = c => () => {};
const prepareCreateHook = c => (action) => {
    const volatileFields = c.getSchemaModel().volatileFields;
    action.req.payload.volatileData = {};
    Object.entries(action.req.payload.data).forEach(([k, v]) => {
        if (volatileFields[k]) {
            delete action.req.payload.data[k];
            action.req.payload.volatileData[k] = v;
        }
    });
};
const prepareUpdateHook = c => (action) => {
    const volatileFields = c.getSchemaModel().volatileFields;
    action.req.payload.volatileData = {};
    Object.entries(action.req.payload.data).forEach(([k, v]) => {
        if (volatileFields[k]) {
            delete action.req.payload.data[k];
            action.req.payload.volatileData[k] = v;
        }
    });
};
const prepareDeleteHook = c => () => {};
const createHook = c => async (action) => {
    if (!action.req.payload.volatileData || 0 === Object.keys(action.req.payload.volatileData).length) return;
    Object.assign(action.req.payload.data, action.req.payload.volatileData);
    action.res.result = await action.res.result;
    Object.assign(action.res.result, action.req.payload.volatileData);
    delete action.req.payload.volatileData;
};
const updateHook = c => async (action) => {
    if (!action.req.payload.volatileData || 0 === Object.keys(action.req.payload.volatileData).length) return;
    Object.assign(action.req.payload.data, action.req.payload.volatileData);
    action.res.result = await action.res.result;
    Object.assign(action.res.result, action.req.payload.volatileData);
    delete action.req.payload.volatileData;
};
const deleteHook = c => () => {};
const notifyCreateHook = c => () => {};
const notifyUpdateHook = c => () => {};
const notifyDeleteHook = c => () => {};
const cleanCreateHook = c => () => {};
const cleanUpdateHook = c => () => {};
const cleanDeleteHook = c => () => {};
