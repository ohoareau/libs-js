import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const ContentBlock = pdfComponent<ContentBlockProps>(undefined, ({s = () => {}, block: {content = []}}: ContentBlockProps) => (
    <View wrap style={s('content')}>
        {content.map((b, i) => <Block key={i} id={b['id']} block={b} />)}
    </View>
));

export interface ContentBlockProps {
    s?: Function,
    block: any,
}

export default ContentBlock