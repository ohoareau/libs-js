import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const HeroBlock = pdfComponent<HeroBlockProps>(undefined, ({block, v = () => {}}: HeroBlockProps) => (
    <View>
        <Text>{v(block.title)}</Text>
        <Text>{v(block.subTitle)}</Text>
    </View>
));

export interface HeroBlockProps {
    s?: Function,
    v?: Function,
    block: any,
}

export default HeroBlock