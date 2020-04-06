import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.fax];

export const FaxFormField: ComponentType<FaxFormFieldProps> = (props: FaxFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface FaxFormFieldProps extends TextFormFieldProps {}

export default FaxFormField