import React, {ComponentType} from 'react';
import * as validator from '@ohoareau/validator';
import TextFormField, {TextFormFieldProps} from './TextFormField';

// static reference for array, to avoid 'Maximum update depth exceeded' error
export const validators = [validator.anything];

export const SiretFormField: ComponentType<SiretFormFieldProps> = (props: SiretFormFieldProps) => (
    <TextFormField {...props} validators={validators} />
);

export interface SiretFormFieldProps extends TextFormFieldProps {}

export default SiretFormField