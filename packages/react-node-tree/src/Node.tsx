import React, {ComponentType} from 'react';
import TreeItem from './TreeItem';

const Node: ComponentType<NodeProps> = ({label, items = [], nodeId}: NodeProps) => (
    <TreeItem nodeId={nodeId} label={label}>
        {items.map((item, i) => <Node nodeId={`${nodeId}.${i}`} key={i} {...item} />)}
    </TreeItem>
);

export interface NodeProps {
    label: string,
    items?: any[],
    nodeId: string
}
export default Node