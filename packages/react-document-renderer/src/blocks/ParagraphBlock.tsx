import React from 'react';
import {Text} from '@react-pdf/renderer';

const ParagraphBlock = ({block}) => {
    return (
        <Text>{block.text || ''}</Text>
    );
};

export default ParagraphBlock