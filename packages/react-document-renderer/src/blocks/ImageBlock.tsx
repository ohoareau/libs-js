import React from 'react';
import {Image} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const ImageBlock = pdfComponent<ImageBlockProps>(undefined, ({block}: ImageBlockProps) => (
    <Image src={block.url} cache={false} />
));

export interface ImageBlockProps {
    s?: Function,
    block: any,
}

export default ImageBlock