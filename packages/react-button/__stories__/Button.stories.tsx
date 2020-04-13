import React from 'react';
import Button from '../src/Button';

export default {
    title: 'Button',
    component: Button,
}

export const submit = () => <Button type={'submit'} />;
export const cancel = () => <Button type={'cancel'} />;
