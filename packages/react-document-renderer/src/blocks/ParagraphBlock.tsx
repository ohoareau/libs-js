import React, {Fragment} from 'react';
import {Link, Text} from '@react-pdf/renderer';
import HeadingBlock from './HeadingBlock';
import {pdfComponent} from '../hocs';

const unified = require('unified');
const markdown = require('remark-parse');

const convertTokens = (tokens: any[], opts: any = {}) => {
    const s = opts.s;
    const v = opts.v;
    return tokens.map((t, i) => {
        switch (t.type) {
            case 'heading': return (
                <HeadingBlock key={i} block={{level: t.depth}}>
                    {convertTokens(t.children || [], {...opts, first: false})}
                </HeadingBlock>
            );
            case 'paragraph': return (
                <Text key={i} style={s(['paragraph', opts.first && 'paragraph_first'])}>
                    {convertTokens(t.children || [], {...opts, first: false})}
                </Text>
            );
            case 'text': return opts.dynamic
                ? <Text key={i} style={s('paragraph_text')} render={vars => {
                    return v(t.value, vars)
                }} />
                : (
                    <Text key={i} style={s('paragraph_text')}>
                        {v(t.value)}
                    </Text>
                )
            ;
            case 'link': return (
                <Link key={i} src={t.url} style={s('paragraph_link')}>
                    {!!t.children.length ? convertTokens(t.children, {...opts, first: false}) : t.url}
                </Link>
            );
            case 'emphasis': return (
                <Text key={i} style={s('paragraph_emphasis')}>
                    {convertTokens(t.children || [], {...opts, first: false})}
                </Text>
            );
            case 'strong': return (
                <Text key={i} style={s('paragraph_strong')}>
                    {convertTokens(t.children || [], {...opts, first: false})}
                </Text>
            );
            case 'delete': return (
                <Text key={i} style={s('paragraph_underlined')}>
                    {convertTokens(t.children || [], {...opts, first: false})}
                </Text>
            );
            case 'inlineCode': return (
                <Text key={i} style={s('paragraph_inline_code')}>
                    {v(t.value)}
                </Text>
            );
            default: return <Fragment key={i}/>;
        }
    })
};

export const ParagraphBlock = pdfComponent<ParagraphBlockProps>(undefined, ({dynamic = false, s = () => {}, v = () => {}, block}: ParagraphBlockProps) => (
    <>
        {convertTokens(
            unified().use(markdown).parse(block.text || '').children,
            {first: !block.pseudo, dynamic, s, v}
        )}
    </>
));

export interface ParagraphBlockProps {
    s?: Function,
    v?: Function,
    dynamic?: boolean,
    block: any,
}

export default ParagraphBlock