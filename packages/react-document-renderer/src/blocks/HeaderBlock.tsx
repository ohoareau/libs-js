import React from 'react';
import Block from '../Block';
import {View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'center',
    },
});

const HeaderBlock = ({block: {header = []}}) => {
    return (
        <View fixed style={styles.root}>
            {header.map((b, i) => <Block key={i} block={b} />)}
        </View>
    );
};

export default HeaderBlock