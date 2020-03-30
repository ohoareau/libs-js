import React from 'react';
import Block from '../../Block';
import {View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
});

const Row010LayoutBlock = ({block}) => {
    const content = block.content || {};
    return (
        <View style={styles.root}>
            {!!content.left && <View style={styles.left}><Block block={content.left} /></View>}
            {!!content.center && <View style={styles.center}><Block block={content.center || {}} /></View>}
            {!!content.right && <View style={styles.right}><Block block={content.right} /></View>}
        </View>
    );
};

export default Row010LayoutBlock