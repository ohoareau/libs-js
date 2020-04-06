import React, {ComponentType} from 'react';
import SwitchField from '../fields/SwitchField';
import * as validator from '@ohoareau/validator';
import FormField, {FormFieldProps} from '../FormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.anything];

export const FlagFormField: ComponentType<FlagFormFieldProps> = (props: FlagFormFieldProps) => (
    <FormField component={SwitchField} validators={validators} {...props} />
);

export interface FlagFormFieldProps extends FormFieldProps {}

export default FlagFormField