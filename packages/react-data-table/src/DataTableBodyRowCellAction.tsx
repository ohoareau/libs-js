import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {useConfirm} from 'material-ui-confirm';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const DataTableBodyRowCellAction = component<DataTableBodyRowCellActionProps>({
    button: {
        marginRight: 5,
    },
}, ({buttonComponent, classes = {}, t = () => {}, icon, tReady = false, expandedLabel, label, buttonVariant = 'outlined', buttonColor = 'inherit', buttonSize = 'small', startIcon, expandedStartIcon, expanded, type, onClick, row, confirmable = false}: DataTableBodyRowCellActionProps) => {
    const Button: any = buttonComponent;
    const confirm = useConfirm();
    const handleConfirmableClick = e => {
        e.stopPropagation();
        confirm({
            title: t([`tables_generic_main_item_confirms_delete_title`]),
            description: t([`tables_generic_main_item_confirms_delete_description`], {
                ...row,
                objectType: t([`expression_one_type_generic`, ''])
            }),
            confirmationText: t([`tables_generic_main_item_confirms_delete_buttons_confirm_label`], row),
            cancellationText: t([`tables_generic_main_item_confirms_delete_buttons_cancel_label`], row),
        }).then(() => onClick && onClick(row));
    };
    const handleNonConfirmableClick = useCallback(e => {e.stopPropagation(); onClick && onClick(row)}, [onClick, row]);
    const handleClick = confirmable ? handleConfirmableClick : handleNonConfirmableClick;
    const IconComponent = icon || DeleteIcon;
    const StartIcon = startIcon || KeyboardArrowDownIcon;
    const ExpandedStartIcon = expandedStartIcon || KeyboardArrowUpIcon;
    const realStartIcon = false === startIcon ? undefined : (expanded ? <ExpandedStartIcon/> : <StartIcon />);
    return (
        <div>
            {('icon' === type) && (
                <IconButton style={{marginLeft: 5}} color={buttonColor as any} size={buttonSize as any} onClick={handleClick}>
                    <IconComponent />
                </IconButton>
            )}
            {('icon' !== type) && (
                <Button variant={buttonVariant} color={buttonColor} size={buttonSize} className={classes.button} onClick={handleClick} startIcon={realStartIcon} label={t(expanded ? (expandedLabel || label) : label)} />
            )}
        </div>
    );
});

export interface DataTableBodyRowCellActionProps {
    buttonComponent?: Function,
    classes?: {[key: string]: any},
    icon?: any,
    t?: Function,
    tReady ?: boolean,
    expandedLabel?: string,
    label?: string,
    expanded?: boolean,
    type?: string,
    onClick?: Function,
    row?: any,
    confirmable?: boolean,
    startIcon?: any,
    expandedStartIcon?: any,
    buttonVariant?: string,
    buttonColor?: string,
    buttonSize?: string,
}

export default DataTableBodyRowCellAction