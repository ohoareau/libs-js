import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.url];

export const UrlFormField: ComponentType<UrlFormFieldProps> = (props: UrlFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface UrlFormFieldProps extends TextFormFieldProps {}

export default UrlFormField