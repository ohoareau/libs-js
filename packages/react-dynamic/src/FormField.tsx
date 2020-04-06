import React from 'react';
import {Field} from 'redux-form';
import component from '@ohoareau/react-component';
import * as validator from '@ohoareau/validator';
import {prepareErrors} from './utils';

export const buildI18nFieldKey = ({module = 'root', type = ['fallback'], action = 'fallback', name, prefix, kind, suffix}) =>
    (!!module && 'root' !== module)
        ? [
            `module_${module}:field_${type.join('_')}_${action}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_${module}:field_${type.join('_')}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_${module}:field_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${action}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_core:field_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_${module}:field_${type.join('_')}_${action}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_${module}:field_${type.join('_')}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_${module}:field_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${action}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `module_core:field_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `${name.substr(0, 1).toUpperCase()}${name.substr(1)}`,
        ]
        : [
            `field_${type.join('_')}_${action}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${prefix ? prefix.toLowerCase() : ''}${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${action}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${type.join('_')}_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `field_${name.toLowerCase()}_${kind}${suffix ? '_' : ''}${suffix || ''}`,
            `${name.substr(0, 1).toUpperCase()}${name.substr(1)}`,
        ]
;

export const FormField = component<FormFieldProps>(undefined, ({t = () => {}, tReady = false, context, i18n, name, prefix, required, component, validators, children: forcedChildren = null, extraProps = {}, extraPropsAwareProps = {}, ...props}: FormFieldProps) => {
    const validate = required ? [validator.required, ...(validators || [])] : validators;
    forcedChildren = forcedChildren ? (('function' === typeof forcedChildren) ? ((forcedChildren as unknown) as Function)(props) : forcedChildren) : null;
    const allProps = Object.entries(extraPropsAwareProps).reduce((acc, [k, v]) => {
        const r = ((v as unknown) as Function)(acc);
        if (undefined !== r) acc[k] = r;
        return acc;
    }, {
        name,
        component,
        label: t(buildI18nFieldKey({...context, name, prefix, kind: 'label'})),
        placeholder: t(buildI18nFieldKey({...context, name, prefix, kind: 'placeholder'})),
        validate,
        ...extraProps,
        ...props,
        errors: prepareErrors(props['errors'], name),
    });
    return (
        <Field disabled={allProps['submitting']} {...allProps}>{forcedChildren}</Field>
    );
});

export interface FormFieldProps {
    t?: Function,
    tReady?: boolean,
    context?: any,
    i18n?: any,
    name?: string,
    prefix?: string,
    required?: boolean,
    component?: any,
    validators?: any,
    children?: any,
    extraProps?: any,
    extraPropsAwareProps?: any,
    type?: string,
    [key: string]: any,
}

export default FormField