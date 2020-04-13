import React, {memo, Suspense, useCallback, useState} from 'react';
import cache from '@ohoareau/cache';
import {connect} from 'react-redux';
import {arrayize} from '@ohoareau/array';
import {formValueSelector} from 'redux-form';
import describeContentContainer from '@ohoareau/contents';
import {getModule, getModuleVersionDefinition, getTypedModuleComponent} from '@ohoareau/react-moduled';

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
        getModuleVersionDefinition('root', '1.0').then(baseModule => {
            setModels({
                ...models,
                [key]: {
                    ...baseModule.models.fallback,
                    ...m,
                    attributes: {...(baseModule.models.fallback.attributes || {}), ...(m.attributes || {})},
                    forms: {...(baseModule.models.fallback.forms || {}), ...(m.forms || {})},
                    panels: {...(baseModule.models.fallback.panels || {}), ...(m.panels || {})},
                },
            });
        })
    }, [key, models, setModels]);
    if (!error && !models[key]) {
        (async (module, type) => type.reduce((acc, t) => acc.models[t] || {models: {}}, await getModule(module)))(module, type).then(callback).catch(e => {
            setError(e);
        });
        return {model: {}, loading: true, error};
    }
    return {model: models[key], loading: false, error};
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

export const useModuleTypeTable = (module, type, name) => {
    const {model, loading} = useModuleType(module, type);
    if (loading) return {table: undefined, loading: true};
    return {table: ((model || {})['tables'] || {})[name] || {}, loading: false};
};

export const useModuleFormGenericContent = (form, definition, context) => {
    const {module, type, action} = context;
    const key = `${module}-${type}-forms-${action}-generics-${definition.type}`;
    const Component = cache.get('components', key) || cache.set('components', key, getTypedModuleComponent({def: definition, type: 'Content', path: 'contents'}));
    return [
        memo(withFormRequires(form, arrayize(definition.requires))(memo(props => {
            return (
                <Suspense fallback={<div/>}>
                    <Component {...definition} {...props} context={context} />
                </Suspense>
            );
        }))),
    ];
};

export const useModuleTypeForm = (module, type, name) => {
    const key = `${module}/${type.join('-')}/${name}`;
    const {model, loading} = useModuleType(module, type);
    if (loading) return {contents: [], defaults: {}, loading};
    const cached = cache.get('forms', key);
    if (cached) return cached;
    return cache.set('forms', key, {...describeContentContainer(model, model.forms[name] || {}), loading: false});
};

export const useModuleFormField = (form, field, context) => {
    const {module, type, action} = context;
    field = {requires: [], name: 'unknown', type: 'text', autoFocus: false, ...field};
    const key = `${module}-${type}-${action}-fields-${field.name}`;
    const Component = cache.get('components', key) || cache.set('components', key, getTypedModuleComponent({def: field, type: 'FormField', path: 'form-fields'}));
    return [
        memo(withFormRequires(form, field.requires)(memo(props => {
            return (
                <Suspense fallback={<div/>}>
                    <Component {...field} {...props}
                               context={context}
                               autoFocus={props['autoFocus'] !== undefined ? props['autoFocus'] : field.autoFocus}
                               required={props['required'] !== undefined ? props['required'] : field.required}
                    />
                </Suspense>
            );
        }))),
        field
    ];
};