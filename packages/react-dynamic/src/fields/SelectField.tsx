import React from 'react';
import Select from '@material-ui/core/Select';
import component from '@ohoareau/react-component';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FieldHelper from '../FieldHelper';

export const SelectField = component<SelectFieldProps>(undefined, ({input, label, placeholder, meta: {touched, error}, children, ...props}: SelectFieldProps) => {
    const realInput = {...input};
    if ('' === realInput.value && props.defaultValue) delete realInput.value;
    if (realInput.value) delete props.defaultValue;
    return (
        <FormControl error={!!(touched && error)}>
            <InputLabel htmlFor={input.name}>{label}</InputLabel>
            <Select native placeholder={placeholder} {...realInput} {...props}>
                {children}
            </Select>
            <FieldHelper touched={touched}  error={error} />
        </FormControl>
    );
}, undefined, {i18n: false});

export interface SelectFieldProps {
    input?: any,
    label?: any,
    placeholder?: any,
    meta?: any,
    children?: any,
    defaultValue?: any,
}

export default SelectField