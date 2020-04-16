import React from 'react';
import Block from '../../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

export const Row010LayoutBlock = pdfComponent<Row010LayoutBlockProps>({
    layouts_row010: {
        display: 'flex',
        flexDirection: 'row',
    },
    layouts_row010_left: {
        width: '20%',
        justifyContent: 'flex-start',
    },
    layouts_row010_center: {
        flex: 1,
        justifyContent: 'center',
    },
    layouts_row010_right: {
        width: '20%',
        justifyContent: 'flex-end',
    }
}, ({s = () => {}, block}: Row010LayoutBlockProps) => {
    const content = block.content || {};
    return (
        <View style={s('layouts_row010')}>
            {!!content.left && <View style={s('layouts_row010_left')}><Block id={content.left.id} block={content.left} /></View>}
            {!!content.center && <View style={s('layouts_row010_center')}><Block id={content.center.id} block={content.center || {}} /></View>}
            {!!content.right && <View style={s('layouts_row010_right')}><Block id={content.right.id} block={content.right} /></View>}
        </View>
    );
});

export interface Row010LayoutBlockProps {
    s?: Function,
    block: any,
}

export default Row010LayoutBlock