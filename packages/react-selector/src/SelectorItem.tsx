import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';

const SelectorItem = component<SelectorItemProps>(theme => ({
    root: {
        flex: 1,
        marginBottom: (props: SelectorItemProps) => props.space ? props.space * 5 : 'unset',
        marginRight: (props: SelectorItemProps) => props.hspace ? props.hspace * 5 : 'unset',
        display: 'flex',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: (props: SelectorItemProps) => props.selected ? theme.palette.primary.main : 'rgb(225, 225, 225)',
        color: (props: SelectorItemProps) => props.selected ? 'white' : 'unset',
        '&:hover': {
            cursor: (props: SelectorItemProps) => props.onSelect ? 'pointer' : 'unset',
            color: 'white',
            backgroundColor: theme.palette.primary.dark,
        },
        '&:last-of-type': {
            marginBottom: 'unset',
        },
    },
    container: {
        display: 'flex',
        flex: 1,
    },
    component: {
        flex: 1,
    },
    visualMark: {
        width: 10,
        backgroundColor: (props: SelectorItemProps) => 'function' === typeof props.visualMark ? (theme.palette[props.visualMark(props.item)] || theme.palette.primary).main : theme.palette.primary.main,
    },
}), ({id, item, component: Component, componentProps = {}, onSelect, data, classes = {}, visualMark = false}: SelectorItemProps) => (
    <div className={classes.root} onClick={useCallback(() => onSelect && onSelect(id), [onSelect, id])}>
        {!!visualMark && <div className={classes.visualMark} />}
        <div className={classes.container}>
            <Component {...componentProps} item={item} data={data} />
        </div>
    </div>
), undefined, {i18n: false});

export interface SelectorItemProps {
    id?: string,
    item?: any,
    space?: number,
    hspace?: number,
    selected?: boolean,
    component?: any,
    componentProps?: {[key: string]: any},
    onSelect?: any,
    data?: any,
    classes?: {[key: string]: any},
    visualMark?: boolean|Function,
}

export default SelectorItem