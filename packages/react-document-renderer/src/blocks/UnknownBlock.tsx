import React from 'react';
import {pdfComponent} from '../hocs';
import {View, Text} from '@react-pdf/renderer';

const UnknownBlock = pdfComponent({
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
}, ({classes = {}, block}) => (
    <View style={classes.root}>
        <Text style={classes.message}>**UNKNOWN BLOCK {`${(block.type || '')}`}**</Text>
    </View>
));

export default UnknownBlock