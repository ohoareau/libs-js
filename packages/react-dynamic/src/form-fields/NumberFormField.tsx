import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.number];

export const NumberFormField: ComponentType<NumberFormFieldProps> = (props: NumberFormFieldProps) => (
    <TextFormField {...props} type={'number'} validators={validators} />
);

export interface NumberFormFieldProps extends TextFormFieldProps {}

export default NumberFormField