import React from 'react';
import {Text, View} from '@react-pdf/renderer';

const HeroBlock = ({block}) => {
    return (
        <View>
            <Text>{block.title}</Text>
            <Text>{block.subTitle}</Text>
        </View>
    );
};

export default HeroBlock