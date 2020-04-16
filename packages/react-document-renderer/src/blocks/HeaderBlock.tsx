import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const HeaderBlock = pdfComponent<HeaderBlockProps>(undefined, ({s = () => {}, block: {header = []}}: HeaderBlockProps) => (
    <View fixed wrap style={s('header')}>
        {header.map((b, i) => <Block key={i} id={b.id} block={b} />)}
    </View>
));

export interface HeaderBlockProps {
    s?: Function,
    block: any,
}

export default HeaderBlock