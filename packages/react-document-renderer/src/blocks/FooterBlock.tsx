import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const FooterBlock = pdfComponent<FooterBlockProps>(undefined, ({s = () => {}, block: {footer = []}}: FooterBlockProps) => (
    <View fixed wrap style={s('footer')}>
        {footer.map((b, i) => <Block key={i} id={b['id']} block={b} />)}
    </View>
));

export interface FooterBlockProps {
    s?: Function,
    block: any,
}

export default FooterBlock