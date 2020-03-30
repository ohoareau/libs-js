import React from 'react';
import {View, Text, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        border: '1px solid red',
        padding: 15,
        minHeight: 50,
        textAlign: 'center',
        backgroundColor: 'red',
        color: 'white',
    },
    message: {
        fontWeight: 'bold',
    },
});

const UnknownBlock = ({block}) => (
    <View style={styles.root}>
        <Text style={styles.message}>**UNKNOWN BLOCK {`${(block.type || '')}`}**</Text>
    </View>
);

export default UnknownBlock