import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.phone];

export const PhoneFormField: ComponentType<PhoneFormFieldProps> = (props: PhoneFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface PhoneFormFieldProps extends TextFormFieldProps {}

export default PhoneFormField