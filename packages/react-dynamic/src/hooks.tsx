import React, {memo, Suspense, useCallback, useState} from 'react';
import cache from '@ohoareau/cache';
import {connect} from 'react-redux';
import {arrayize} from '@ohoareau/array';
import {formValueSelector} from 'redux-form';
import describeContentContainer from '@ohoareau/contents';
import {getModule, getDefinition, getTypedComponent} from '@ohoareau/react-moduled';

const withFormRequires = (form, requires) => Component => {
    const n = requires.length;
    if (!n) return Component;
    const selector = formValueSelector(form);
    return connect(state => n > 1 ? selector(state, ...requires) : {[requires[0]]: selector(state, requires[0])})(Component);
};

export const useModuleType = (module, type) => {
    const [models, setModels] = useState({});
    const [error, setError] = useState(undefined);
    const key = `${module || ''}${type.join('_')}`;
    const callback = useCallback(m => {
        getDefinition('1.0', 'root').then(baseModule => {
            const fallbackModel = ((baseModule || {}).models || {}).fallback || {}
            setModels({
                ...models,
                [key]: {
                    ...fallbackModel,
                    ...m,
                    attributes: {...(fallbackModel.attributes || {}), ...(m.attributes || {})},
                    forms: {...(fallbackModel.forms || {}), ...(m.forms || {})},
                    panels: {...(fallbackModel.panels || {}), ...(m.panels || {})},
                },
            });
        })
    }, [key, models, setModels]);
    if (!error && !models[key]) {
        (async (module, type) => type.reduce((acc, t) => (acc.models || {})[t] || {models: {}}, await getModule(module)))(module, type).then(callback).catch(e => {
            setError(e);
        });
        return {model: {}, loading: true, error};
    }
    return {model: models[key] || {}, loading: false, error};
};

export const useModuleTypeTable = (module, type, name) => {
    type = Array.isArray(type) ? type : [type];
    const {model, loading} = useModuleType(module, type);
    if (loading) return {table: undefined, loading: true};
    return {table: ((model || {})['tables'] || {})[name] || {}, loading: false};
};

export const useModuleTypePanel = (module, type, name) => {
    type = Array.isArray(type) ? type : [type];
    const key = `${module}/${type.join('-')}/${name}`;
    const {model, loading} = useModuleType(module, type);
    if (loading) return {contents: [], loading};
    const cached = cache.get('panels', key);
    if (cached) return cached;
    const described = describeContentContainer(model, model.panels[name] || {});
    return cache.set('panels', key, {...described, loading: false});
};
const normalizeTypedComponentParams = (def, type, path) => ({
    def: {...def, type: (def.type as string || '').indexOf(':') >= 0 ? def.type : `base:${def.type}`},
    type,
    path,
});

export const useModuleFormGenericContent = (form, definition, context) => {
    const type = Array.isArray(context.type) ? context.type : [context.type];
    const {module, action} = context;
    const key = `${module}-${type.join('-')}-forms-${action}-generics-${definition.type}`;
    const Component = cache.get('components', key) || cache.set('components', key, getTypedComponent(normalizeTypedComponentParams(definition, 'Content', 'contents')));
    return [
        memo(withFormRequires(form, arrayize(definition.requires))(memo(props => {
            return (
                <Suspense fallback={<div/>}>
                    <Component {...definition} {...props} context={{...context, type}} />
                </Suspense>
            );
        }))),
    ];
};

export const useModulePanelGenericContent = (panel, definition, context) => {
    const type = Array.isArray(context.type) ? context.type : [context.type];
    const {module, action} = context;
    const key = `${module}-${type.join('-')}-panels-${action}-generics-${definition.type}`;
    const Component = cache.get('components', key) || cache.set('components', key, getTypedComponent(normalizeTypedComponentParams(definition, 'Content', 'contents')));
    return [
        memo(props => (
            <Suspense fallback={<div/>}>
                <Component {...definition} {...props} context={{...context, type}} />
            </Suspense>
        )),
    ];
};

export const useModuleTypeForm = (module, type: string|string[], name) => {
    type = Array.isArray(type) ? type : [type];
    const key = `${module}/${type.join('-')}/${name}`;
    const {model, loading, error} = useModuleType(module, type);
    if (loading) return {contents: [], defaults: {}, loading};
    if (error) return {contents: [], defaults: {}, loading, error};
    const cached = cache.get('forms', key);
    if (cached) return cached;
    const description: any = describeContentContainer(model, (model.forms || {})[name] || {});
    description.defaults = description.defaults || {};
    if (model.defaultValues) {
        Object.assign(description.defaults, model.defaultValues['*'] || {});
    }
    return cache.set('forms', key, {...description, loading: false});
};

export const useModuleFormField = (form, field, context) => {
    const type = Array.isArray(context.type) ? context.type : [context.type];
    const {module, action} = context;
    field = {requires: [], name: 'unknown', type: 'text', autoFocus: false, ...field};
    const key = `${module}-${type.join('-')}-${action}-fields-${field.name}`;
    const Component = cache.get('components', key) || cache.set('components', key, getTypedComponent(normalizeTypedComponentParams(field, 'FormField', 'form-fields')));
    return [
        memo(withFormRequires(form, field.requires)(memo(props => {
            return (
                <Suspense fallback={<div/>}>
                    <Component {...field} {...props}
                               context={{...context, type}}
                               autoFocus={props['autoFocus'] !== undefined ? props['autoFocus'] : field.autoFocus}
                               required={props['required'] !== undefined ? props['required'] : field.required}
                    />
                </Suspense>
            );
        }))),
        field
    ];
};