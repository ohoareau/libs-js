import React from 'react';
import {Text} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const HeadingBlock = pdfComponent<HeadingBlockProps>(undefined, ({s = () => {}, v = () => {}, block, children}: HeadingBlockProps) =>
    <Text style={s([[`heading${block.level}`, 'heading']])}>
        {(block.text ? v(block.text) : undefined) || children}
    </Text>
);

export interface HeadingBlockProps {
    s?: Function,
    v?: Function,
    block: any,
    children?: any,
}

export default HeadingBlock