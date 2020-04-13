import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.anything];

export const FirstNameFormField: ComponentType<FirstNameFormFieldProps> = (props: FirstNameFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface FirstNameFormFieldProps extends TextFormFieldProps {}

export default FirstNameFormField