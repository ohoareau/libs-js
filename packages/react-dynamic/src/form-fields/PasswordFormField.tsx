import React, {ComponentType} from 'react';
import PasswordField from '../fields/PasswordField';
import * as validator from '@ohoareau/validator';
import FormField, {FormFieldProps} from '../FormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.password];

export const PasswordFormField: ComponentType<PasswordFormFieldProps> = (props: PasswordFormFieldProps) => (
    <FormField component={PasswordField} {...props} validators={validators} />
);

export interface PasswordFormFieldProps extends FormFieldProps {}

export default PasswordFormField