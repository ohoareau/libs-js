import React, {ComponentType, useCallback, useState} from 'react';
import ComboBoxField from '../fields/ComboBoxField';
import FormField, {FormFieldProps} from '../FormField';

export const SelectorFormField: ComponentType<SelectorFormFieldProps> = ({values, ...props}: SelectorFormFieldProps) => {
    const [{loading, error, data}, setState] = useState({loading: false, error: undefined, data: undefined});
    const loadItems = useCallback(async () => {
        setState({loading, error, data: values});
    }, [setState, loading, error, values]);
    return (
        <FormField component={ComboBoxField} loadItems={loadItems} items={data} loading={loading} error={error} {...props} />
    );
};

export interface SelectorFormFieldProps extends FormFieldProps {
    values?: any,
}

export default SelectorFormField