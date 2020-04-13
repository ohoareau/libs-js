import React from 'react';
import {Text} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

const ParagraphBlock = pdfComponent({}, ({block}) => <Text>{block.text || ''}</Text>);

export default ParagraphBlock