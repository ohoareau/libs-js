import React from 'react';
import Block from './Block';
import {Page} from '@react-pdf/renderer';
import {pdfComponent} from './hocs';

const Fragment = pdfComponent<FragmentProps>(undefined, ({fragment, defaultFormat = 'A4', s = () => {}}: FragmentProps) => (
    <Page size={fragment.format || defaultFormat} style={s('page', fragment.style)}>
        {!!fragment.header && <Block id={`${fragment.id}_header`} block={{type: 'header', header: fragment.header}} />}
        {!!fragment.content && <Block id={`${fragment.id}_content`} block={{type: 'content', content: fragment.content}} />}
        {!!fragment.footer && <Block id={`${fragment.id}_footer`} block={{type: 'footer', footer: fragment.footer}} />}
    </Page>
));

export interface FragmentProps {
    s?: Function,
    fragment: {
        id: string,
        format?: string,
        style?: {[key: string]: any},
        header?: any,
        content?: any,
        footer?: any,
    },
    defaultFormat?: string,
    stylesheet?: any,
    data?: any,
}

export default Fragment