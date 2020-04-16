import React from 'react';
import QRious from 'qrious';
import ImageBlock from './ImageBlock';
import {pdfComponent} from '../hocs';

const QrCodeBlock = pdfComponent<QrCodeBlockProps>(undefined, ({block, ...props}: QrCodeBlockProps) => (
    <ImageBlock block={{
        ...block,
        url: new QRious({value: block.value, size: block.size}).toDataURL(),
    }} {...props} />
));

export interface QrCodeBlockProps {
    s?: Function,
    block: any,
}

export default QrCodeBlock