import React from 'react';
import component from '@ohoareau/react-component';
import SelectorItem from './SelectorItem';

// noinspection JSUnusedGlobalSymbols
const Selector = component<SelectorProps>({
    root: {
        display: 'flex',
        flexDirection: (props: SelectorProps) => !!props.inline ? 'row' : 'column',
    },
}, ({items = [], value, inline = false, component, componentProps = {}, onChange, selections = {}, classes = {}, visualMark = false, space = 0}: SelectorProps) => (
    <div className={classes.root}>
        {((items || []) as any[]).map((item, i) => <SelectorItem key={item.id || i} id={item.id} item={item} component={component} componentProps={componentProps} selected={value === item.id} data={selections[item.id] || {}} onSelect={onChange} visualMark={visualMark} {...(inline ? {hspace: space} : {space})} />)}
    </div>
), undefined, {i18n: false});

export interface SelectorProps {
    items?: any[],
    value?: any,
    inline?: boolean,
    component?: any,
    componentProps?: {[key: string]: any},
    onChange?: any,
    selections?: {[key: string]: any},
    classes?: {[key: string]: any},
    visualMark?: boolean,
    space?: number,
}

export default Selector