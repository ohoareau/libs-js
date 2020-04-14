import React, {useCallback, useState} from 'react';
import Input from '@material-ui/core/Input';
import component from '@ohoareau/react-component';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';

export const PasswordField = component<PasswordFieldProps>(undefined, ({errors, placeholder, label, input, meta: {touched, invalid, error}, ...props}: PasswordFieldProps) => {
    const [values, setValues] = useState({showPassword: false});
    const handleClickShowPassword = useCallback(() => {
        setValues({ ...values, showPassword: !values.showPassword });
    }, [setValues, values]);
    const handleMouseDownPassword = useCallback(event => {
        event.preventDefault();
    }, []);
    const helperText = ((touched && error) || ((!!errors && errors.length) ? errors.map(x => x.message).join('; ') : undefined));
    const inError = (touched && invalid) || (!!errors && !!errors.length);
    return (
        <FormControl fullWidth={true}>
            <InputLabel>{label}</InputLabel>
            <Input
                fullWidth={true}
                type={values.showPassword ? 'text' : 'password'}
                placeholder={placeholder || label}
                error={inError}
                {...input}
                {...props}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {helperText && <FormHelperText error={inError}>{helperText}</FormHelperText>}
        </FormControl>
    );
}, undefined, {i18n: false});

export interface PasswordFieldProps {
    errors?: any,
    placeholder?: any,
    label?: any,
    input?: any,
    meta?: any,
}

export default PasswordField