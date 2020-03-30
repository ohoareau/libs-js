import React, {ComponentType} from 'react';
import Block from './Block';
import {Page} from '@react-pdf/renderer';

const Fragment: ComponentType<FragmentProps> = ({fragment, defaultFormat = 'A4'}: FragmentProps) => (
    <Page size={fragment.format || defaultFormat} style={fragment.style || {}}>
        {!!fragment.header && <Block block={{type: 'header', header: fragment.header}} />}
        {!!fragment.content && <Block block={{type: 'content', content: fragment.content}} />}
        {!!fragment.footer && <Block block={{type: 'footer', footer: fragment.footer}} />}
    </Page>
);

export interface FragmentProps {
    fragment: {
        format?: string,
        style?: {[key: string]: any},
        header?: any,
        content?: any,
        footer?: any,
    },
    defaultFormat?: string,
}

export default Fragment