import React, {useCallback} from 'react';
import Switch from '@material-ui/core/Switch';
import component from '@ohoareau/react-component';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export const SwitchField = component<SwitchFieldProps>(undefined, ({/*errors, */placeholder, label, default: defaultValue, input: {onChange, ...input}/*, meta: {touched, error}*/}: SwitchFieldProps) => {
    const value = (undefined !== input.value) ? (input.value === 'yes') : (defaultValue === 'yes');
    const toggleChecked = useCallback(() => onChange(value ? 'no' : 'yes') /* toggle */, [onChange, value]);
    return (
        <FormControlLabel
            control={<Switch checked={value} onChange={toggleChecked} value={input.name} name={input.name} />}
            label={label}
            placeholder={placeholder || label}
// to remove ?            error={((touched && ('string' === typeof error) && error) || ((!!errors && errors.length) ? errors.map(x => x.message).join('; ') : undefined))}
        />
    );
});

export interface SwitchFieldProps {
    errors?: any,
    placeholder?: any,
    label?: any,
    default?: any,
    input?: any,
    meta?: any,
}

export default SwitchField