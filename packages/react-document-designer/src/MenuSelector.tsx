import React, {useCallback} from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import component from "@ohoareau/react-component";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export const MenuSelectorItem = ({item}) => item.name;

export const MenuSelector = component<MenuSelectorProps>({
    root: {
        margin: 5,
        minWidth: 100,
    },
    label: {
        color: 'inherit',
    },
    select: {
        color: 'inherit',
    }
}, ({classes = {}, items = [], label, current, onChange, itemComponent: Item}: MenuSelectorProps) => {
    const handleChange = useCallback(e => onChange && onChange(e.target.value), [onChange]);
    if (!items.length || (1 === items.length && current === items[0].id)) return null;
    Item = Item || MenuSelectorItem;
    return (
        <FormControl className={classes.root}>
            {label && <InputLabel className={classes.label}>{label}</InputLabel>}
            <Select className={classes.select} value={current} onChange={handleChange}>
                {items.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                        <Item item={item} current={item.id === current} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
});

export interface MenuSelectorProps {
    classes?: any,
    label?: string,
    items?: any[],
    current?: any,
    onChange?: Function,
    itemComponent?: any,
}

export default MenuSelector