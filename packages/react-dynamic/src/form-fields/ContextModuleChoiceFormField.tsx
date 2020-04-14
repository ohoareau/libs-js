import React from 'react';
import Alert from '@material-ui/lab/Alert';
import ModuleBox from '../ModuleBox';
import component from '@ohoareau/react-component';
import ItemChoiceField from '../fields/ItemChoiceField';
import FormField, {FormFieldProps} from '../FormField';

export const ContextModuleChoiceFormField = component<ContextModuleChoiceFormFieldProps>({
    alert: {
        borderRadius: 0,
    },
}, ({classes = {}, t = () => {}, tReady = false, context, ...props}: ContextModuleChoiceFormFieldProps) => {
    const items = ((context && context.modules) || []).map(i => ({...i, id: i.module, moduleActivationId: i.id}));
    return !!items.length ? (
        <FormField component={ItemChoiceField}
                   items={items}
                   itemComponent={ModuleBox} {...props} />
    ) : <Alert severity={'error'} className={classes.alert}>{t('field_contextModuleChoice_error_no_modules')}</Alert>;
});

export interface ContextModuleChoiceFormFieldProps extends FormFieldProps {
    classes?: {[key: string]: any},
    t?: Function,
    tReady?: boolean,
    context: any,
}

export default ContextModuleChoiceFormField