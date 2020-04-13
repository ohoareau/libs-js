import React from 'react';
import {View, Text} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

const UnknownLayoutBlock = pdfComponent({
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
}, ({classes = {}, block}) => (
    <View style={classes.root}>
        <Text style={classes.message}>**UNKNOWN LAYOUT {`${(block.layout || '')}`}**</Text>
    </View>
));

export default UnknownLayoutBlock