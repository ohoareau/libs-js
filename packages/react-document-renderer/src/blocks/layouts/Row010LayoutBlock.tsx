import React from 'react';
import Block from '../../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

const Row010LayoutBlock = pdfComponent({
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
    left: {
        width: '20%',
        justifyContent: 'flex-start',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
    },
    right: {
        width: '20%',
        justifyContent: 'flex-end',
    }
}, ({classes = {}, block}) => {
    const content = block.content || {};
    return (
        <View style={classes.root}>
            {!!content.left && <View style={classes.left}><Block block={content.left} /></View>}
            {!!content.center && <View style={classes.center}><Block block={content.center || {}} /></View>}
            {!!content.right && <View style={classes.right}><Block block={content.right} /></View>}
        </View>
    );
});

export default Row010LayoutBlock