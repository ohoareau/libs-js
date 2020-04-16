import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from './hocs';
import * as coreBlocks from './blocks';
import {ContextProvider} from './contexts/ContextContext';
import * as buildingBlocks from './plugins/building/blocks';

const blocks = {core: coreBlocks, building: buildingBlocks};

const SelectionWrapper = pdfComponent({
    selection_wrapper: {
        backgroundColor: '#3f51b5',
        color: 'white',
    },
}, ({s = () => {}, children}) => (
    <View style={s('selection_wrapper')}>
        {children}
    </View>
));

const renderBlock = (key, block, Component, props, cfg, context, test, suggestions) => {
    if (block.hiddable && !cfg.visible) return null;
    if (block.condition && !test(block.condition)) return null;
    let c = <Component key={key} block={block} {...props} />;
    if (block.enrichable && cfg.enrichment) c = (
        <>
            {c}
            {cfg.enrichment.map((en, i) => <Block key={i} id={`${block.id}_enrichment_${i}`} block={{type: en.type, text: en.children.map(x => x.text).join("\n")}} />)}
        </>
    );
    if (block.suggestions && cfg.suggestions) c = (
        <>
            {c}
            {Object.entries(cfg.suggestions).map(([k, v], i) => suggestions[k] ? <Block key={i} id={`${block.id}_suggestion_${k}`} block={suggestions[k]} /> : null)}
        </>
    );
    context && (c = <ContextProvider key={key} value={context || {}}>{c}</ContextProvider>);
    if (cfg.selected) c = <SelectionWrapper key={key}>{c}</SelectionWrapper>;
    if (block.pagebreak) c = <Text key={key} wrap break>{c}</Text>;
    return c;
}

const Block = pdfComponent<BlockProps>(undefined, ({id, block, cfg = {}, v = () => {}, suggestions = {}, test = () => {}, model, ...props}: BlockProps) => {
    const tokens = (block.type || '').split(':');
    let items, key;
    switch (tokens.length) {
        case 0: items = blocks.core; key = 'unknown'; break;
        case 1: items = blocks.core; key = block.type; break;
        default: items = ('@' === tokens[0].charAt(0))
                ? require(`./plugins/${tokens[0].slice(1)}/blocks`)
                : require(`${tokens[0]}/blocks`)
            ; key = tokens[1]; break;
    }
    const Component = (items || {})[key] || blocks.core.unknown;
    if (block.foreach) {
        return (
            <>
                {((v(block.foreach) || []) as any[]).map((context, i) => renderBlock(i, block, Component, props, cfg, context, test, suggestions))}
            </>
        );
    }
    return renderBlock(undefined, block, Component, props, cfg, undefined, test, suggestions);
});

export interface BlockProps {
    id: string,
    cfg?: any,
    v?: Function,
    test?: Function,
    model?: any,
    suggestions?: any,
    block: {
        type: string,
        [key: string]: any,
    },
}

export default Block