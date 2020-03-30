import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        border: '1px solid red',
        padding: 15,
        minHeight: 50,
        textAlign: 'center',
    },
    message: {
        color: 'red',
        fontWeight: 'bold',
    },
});

const UnknownLayoutBlock = ({block}) => (
    <View style={styles.root}>
        <Text style={styles.message}>**UNKNOWN LAYOUT {`${(block.layout || '')}`}**</Text>
    </View>
);

export default UnknownLayoutBlock