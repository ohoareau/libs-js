import React from 'react';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';

const NavigatorItem = component<NavigatorItemProps>({
    root: {
        padding: 10,
        fontWeight: props => props['changed'] ? 'bold' : 'unset',
    },
}, ({item, classes = {}}: NavigatorItemProps) => (
    <Typography className={classes.root}>{item.name || item.id}</Typography>
), undefined, {i18n: false});

export interface NavigatorItemProps {
    item: {id: string, name: string, [key: string]: any},
    classes?: {[key: string]: any},
}

export default NavigatorItem