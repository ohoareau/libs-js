import React from 'react';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const SpaceBlock = pdfComponent<SpaceBlockProps>(undefined, ({s = () => {}}: SpaceBlockProps) => (
    <View style={s('space')} />
));

export interface SpaceBlockProps {
    s?: Function,
}

export default SpaceBlock