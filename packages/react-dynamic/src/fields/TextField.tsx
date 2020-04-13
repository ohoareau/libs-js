import React from 'react';
import component from '@ohoareau/react-component';
import MuiTextField, {TextFieldProps as MuiTextFieldProps} from '@material-ui/core/TextField';

const TextField = component<TextFieldProps>(undefined, ({errors, placeholder, label, input, meta: {touched, invalid, error}, ...props}: TextFieldProps) => (
    <MuiTextField
        fullWidth={true}
        label={label}
        placeholder={placeholder || label}
        error={(touched && invalid) || (!!errors && !!errors.length)}
        helperText={((touched && error) || ((!!errors && errors.length) ? errors.map(x => x.message).join('; ') : undefined))}
        {...input}
        {...props}
    />
));

export type TextFieldProps = MuiTextFieldProps & {
    errors?: any,
    placeholder?: any,
    label?: any,
    input?: any,
    meta?: any,
}

export default TextField