import React from 'react';
import Block from '../Block';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

export const ListBlock = pdfComponent<ListBlockProps>({
    list: {
    },
    list_item: {
        flexDirection: 'row',
    },
    list_item_bullet_point: {
    },
    list_item_content: {
        flex: 1,
    },
}, ({s = () => {}, block}: ListBlockProps) => (
    <View style={s('list')}>
        {(block.items || []).map((item, i) => (
            <View key={i} style={s('list_item')}>
                <Text style={s('list_item_bullet_point')}>•</Text>
                <View style={s('list_item_content')}>
                    <Block id={item.id} block={{pseudo: true, ...item}} />
                </View>
            </View>
        ))}
    </View>
));

export interface ListBlockProps {
    s?: Function,
    block: any,
}

export default ListBlock