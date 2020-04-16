import React from 'react';
import {pdfComponent} from '../hocs';
import {View, Text} from '@react-pdf/renderer';

export const UnknownBlock = pdfComponent<UnknownBlockProps>({
    unknown: {
        display: 'flex',
    },
    unknown_text: {
        fontWeight: 'bold',
    },
}, ({s = () => {}, block}: UnknownBlockProps) => (
    <View style={s('unknown')}>
        <Text style={s('unknown_text')}>**UNKNOWN BLOCK {`${(block.type || '')}`}**</Text>
    </View>
));

export interface UnknownBlockProps {
    s?: Function,
    block: any,
}

export default UnknownBlock