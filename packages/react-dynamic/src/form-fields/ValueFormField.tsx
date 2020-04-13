import React, {ComponentType} from 'react';
import UnitValueField from '../fields/UnitValueField';
import * as validator from '@ohoareau/validator';
import {getConfigSection} from '@ohoareau/react-moduled';
import FormField, {FormFieldProps} from '../FormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.value];

export const ValueFormField: ComponentType<ValueFormFieldProps> = (props: ValueFormFieldProps) => (
    <FormField component={UnitValueField} validators={validators} units={getConfigSection('units')[props.kind]} {...props} />
);

export interface ValueFormFieldProps extends FormFieldProps {}

export default ValueFormField