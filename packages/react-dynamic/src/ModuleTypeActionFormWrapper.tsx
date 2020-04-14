import React, {ComponentType} from 'react';
import {ErrorBoundary} from '@ohoareau/react-error-boundary';
import {useModuleTypeForm} from './hooks';
import ModuleTypeActionForm from './ModuleTypeActionForm';

const ModuleTypeActionFormWrapper: ComponentType<ModuleTypeActionFormWrapperProps> = ({form, actionButtons = {}, context = {}, module, type, action, view, mode, width = 600, onSubmit, onCancel, disabled, errors, initialValues = {}, ...props}: ModuleTypeActionFormWrapperProps) => {
    const {contents, defaults, loading, error} = useModuleTypeForm(module, type, view ? `${action}_${view}` : action);
    if (loading) return <div>...</div>;
    if (error) return <div>Error: {error.message}<br/>{error.stack}</div>;
    return (
        <ErrorBoundary metadata={{location: 'form', type, action}}>
            <ModuleTypeActionForm
                form={form}
                module={module} type={type} action={action}
                errors={errors}
                contents={contents}
                context={context}
                submitOnEnter={true} onSubmit={onSubmit} onCancel={onCancel}
                width={(mode === 'fullscreen') ? '100%' : width}
                disabled={disabled}
                initialValues={{...defaults, ...(initialValues || {})}}
                actionButtons={actionButtons}
                {...props}
            />
        </ErrorBoundary>
    );
};

export interface ModuleTypeActionFormWrapperProps {
    form: string,
    actionButtons?: {},
    context?: any,
    module: string,
    type: string|string[],
    action: string,
    view?: string,
    mode?: 'dialog' | 'fullscreen',
    width?: number,
    onSubmit: any,
    onCancel?: any,
    disabled?: boolean,
    errors?: any,
    initialValues?: any,
}

export default ModuleTypeActionFormWrapper