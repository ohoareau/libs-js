import React from 'react';
import Block from '../Block';
import {View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        fontSize: 12,
        bottom: 25,
        left: 35,
        right: 0,
        textAlign: 'center',
    },
});

const FooterBlock = ({block: {footer = []}}) => {
    return (
        <View fixed style={styles.root}>
            {footer.map((b, i) => <Block key={i} block={b} />)}
        </View>
    );
};

export default FooterBlock