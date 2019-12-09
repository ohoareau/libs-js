import {Context, Config, register, Map} from "../..";
import * as fieldTypes from '../fieldtype';
import {ValidationError} from "../../errors/ValidationError";

export const transformers = {
    upper: v => `${v}`.toUpperCase(),
    lower: v => `${v}`.toLowerCase(),
};

export const registerEventListener = (c: Config, eventKey: string, listener: Function) => {
    if (!c.events) c.events = {};
    if (!c.events[eventKey]) c.events[eventKey] = [];
    if (!Array.isArray(c.events[eventKey])) c.events[eventKey] = [c.events[eventKey]];
    c.events[eventKey].push(listener);
};

export const registerOperation = (c: Config, operation: string, callback: Function) => {
    c.operations[operation] = callback;
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
    c.fetchReference = async (def, {config, data: contextData}) => {
        const k = def.type.replace('.', '_');
        if (!config.references || !config.references[k]) throw new Error(`No reference fetch for type '${def.type}' (key is references.${k})`);
        return await config.references[k](config)({...def, contextData});
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
    const referenceFieldsEntries = Object.entries(c.schemaModel.referenceFields);
    if (referenceFieldsEntries.length) {
        const registerReferenceEventListener = (c: Config, v: Map, operation: string, listener: Function) => {
            registerEventListener(c, `${(<any>v).reference.replace('.', '_')}_${operation}`, listener);
        };
        referenceFieldsEntries.forEach(([k, v]) => {
            registerReferenceEventListener(c, <Map>v, 'update', async (data, { config: { type, operation } }) =>
                operation(`${type}.update`, {params: {id: {[k]: data[(<any>v).idField]}, input: {[k]: data[(<any>v).idField]}, contextData: data}})
            );
            registerReferenceEventListener(c, <Map>v, 'delete', async (data, { config: { type, operation } }) =>
                operation(`${type}.delete`, {params: {id: {[k]: data[(<any>v).idField]}, contextData: data}})
            );
        });
    }
}

const buildReferenceValidator = (c: Config, type, localField, idField = 'id', fetchedFields: string[] = []) => {
    return ({
        test: async (value, localCtx) => {
            try {
                const k = `${type}.${value}`;
                const existingData = {...(localCtx.data || {}), ...((localCtx.data || {})[k] || {})};
                let requiredData;
                if (!!fetchedFields.find(f => !existingData.hasOwnProperty(f) || (undefined === existingData[f]))) {
                    requiredData = await c.fetchReference({
                        type,
                        value,
                        idField,
                        fetchedFields
                    }, localCtx) || {};
                } else {
                    requiredData = fetchedFields.reduce((acc, k) => {
                        acc[k] = existingData[k];
                        return acc;
                    }, {});
                }
                localCtx.data[k] = requiredData;
                return true;
            } catch (e) {
                console.log(`Reference validator Error: type=${type}, localField=${localField} value=${value} => ${e.message}`);
                return false;
            }
        },
        message: (value) => `Unknown ${type} reference ${value} for ${localField}`,
    });
};

const parseSchema = (c: Config) => {
    const def = c.schema;
    const operations = {
        delete: {complete: 'delete', pending: true, bypass: true},
        create: {pending: true},
        update: {pending: true},
    };
    const schema = Object.entries(def.attributes).reduce((acc, [k, d]) => {
        d = {
            ...('string' === typeof d) ? parseFieldString(c, d, k) : d,
        };
        const forcedDef = {...(<Map>d || {})};
        delete forcedDef.config;
        delete forcedDef.type;
        let officialDef = c.createField(d);
        const def = {
            ...officialDef,
            ...forcedDef,
            validators: [].concat(officialDef.validators || [], forcedDef.validators || []),
        };
        const {
            type = 'string', list = false, volatile = false, required = false, index = [], internal = false, validators = undefined, primaryKey = false,
            value = undefined, default: rawDefaultValue = undefined, defaultValue = undefined, updateValue = undefined, updateDefault: rawUpdateDefaultValue = undefined, updateDefaultValue = undefined,
            upper = false, lower = false, transform = undefined, reference = undefined, refAttribute = undefined,
        } = def;
        acc.fields[k] = {
            type, primaryKey, volatile,
            ...((index && index.length > 0) ? {index} : {}),
            ...(list ? {list} : {}),
        };
        acc.transformers[k] = transform ? (Array.isArray(transform) ? [...transform] : [transform]) : [];
        required && (acc.requiredFields[k] = true);
        if (refAttribute) {
            if (!acc.refAttributeFields[refAttribute.parentField]) acc.refAttributeFields[refAttribute.parentField] = [];
            acc.refAttributeFields[refAttribute.parentField].push({sourceField: refAttribute.sourceField, targetField: k, field: refAttribute.field});
        }
        (undefined !== reference) && (acc.referenceFields[k] = reference);
        (validators && 0 < validators.length) && (acc.validators[k] = validators);
        (undefined !== value) && (acc.values[k] = value);
        (undefined !== updateValue) && (acc.updateValues[k] = updateValue);
        (undefined !== defaultValue) && (acc.defaultValues[k] = defaultValue);
        (undefined !== rawDefaultValue) && (acc.defaultValues[k] = () => rawDefaultValue);
        (undefined !== updateDefaultValue) && (acc.updateDefaultValues[k] = updateDefaultValue);
        (undefined !== rawUpdateDefaultValue) && (acc.updateDefaultValues[k] = () => rawUpdateDefaultValue);
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
        referenceFields: {},
        refAttributeFields: {},
    });
    Object.entries(schema.refAttributeFields).forEach(([k, vList]) => {
        const x = (<any[]>vList).reduce((acc, v) => {
            acc.sourceFields[v.sourceField] = true;
            acc.targetFields[v.targetField] = true;
            acc.values[v.targetField] = ({req: {payload: {data, contextData}}}) => {
                if (!data || !data[k]) return undefined;
                return (contextData[`${schema.referenceFields[k].reference}.${data[k]}`] || {})[v.sourceField] || undefined;
            };
            acc.updateValues[v.targetField] = ({req: {payload: {data, contextData}}}) => {
                if (!data || !data[k]) return undefined;
                return (contextData[`${schema.referenceFields[k].reference}.${data[k]}`] || {})[v.sourceField] || undefined;
            };
            return acc;
        }, {targetFields: [], sourceFields: [], values: [], updateValues: []});
        if (!schema.referenceFields[k]) throw new Error(`${k} is not a reference field (but is a ref attribute requirement for ${Object.keys(x.targetFields).join(', ')})`);
        if (!schema.validators[k]) schema.validators[k] = [];
        schema.referenceFields[k].fetchedFields = ['id'].concat(schema.referenceFields[k].fetchedFields, Object.keys(x.sourceFields));
        schema.validators[k].push(
            buildReferenceValidator(
                c,
                schema.referenceFields[k].reference,
                k,
                schema.referenceFields[k].idField,
                schema.referenceFields[k].fetchedFields
            )
        );
        Object.entries(schema.referenceFields).forEach(([_, v]) => {
            const referenceKey = ((<any>v).reference).replace('.', '_');
            if (!c.references) c.references = {};
            if (c.references[referenceKey]) return;
            c.references[referenceKey] = (config) => async ({type, value, idField, fetchedFields, contextData}) =>
                config.operation(`${type}.get`, {params: {[idField]: value, fields: fetchedFields, contextData}})
            ;
        });
        Object.assign(schema.values, x.values);
        Object.assign(schema.updateValues, x.updateValues);
    });
    Object.entries(operations).forEach(([operation, operationDef]) => {
        const key = `${operation}Job`;
        if (!def[key]) return;
        const mode = {pendingInput: () => ({}), completeInput: () => ({}), failureInput: () => ({}), ...def[key]};
        registerEventListener(c, `${c.type}_${operation}_complete`, async (payload, { config: { operation } }) =>
            operation(`${c.type}.${(<any>operationDef).complete || 'update'}`, {params: {id: payload.id, complete: true, input: {...(await mode.completeInput(payload))}}})
        );
        registerEventListener(c, `${c.type}_${operation}_failure`, async (payload, { config: { operation } }) =>
            operation(`${c.type}.${(<any>operationDef).failure || 'update'}`, {params: {id: payload.id, input: {...(await mode.failureInput(payload))}}})
        );
        if ((<any>operationDef).bypass) {
            registerOperation(c, operation, c => async (payload, options, process) => {
                if (payload && payload.complete) return process();
                return (<any>operationDef).pending
                    ? c.operation(`${c.type}.update`, {params: {id: payload.id, input: {...(await mode.pendingInput(payload))}}})
                    : undefined
                ;
            });
        } else if ((<any>operationDef).pending) {
            c.registerHooks([
                [`populate_${operation}`, async action => {
                    Object.assign(action.req.payload.data, await mode.pendingInput(action.req.payload));
                }],
            ]);
        }
    });
    return schema;
};

const parseFieldString = (c: Config, s, name) => {
    let required = false;
    let internal = false;
    let primaryKey = false;
    let volatile = false;
    let reference: Map|undefined = undefined;
    let index = <any[]>[];
    let refAttribute: Map|undefined = undefined;
    const validators = <any[]>[];
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
    if (/^ref:/.test(s)) {
        reference = {reference: s.substr(4), idField: 'id', fetchedFields: []};
        s = 'string';
    }
    if (/^refattr:/.test(s)) {
        const [parentField, sourceField] = s.substr(8).split(/:/);
        refAttribute = {parentField, sourceField, field: name};
        s = 'string';
    }
    return {type: s, index, internal, required, primaryKey, volatile, reference, refAttribute, validators, config: {}};
};

const validateCreateHook = c => async ({req}) => {
    const localCtx = {config: c, data: req.payload.contextData || {}};
    const errors = {};
    const fields = c.schemaModel.fields;
    const privateFields = c.schemaModel.privateFields;
    Object.keys(req.payload.data).forEach(k => {
        if (!fields[k] || privateFields[k]) delete req.payload.data[k];
    });
    Object.keys(c.schemaModel.requiredFields).forEach(k => {
        if (!req.payload.data.hasOwnProperty(k)) {
            if (!errors[k]) errors[k] = [];
            errors[k].push(new Error('Field is required'));
        }
    });
    await Promise.all(Object.entries(req.payload.data).map(async ([k, v]) => {
        if (!c.schemaModel.validators[k]) return;
        await Promise.all(c.schemaModel.validators[k].map(async validator => {
            if (!(await validator.test(v, localCtx))) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(await validator.message(v, localCtx)));
            }
        }));
    }));
    if (0 < Object.keys(errors).length) throw new ValidationError(errors, c.schemaModel);
    req.payload.contextData = Object.assign(req.payload.contextData || {}, localCtx.data || {});
};
const validateUpdateHook = c => ({req}) => {
    const localCtx = {config: c, data: req.payload.contextData || {}};
    const errors = {};
    const fields = c.schemaModel.fields;
    const privateFields = c.schemaModel.privateFields;
    Object.keys(req.payload.data).forEach(k => {
        if (!fields[k] || privateFields[k]) delete req.payload.data[k];
    });
    Object.entries(req.payload.data).forEach(([k, v]) => {
        if (!c.schemaModel.validators[k]) return;
        c.schemaModel.validators[k].forEach(validator => {
            if (!validator.test(v, localCtx)) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(validator.message(v, localCtx)));
            }
        })
    });
    if (0 < Object.keys(errors).length) throw new ValidationError(errors, c.schemaModel);
};
const hookOp = (_) => async (action) => {
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
        action.req.payload.data[k] = (<Function>valueGenerator)(action, c);
    });
    Object.entries(c.schemaModel.defaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)(action, c);
    });
};
const hookUpdatePopOp = c => (action) => {
    Object.entries(c.schemaModel.updateValues).forEach(([k, valueGenerator]) => {
        action.req.payload.data[k] = (<Function>valueGenerator)(action, c);
    });
    Object.entries(c.schemaModel.updateDefaultValues).forEach(([k, defaultValueGenerator]) => {
        if (action.req.payload.data[k]) return;
        action.req.payload.data[k] = (<Function>defaultValueGenerator)(action, c);
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