import React from 'react';
import Box from '@material-ui/core/Box';
import component from '@ohoareau/react-component';

export const Customization = component<CustomizationProps>({
    root: {
        color: 'black',
        backgroundColor: '#F3E9D2',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        width: 125,
        marginRight: 32,
        display: 'flex',
        borderRadius: 2,
        transition: 'all 0.2s ease-in',
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: '#114B5F',
            color: 'white',
        }
    }
}, ({classes = {}, customization}: CustomizationProps) => (
    <Box className={classes.root} p={2} onClick={customization.onClick}>
        {customization.id.toUpperCase()}
    </Box>
));

export interface CustomizationProps {
    classes?: any,
    customization: {
        id: string,
        onClick?: any,
    },
}

export default Customization