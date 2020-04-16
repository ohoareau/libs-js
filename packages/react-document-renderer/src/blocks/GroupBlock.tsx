import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const GroupBlock = pdfComponent<GroupBlockProps>(undefined, ({s = () => {}, block: {content = []}}: GroupBlockProps) => (
    <View wrap style={s('group')}>
        {content.map((b, i) => <Block key={i} id={b['id']} block={b} />)}
    </View>
));

export interface GroupBlockProps {
    s?: Function,
    block: any,
}

export default GroupBlock