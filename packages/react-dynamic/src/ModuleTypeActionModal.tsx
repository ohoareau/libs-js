import React, {useCallback} from 'react';
import {Modal} from '@ohoareau/react-modal';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import {camelcase} from '@ohoareau/string';
import {useModuleType} from './hooks';
import ModuleTypeActionFormWrapper from './ModuleTypeActionFormWrapper';
import {isValid, submit, isSubmitting} from 'redux-form';

const ModuleTypeActionModal = component<ModuleTypeActionModalProps>(undefined, ({t = () => {}, tReady = false, formName = '', formIsValid, formIsSubmitting, context, dispatch = () => {}, module, type, action, view, mode = 'dialog', open, onClose, onCancel, onSubmit, initialValues}: ModuleTypeActionModalProps) => {
    const onSubmitWrapper = useCallback(() => dispatch(submit(formName)), [dispatch, formName]);
    const {loading, error} = useModuleType(module, type);
    return (loading && !error) ? null : (
        <Modal onSubmit={!error ? onSubmitWrapper : undefined}
               i18nPrefix={`${(!!module && ('root' !== module)) ? `module_${module}_` : ''}modals_${[...type].pop()}_${action}${view ? `_${view}` : ''}`}
               name={`${(!!module && ('root' !== module)) ? `module_${module}_` : ''}${type.join('_')}_${action}${view ? `_${view}` : ''}`}
               open={open} onClose={onClose} onCancel={onCancel}
               mode={mode}
               isSubmittable={formIsValid}
               loading={formIsSubmitting}
        >
            {!error && (
                <ModuleTypeActionFormWrapper onSubmit={onSubmit}
                                             form={formName}
                                             module={module} type={type} action={action} view={view}
                                             context={context}
                                             mode={mode}
                                             {...(initialValues ? {initialValues} : {})}
                />
            )}
            {!!error && <Typography>{t('error_generic', error)}</Typography>}
        </Modal>
    );
}, (state, {action, module, view, type}) => {
    const formName = `${action}${view || ''}${camelcase((!!module && ('root' !== module)) ? `module_${module}` : '', ...type)}`;
    const formIsValid = isValid(formName)(state);
    const formIsSubmitting = isSubmitting(formName)(state);
    return {formName, formIsValid, formIsSubmitting};
});

export interface ModuleTypeActionModalProps {
    t?: Function,
    tReady?: boolean,
    formName?: string,
    formIsValid?: boolean,
    formIsSubmitting?: boolean,
    context: any,
    dispatch?: Function,
    module: string,
    type: any,
    action: string,
    view?: string,
    mode?: 'dialog' | 'fullscreen',
    open?: boolean,
    onClose: any,
    onCancel: any,
    onSubmit: any,
    initialValues?: any,
}

export default ModuleTypeActionModal