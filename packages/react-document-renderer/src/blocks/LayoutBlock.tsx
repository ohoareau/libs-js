import React from 'react';
import * as layouts from './layouts';

const LayoutBlock = ({block, ...props}) => {
    const Component = layouts[block.layout] || layouts['unknown'];
    return <Component block={block} {...props} />;
};

export default LayoutBlock