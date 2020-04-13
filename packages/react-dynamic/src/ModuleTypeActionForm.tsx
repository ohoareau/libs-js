import React, {ComponentType, useCallback} from 'react';
import {Button} from '@ohoareau/react-button';
import {reduxForm} from 'redux-form';
import Form, {FormProps} from './Form';
import ModuleTypeActionFormContents from './ModuleTypeActionFormContents';

const ModuleTypeActionForm: ComponentType<ModuleTypeActionFormProps> = reduxForm({enableReinitialize: true})(({module, type, action, context, actionButtons = {}, disabled, submitting, errors, contents, handleSubmit, onCancel, submitOnEnter = false, ...props}: ModuleTypeActionFormProps) => {
    const onKeyPress = useCallback(event => event.key === 'Enter' && handleSubmit(), [handleSubmit]);
    return (
        <Form disabled={disabled} onSubmit={handleSubmit} onKeyPress={submitOnEnter ? onKeyPress : undefined} errors={errors} {...props}>
            <ModuleTypeActionFormContents
                form={props.form}
                module={module} type={type} action={action}
                context={context}
                contents={contents}
                first={true}
                disabled={disabled}
                submitting={submitting} errors={errors}
            />
            {actionButtons && (
                <>
                {!!actionButtons['submit'] && <Button disabled={disabled || props.invalid} label={actionButtons['submit']} onClick={handleSubmit} style={{marginRight: 15}}/>}
                {!!actionButtons['cancel'] && onCancel && <Button disabled={disabled || props.invalid} variant={'text'} label={actionButtons['cancel']} onClick={onCancel }/>}
                </>
            )}
        </Form>
    );
});

export interface ModuleTypeActionFormProps extends FormProps {
    module: string,
    type: any,
    action: string,
    context: any,
    actionButtons?: any,
    disabled?: boolean,
    submitting?: boolean,
    errors?: any,
    contents?: any,
    onSubmit: any,
    handleSubmit?: any,
    onCancel?: any,
    submitOnEnter?: boolean,
    form: string,
    invalid?: boolean,
    initialValues?: {[key: string]: any},
}

export default ModuleTypeActionForm