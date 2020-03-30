import React, {ComponentType} from 'react';
import Checkbox from './Checkbox';
import TableCell from '@material-ui/core/TableCell';
import withStyles from '@material-ui/core/styles/withStyles';
import capitalize from '@material-ui/core/utils/capitalize';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {withTranslation} from 'react-i18next';

const DataTableHeadRowCell: ComponentType<DataTableHeadRowCellProps> = withStyles(() => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}))(withTranslation()(({sortable, selectedCount = 0, count = 0, onSelectAllClick, classes = {}, t = () => {}, column, sortEnabled = false, sortDirection = 'asc', onSortClick}: DataTableHeadRowCellProps) => {
    let content;
    const extraProps: {[key: string]: any} = {sortDirection};
    const type = column.type || column.id;
    switch (type) {
        case 'selector':
            extraProps.padding = 'checkbox';
            content = (
                <Checkbox color={'primary'} indeterminate={selectedCount > 0 && selectedCount < count}
                          checked={selectedCount === count}
                          onChange={onSelectAllClick}
                          inputProps={{'aria-label': 'select all'}}
                />
            );
            break;
        case 'actions':
            content = capitalize(t(column.label || column.id));
            break;
        default:
            extraProps.align = type === 'centered' ? 'center' : (type === 'comparison_title' ? 'right' : (column.numeric ? 'right' : 'left'));
            extraProps.padding = 'none';
            content = sortable ? (
                <TableSortLabel active={sortEnabled} direction={sortDirection} onClick={onSortClick}>
                    {capitalize(t(column.label || column.id))}
                    {sortEnabled ? (
                        <span className={classes.visuallyHidden}>
                            {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                    ) : null}
                </TableSortLabel>
            ) : capitalize(t(column.label || column.id));
            break;
    }
    return <TableCell {...extraProps}>{content}</TableCell>;
}));

export interface DataTableHeadRowCellProps {
    sortable?: boolean,
    selectedCount?: number,
    count?: number,
    onSelectAllClick?: any,
    classes?: {[key: string]: any},
    t?: Function,
    column?: any,
    sortEnabled?: boolean,
    sortDirection?: 'asc' | 'desc',
    onSortClick?: any,
}

export default DataTableHeadRowCell