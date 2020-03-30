import React, {ComponentType} from 'react';
import * as coreBlocks from './blocks';
import * as buildingBlocks from './plugins/building/blocks';

const blocks = {core: coreBlocks, building: buildingBlocks};

const Block: ComponentType<BlockProps> = ({block, ...props}: BlockProps) => {
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
    return <Component block={block} {...props} />;
};

export interface BlockProps {
    block: {
        type: string,
        [key: string]: any,
    },
    [key: string]: any,
}

export default Block