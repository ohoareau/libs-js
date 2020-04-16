import React from 'react';
import Block from '../../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

export const Row011LayoutBlock = pdfComponent<Row011LayoutBlockProps>(undefined, ({s = () => {}, block}: Row011LayoutBlockProps) => {
    const content = block.content || {};
    return (
        <View style={s('layouts_row011')}>
            <View style={s('layouts_row011_col1')}>
                {!!content.col1 && <Block id={content.col1.id} block={content.col1} />}
            </View>
            <View style={s('layouts_row011_col2')}>
                <View style={s('layouts_row011_col2_line1')}>
                    {!!content.col2_line1 && <Block id={content.col2_line1.id} block={content.col2_line1} />}
                </View>
                <View style={s('layouts_row011_col2_line2')}>
                    {!!content.col2_line2 && <Block id={content.col2_line2.id} block={content.col2_line2} />}
                </View>
            </View>
        </View>
    );
});

export interface Row011LayoutBlockProps {
    s?: Function,
    block: any,
}

export default Row011LayoutBlock