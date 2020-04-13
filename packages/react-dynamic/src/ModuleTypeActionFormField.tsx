import React, {ComponentType, memo} from 'react';
import {FormSection} from 'redux-form';
import {useModuleFormField} from './hooks';
import ModuleTypeActionFormFieldDynamicContents from './ModuleTypeActionFormFieldDynamicContents';

const ModuleTypeActionFormField: ComponentType<ModuleTypeActionFormFieldProps> = memo(({first, form, context = {}, module, type, action, definition = {}, disabled, submitting, errors}: ModuleTypeActionFormFieldProps) => {
    if (/^dyn>/.test(definition.name)) {
        const linkedTo = definition.name.substr(4);
        const content = <ModuleTypeActionFormFieldDynamicContents module={module} type={type} action={action} context={context} first={first} linkedTo={linkedTo} form={form} disabled={disabled} submitting={submitting} errors={errors} />;
        return definition.section ? (
            <FormSection name={definition.section}>
                {content}
            </FormSection>
        ) : content;
    }
    const [FormField, field] = useModuleFormField(form, definition, {module, type, action, ...context});
    return (
        <FormField autoFocus={0 === definition.typepos} disabled={disabled} submitting={submitting} errors={errors} name={field.name} />
    );
});

export interface ModuleTypeActionFormFieldProps {
    first?: boolean,
    disabled?: boolean,
    submitting?: boolean,
    errors: any,
    form: string,
    module?: string,
    type: any,
    action?: string,
    definition?: any,
    value?: any,
    context?: any,
}

export default ModuleTypeActionFormField