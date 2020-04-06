import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

const HeroBlock = pdfComponent({}, ({block}) => (
    <View>
        <Text>{block.title}</Text>
        <Text>{block.subTitle}</Text>
    </View>
));

export default HeroBlock