import React from 'react';
import Block from '../Block';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../hocs';

const FooterBlock = pdfComponent({
    root: {
        position: 'absolute',
        fontSize: 12,
        bottom: 25,
        left: 35,
        right: 0,
        textAlign: 'center',
    },
}, ({classes = {}, block: {footer = []}}) => (
    <View fixed style={classes.root}>
        {footer.map((b, i) => <Block key={i} block={b} />)}
    </View>
));

export default FooterBlock