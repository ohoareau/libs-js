import React from 'react';
import component from '@ohoareau/react-component';

const NavigatorItem = component<NavigatorItemProps>({
    root: {
        padding: 2,
        margin: 5,
        fontWeight: props => props['changed'] ? 'bold' : 'unset',
    },
}, ({item, classes = {}}: NavigatorItemProps) => (
    <div className={classes.root}>{item.name || item.id}</div>
), undefined, {i18n: false});

export interface NavigatorItemProps {
    item: {id: string, name: string, [key: string]: any},
    classes?: {[key: string]: any},
}

export default NavigatorItem