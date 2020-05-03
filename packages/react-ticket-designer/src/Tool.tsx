import React from 'react';
import Box from '@material-ui/core/Box';
import component from '@ohoareau/react-component';

export const Tool = component<ToolProps>({
    root: {
        backgroundColor: '#F3E9D2',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        height: 75,
        width: 75,
        marginBottom: 16,
        display: 'flex',
        borderRadius: 2,
        transition: 'all 0.2s ease-in',
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#114B5F',
            color: 'white',
        }
    }
}, ({classes = {}, tool, onClick}: ToolProps) => (
    <Box className={classes.root} p={2} onClick={onClick}>
        {tool.id.toUpperCase()}
    </Box>
));

export interface ToolProps {
    classes?: any,
    tool?: any,
    onClick?: any,
}

export default Tool