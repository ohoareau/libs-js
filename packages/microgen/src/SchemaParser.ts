import * as fieldTypes from './fieldTypes';

export default class SchemaParser {
    public readonly fieldTypes: {[key: string]: Function} = {};
    constructor() {
        Object.entries(fieldTypes).forEach(([k, v]) => this.fieldTypes[k] = v);
    }
    parse(def: any): any {
        def = {attributes: {}, hooks: {}, ...def};
        const schema = {
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
            hooks: def.hooks,
        };
        this.parseAttributes(def, schema);
        this.parseRefAttributeFields(def, schema);
        this.parseJob(def, schema);
        return schema;
    }
    parseAttributes(def: any, schema: any) {
        Object.entries(def.attributes).reduce((acc, [k, d]) => {
            d = {
                ...('string' === typeof d) ? this.parseFieldString(d, k) : d,
            };
            const forcedDef: any = {...(d || {})};
            delete forcedDef.config;
            delete forcedDef.type;
            let officialDef = this.createField(d);
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
                acc.refAttributeFields[refAttribute.parentField].push({
                    sourceField: refAttribute.sourceField,
                    targetField: k,
                    field: refAttribute.field
                });
            }
            (undefined !== reference) && (acc.referenceFields[k] = reference);
            (validators && 0 < validators.length) && (acc.validators[k] = validators);
            (undefined !== value) && (acc.values[k] = value);
            (undefined !== updateValue) && (acc.updateValues[k] = updateValue);
            (undefined !== defaultValue) && (acc.defaultValues[k] = defaultValue);
            (undefined !== rawDefaultValue) && (acc.defaultValues[k] = {type: '@value', config: {value: rawDefaultValue}});
            (undefined !== updateDefaultValue) && (acc.updateDefaultValues[k] = updateDefaultValue);
            (undefined !== rawUpdateDefaultValue) && (acc.updateDefaultValues[k] = {type: '@value', config: {value: rawUpdateDefaultValue}});
            internal && (acc.privateFields[k] = true);
            index && (index.length > 0) && (acc.indexes[k] = index);
            volatile && (acc.volatileFields[k] = true);
            primaryKey && (acc.primaryKey = k);
            upper && (acc.transformers[k].push({type: '@upper'}));
            lower && (acc.transformers[k].push({type: '@lower'}));
            if (!acc.transformers[k].length) delete acc.transformers[k];
            return acc;
        }, schema);
    }
    parseRefAttributeFields(def: any, schema: any) {
        Object.entries(schema.refAttributeFields).forEach(([k, vList]) => {
            const x = (<any[]>vList).reduce((acc, v) => {
                acc.sourceFields[v.sourceField] = true;
                acc.targetFields[v.targetField] = true;
                acc.values[v.targetField] = {
                    type: '@ref-attribute-field',
                    config: {key: k, prefix: schema.referenceFields[k].reference, sourceField: v.sourceField}
                };
                acc.updateValues[v.targetField] = {
                    type: '@ref-attribute-field',
                    config: {key: k, prefix: schema.referenceFields[k].reference, sourceField: v.sourceField}
                };
                return acc;
            }, {targetFields: [], sourceFields: [], values: [], updateValues: []});
            if (!schema.referenceFields[k]) throw new Error(`${k} is not a reference field (but is a ref attribute requirement for ${Object.keys(x.targetFields).join(', ')})`);
            if (!schema.validators[k]) schema.validators[k] = [];
            schema.referenceFields[k].fetchedFields = ['id'].concat(schema.referenceFields[k].fetchedFields, Object.keys(x.sourceFields));
            schema.validators[k].push(
                this.buildReferenceValidator(
                    schema.referenceFields[k].reference,
                    k,
                    schema.referenceFields[k].idField,
                    schema.referenceFields[k].fetchedFields
                )
            );
            /*
            Object.entries(schema.referenceFields).forEach(([_, v]) => {
                    const referenceKey = ((<any>v).reference).replace(/\./g, '_');
                    if (!c.references) c.references = {};
                    if (c.references[referenceKey]) return;
                    c.references[referenceKey] = (config) => async ({type, value, idField, fetchedFields, contextData}) =>
                        config.operation(`${type}.get`, {params: {[idField]: value, fields: fetchedFields, contextData}})
                    ;
            });
            */
            Object.assign(schema.values, x.values);
            Object.assign(schema.updateValues, x.updateValues);
        });
    }
    parseJob(def: any, schema: any) {
        /*
        const operations = {
            delete: {complete: 'delete', virtualComplete: true},
            create: {},
            update: {},
        };
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
            if ((<any>operationDef).virtualComplete) {
                registerOperation(c, operation, c => async (payload) =>
                    c.operation(`${c.type}.update`, {params: {id: payload.id, input: {...(await mode.pendingInput(payload))}}})
                );
                registerOperation(c, `complete_${operation}`, () => async (payload, options, process) =>
                    process(operation)
                );
            } else {
                c.registerHooks([
                    [`populate_${operation}`, async action => {
                        Object.assign(action.req.payload.data, await mode.pendingInput(action.req.payload));
                    }],
                ]);
            }
        });
         */
    }
    parseFieldString(string, name): any {
        const d = {
            type: string, config: {},
            internal: false, required: false, primaryKey: false, volatile: false,
            reference: <any>undefined, refAttribute: <any>undefined, validators: [],
            index: <any>[],
        };
        if (/!$/.test(d.type)) {
            d.required = true;
            d.type = d.type.substr(0, d.type.length - 1);
        }
        if (/^&/.test(d.type)) {
            d.primaryKey = true;
            d.type = d.type.substr(1);
        }
        if (/^:/.test(d.type)) {
            d.internal = true;
            d.type = d.type.substr(1);
        }
        if (/^#/.test(d.type)) {
            d.volatile = true;
            d.type = d.type.substr(1);
        }
        if (/^@/.test(d.type)) {
            d.type = d.type.substr(1);
            d.index.push({name});
        }
        if (/^ref:/.test(d.type)) {
            d.reference = {
                reference: d.type.substr(4),
                idField: 'id',
                fetchedFields: [],
            };
            d.type = 'string';
        }
        if (/^refattr:/.test(d.type)) {
            const [parentField, sourceField] = d.type.substr(8).split(/:/);
            d.refAttribute = {
                parentField,
                sourceField,
                field: name,
            };
            d.type = 'string';
        }
        return d;
    }
    createField(def: any) {
        let tt = def.type;
        const extra = <any>{};
        if (Array.isArray(tt)) {
            extra.type = tt;
            tt = tt[0].type;
        }
        if ('object' === typeof tt) {
            extra.type = tt;
            tt = 'object';
        }
        return {...this.getFieldType(tt)((def || {}).config || {}), ...extra};
    }
    getFieldType(name: string): Function {
        if (!this.fieldTypes[name]) {
            throw new Error(`Unknown field type '${name}'`);
        }
        return this.fieldTypes[name];
    }
    buildReferenceValidator(type, localField, idField = 'id', fetchedFields: string[] = []) {
        return {type: '@reference', config: {type, localField, idField, fetchedFields}};
    }
}