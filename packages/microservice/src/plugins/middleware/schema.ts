import {Config} from '../..';
import {ValidationError} from "../../errors/ValidationError";

export default ({config: c}: {config: Config}) => {
    c.setSchemaModel(parseSchema(c));
    c.registerHook('validate_create', validateCreateHook(c));
    c.registerHook('validate_update', validateUpdateHook(c));
    c.registerHook('validate_delete', validateDeleteHook(c));
    c.registerHook('populate_create', populateCreateHook(c));
    c.registerHook('populate_update', populateUpdateHook(c));
    c.registerHook('populate_delete', populateDeleteHook(c));
    c.registerHook('before_create', beforeCreateHook(c));
    c.registerHook('before_update', beforeUpdateHook(c));
    c.registerHook('before_delete', beforeDeleteHook(c));
    c.registerHook('create', createHook(c));
    c.registerHook('update', updateHook(c));
    c.registerHook('delete', deleteHook(c));
    return next => async action => next(action);
};

const parseSchema = (c: Config) => {
    const def = c.schema;
    return Object.entries(def.attributes).reduce((acc, [k, d]) => {
        d = ('string' === typeof d) ? parseFieldString(d) : d;
        const {
            type, required, index, internal, validators, primaryKey,
            value, defaultValue,
            updateValue, updateDefaultValue,
        } = c.createField(d);
        acc.fields[k] = {type, ...(index ? {index} : {}), primaryKey};
        (((<any>d).config && (<any>d).config.required) || required) && (acc.requiredFields[k] = true);
        (validators && 0 < validators.length) && (acc.validators[k] = validators);
        !!value && (acc.values[k] = value);
        !!updateValue && (acc.updateValues[k] = updateValue);
        !!defaultValue && (acc.defaultValues[k] = defaultValue);
        !!updateDefaultValue && (acc.updateDefaultValues[k] = updateDefaultValue);
        !!internal && (acc.privateFields[k] = true);
        !!index && (acc.indexes[k] = index);
        !!primaryKey && (acc.primaryKey = k);
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
    });
};

const parseFieldString = s => {
    let required = false;
    let internal = false;
    let primaryKey = false;
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
    if (/^@/.test(s)) {
        index = [{name: s}];
        s = s.substr(1);
    }
    return {type: s, config: {index, internal, required, primaryKey}};
};

const validateCreateHook = c => ({req: {payload: {data}}}) => {
    const errors = {};
    Object.keys(c.getSchemaModel().privateFields).forEach(k => {
        delete data[k];
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
    Object.keys(c.getSchemaModel().privateFields).forEach(k => {
        delete data[k];
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
const createHook = c => () => {};
const updateHook = c => () => {};
const deleteHook = c => () => {};