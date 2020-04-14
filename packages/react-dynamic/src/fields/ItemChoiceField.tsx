import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';

export const ItemChoiceField = component<ItemChoiceFieldProps>({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}, ({classes = {}, items = [], itemComponent: Component, input}: ItemChoiceFieldProps) => {
    const selected = (!!input.value ? (Array.isArray(input.value) ? input.value : [input.value]) : []).reduce((acc, item) => Object.assign(acc, {[item]: true}), {});
    const onChange = input.onChange;
    const toggle = useCallback(id => {
        if (!!selected[id]) delete selected[id];
        else selected[id] = true;
        onChange(Object.keys(selected));
    }, [selected, onChange]);
    return (
        <div className={classes.root}>
            {items.map((item, i) => <Component key={item.id || i} {...item} selected={!!selected[item.id]} onClick={() => toggle(item.id)}/>)}
        </div>
    );
}, undefined, {i18n: false});

export interface ItemChoiceFieldProps {
    classes?: {[key: string]: any},
    items?: any[],
    itemComponent?: any,
    errors?: any,
    placeholder?: any,
    label?: any,
    input?: any
}

export default ItemChoiceField