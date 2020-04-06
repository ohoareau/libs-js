import React, {ComponentType} from 'react';
import SliderField from '../fields/SliderField';
import * as validator from '@ohoareau/validator';
import FormField, {FormFieldProps} from '../FormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.anything];

export const ThicknessFormField: ComponentType<ThicknessFormFieldProps> = (props: ThicknessFormFieldProps) => (
    <FormField component={SliderField} validators={validators} {...props} />
);

export interface ThicknessFormFieldProps extends FormFieldProps {}

export default ThicknessFormField