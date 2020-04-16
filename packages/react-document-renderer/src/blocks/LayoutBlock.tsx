import React, {ComponentType} from 'react';
import * as layouts from './layouts';

const LayoutBlock: ComponentType<LayoutBlockProps> = ({block, ...props}: LayoutBlockProps) => {
    const Component = layouts[block.layout] || layouts['unknown'];
    return <Component block={block} {...props} />;
};

export interface LayoutBlockProps {
    s?: Function,
    block: any,
}

export default LayoutBlock