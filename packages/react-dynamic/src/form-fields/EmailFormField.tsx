import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.email];

export const EmailFormField: ComponentType<EmailFormFieldProps> = (props: EmailFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface EmailFormFieldProps extends TextFormFieldProps {}

export default EmailFormField