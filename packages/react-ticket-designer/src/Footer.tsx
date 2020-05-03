import React from 'react';
import Box from '@material-ui/core/Box';
import component from '@ohoareau/react-component';

export const Footer = component<FooterProps>({
    root: {
        height: 70,
        backgroundColor: '#88D498',
        boxSizing: 'border-box',
    }
}, ({classes = {}}: FooterProps) => (
    <Box className={classes.root} p={2}>FOOTER</Box>
));

export interface FooterProps {
    classes?: any,
}

export default Footer