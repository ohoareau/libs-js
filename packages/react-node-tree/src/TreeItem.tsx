import React from 'react';
import {fade} from '@material-ui/core/styles';
import component from '@ohoareau/react-component';
import MuiTreeItem from '@material-ui/lab/TreeItem';

const TreeItem = component<TreeItemProps>(theme => ({
    root: {
        '&:focus > $content': {
            backgroundColor: (props: TreeItemProps) => props.locked ? (theme.palette['locked'] || theme.palette.secondary).main : (props.selected ? theme.palette.primary.dark : 'unset'),
            color: (props: TreeItemProps) => props.locked ? 'white' : (props.selected ? 'white' : 'inherit'),
        },
    },
    content: {
        backgroundColor: (props: TreeItemProps) => props.locked ? (theme.palette['locked'] || theme.palette.secondary).main : (props.selected ? theme.palette.primary.dark : 'unset'),
        color: (props: TreeItemProps) => props.locked ? 'white' : (props.selected ? 'white' : 'inherit'),
        '&:hover': {
            color: 'inherit',
        },
        padding: 5,
    },
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        },
    },
    group: {
        marginBottom: 5,
        marginLeft: 12,
        paddingLeft: 12,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
}), ({iconComponent: IconComp, selected = false, locked, ...props}: TreeItemProps) => {
    const extraProps: {[key: string]: any} = {};
    if (IconComp) {
        extraProps.endIcon = <IconComp size={16}/>;
        extraProps.expandIcon = <IconComp size={16}/>;
        extraProps.collapseIcon = <IconComp size={16}/>;
    }
    return (
        <MuiTreeItem {...extraProps} {...props} />
    );
}, undefined, {i18n: false});

export interface TreeItemProps {
    iconComponent?: any,
    selected?: boolean,
    locked?: boolean,
    nodeId: string,
    [key: string]: any,
}

export default TreeItem