import React, {ComponentType} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {useModuleTypeForm} from './hooks';
import ModuleTypeActionFormContents from './ModuleTypeActionFormContents';

const ModuleTypeActionFormFieldDynamicContents: ComponentType<ModuleTypeActionFormFieldDynamicContentsProps> = connect((state, {form, linkedTo}) => ({value: formValueSelector(form)(state, linkedTo)}))(
    ({first, disabled, submitting, errors, form, context, module, type, action, linkedTo, value}: ModuleTypeActionFormFieldDynamicContentsProps) => {
        if (!value) return <></>;
        const subAction = `${action}_${linkedTo}_${'object' === typeof value ? value.id : value}`;
        const {contents, loading} = useModuleTypeForm(module, type, subAction);
        if (loading) return <div>...</div>;
        return (
            <ModuleTypeActionFormContents
                form={form}
                module={module} type={type} action={subAction}
                context={context}
                contents={contents}
                first={first}
                disabled={disabled}
                submitting={submitting} errors={errors}
            />
        )
    }
);

export interface ModuleTypeActionFormFieldDynamicContentsProps {
    first?: boolean,
    disabled?: boolean,
    submitting?: boolean,
    errors: any,
    form: string,
    context: any,
    module?: string,
    type: any,
    action?: string,
    linkedTo: string,
    value?: any,
}

export default ModuleTypeActionFormFieldDynamicContents