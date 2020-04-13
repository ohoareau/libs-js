import React, {ComponentType} from 'react';
import Box from '@material-ui/core/Box';
import FormErrors from './FormErrors';

export const Form: ComponentType<FormProps> = ({disabled, width = 450, onSubmit, children, errors, onKeyPress}: FormProps) => (
    <Box maxWidth={width} onKeyPress={onKeyPress}>
        <FormErrors errors={errors} />
        <form onSubmit={onSubmit} aria-disabled={disabled}>
            {children}
        </form>
    </Box>
);

export interface FormProps {
    disabled?: boolean,
    width?: number|string,
    onSubmit: any,
    children?: any,
    errors?: any,
    onKeyPress?: any,
}

export default Form