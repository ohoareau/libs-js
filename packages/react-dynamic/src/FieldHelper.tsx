import React, {ComponentType} from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';

export const FieldHelper: ComponentType<FieldHelperProps> = ({touched, error}: FieldHelperProps) => !(touched && error) ? null : (
    <FormHelperText>{touched && error}</FormHelperText>
);

export interface FieldHelperProps {
    touched?: boolean,
    error?: any,
}

export default FieldHelper