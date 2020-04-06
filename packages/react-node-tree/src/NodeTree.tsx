import React, {ComponentType} from 'react';
import Node from './Node';
import TreeView from '@material-ui/lab/TreeView';
import {v4 as uuid} from 'uuid';
import PlusSquareIcon from './icons/PlusSquareIcon';
import CloseSquareIcon from './icons/CloseSquareIcon';
import MinusSquareIcon from './icons/MinusSquareIcon';

const NodeTree: ComponentType<NodeTreeProps> = ({nodes = [], defaultExpanded = []}) => (
    <TreeView
        defaultExpanded={defaultExpanded}
        defaultCollapseIcon={<MinusSquareIcon />}
        defaultExpandIcon={<PlusSquareIcon />}
        defaultEndIcon={<CloseSquareIcon />}
    >
        {nodes.map((n: {nodeId: string, label: string, [key: string]: any}) => {
            n.nodeId = n.nodeId || uuid();
            return <Node key={n.nodeId} {...n} />
        })}
    </TreeView>
);

export interface NodeTreeProps {
    nodes?: {nodeId: string, label: string, [key: string]: any}[],
    defaultExpanded?: string[],
}

export default NodeTree