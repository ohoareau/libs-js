import {ComponentType} from 'react';
import {StyleSheet} from '@react-pdf/renderer';

export const pdfComponent = <P = any>(styles, c: ComponentType<any>): ComponentType<P> => {
    const classes = StyleSheet.create(styles);
    return props => (c as Function)({...props, classes});
};