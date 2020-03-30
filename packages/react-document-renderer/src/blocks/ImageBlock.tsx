import React from 'react';
import {Image} from '@react-pdf/renderer';

const ImageBlock = ({block}) => {
    return (
        <Image src={block.url} />
    );
};

export default ImageBlock