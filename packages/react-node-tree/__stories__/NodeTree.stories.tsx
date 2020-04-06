import React from 'react';
import NodeTree from '../src/NodeTree';

export default {
    title: 'NodeTree',
    component: NodeTree,
}

export const basic = () => <NodeTree nodes={[
    {nodeId: 'a', label: 'Item One', items: [
        {nodeId: 'x', label: 'Item X'},
        {nodeId: 'y', label: 'Item Y'},
        {nodeId: 'z', label: 'Item Z', items: [
                {nodeId: 'r', label: 'Item R'},
                {nodeId: 's', label: 'Item S'},
        ]},
    ]},
    {nodeId: 'b', label: 'Item Two'},
    {nodeId: 'c', label: 'Item Three'},
    {nodeId: 'd', label: 'Item Four'},
]} />;