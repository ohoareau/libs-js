import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.count];

export const CountFormField: ComponentType<CountFormFieldProps> = (props: CountFormFieldProps) => (
    <TextFormField {...props} type={'number'} validators={validators} />
);

export interface CountFormFieldProps extends TextFormFieldProps {}

export default CountFormField