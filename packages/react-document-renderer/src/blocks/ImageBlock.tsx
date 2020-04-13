import React from 'react';
import {Image} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

const ImageBlock = pdfComponent({}, ({block}) => <Image src={block.url} />);

export default ImageBlock