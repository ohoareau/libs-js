import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.zipCode];

export const ZipCodeFormField: ComponentType<ZipCodeFormFieldProps> = (props: ZipCodeFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface ZipCodeFormFieldProps extends TextFormFieldProps {}

export default ZipCodeFormField