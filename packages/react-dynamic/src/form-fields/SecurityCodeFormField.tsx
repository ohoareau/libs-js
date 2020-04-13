import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.securityCode];

export const SecurityCodeFormField: ComponentType<SecurityCodeFormFieldProps> = (props: SecurityCodeFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface SecurityCodeFormFieldProps extends TextFormFieldProps {}

export default SecurityCodeFormField