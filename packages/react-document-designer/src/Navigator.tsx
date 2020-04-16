import React from 'react';
import component from '@ohoareau/react-component';
import {Selector} from '@ohoareau/react-selector';
import NavigatorItem from './NavigatorItem';

const Navigator = component<NavigatorProps>({
    root: {
    }
}, ({fragments = [], current, onChange, classes = {}}: NavigatorProps) => (
    <div className={classes.root}>
        <Selector items={fragments} value={current} component={NavigatorItem} onChange={onChange} />
    </div>
), undefined, {i18n: false});

export interface NavigatorProps {
    fragments?: {id: string, [key: string]: any}[],
    current?: any,
    onChange?: any,
    classes?: {[key: string]: any},
}

export default Navigator