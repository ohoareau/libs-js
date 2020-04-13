import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

const HeaderBlock = pdfComponent({
    root: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'center',
    },
}, ({classes = {}, block: {header = []}}) => (
    <View fixed style={classes.root}>
        {header.map((b, i) => <Block key={i} block={b} />)}
    </View>
));

export default HeaderBlock