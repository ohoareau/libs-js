import React from 'react';
import {View, Text} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

export const UnknownLayoutBlock = pdfComponent({
    layouts_unknown: {
        display: 'flex',
        border: '1px solid red',
        padding: 15,
        minHeight: 50,
        textAlign: 'center',
    },
    layouts_unknown_message: {
        color: 'red',
        fontWeight: 'bold',
    },
}, ({s = () => {}, block}: UnknownLayoutBlockProps) => (
    <View style={s('layouts_unknown')}>
        <Text style={s('layouts_unknown_message')}>**UNKNOWN LAYOUT {`${(block.layout || '')}`}**</Text>
    </View>
));

export interface UnknownLayoutBlockProps {
    s?: Function,
    block: any,
}

export default UnknownLayoutBlock