import React, {ComponentType} from 'react';
import TextField from '../fields/TextField';
import FormField, {FormFieldProps} from '../FormField';

export const TextFormField: ComponentType<TextFormFieldProps> = (props: TextFormFieldProps) => (
    <FormField component={TextField} {...props} />
);

export interface TextFormFieldProps extends FormFieldProps {}

export default TextFormField