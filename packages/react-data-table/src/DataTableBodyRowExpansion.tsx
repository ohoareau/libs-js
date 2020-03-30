import React, {ComponentType} from 'react';
import TableRow from '@material-ui/core/TableRow';
import withStyles from '@material-ui/core/styles/withStyles';
import DataTableBodyRowCell from './DataTableBodyRowCell';

const DataTableBodyRowExpansion: ComponentType<DataTableBodyRowExpansionProps> = withStyles(() => ({
    root: {
        backgroundColor: 'unset',
        '&:hover': {
            backgroundColor: 'rgb(250, 250, 250)',
        },
        '&$selected': {
            backgroundColor: 'rgb(250, 250, 250)',
            '&:hover': {
                backgroundColor: 'rgb(250, 250, 250)',
            }
        },
    },
    selected: {},
}))(({children, classes, row, selected, columns = [], actions = []}: DataTableBodyRowExpansionProps) => (
    <TableRow classes={classes} tabIndex={-1} selected={selected}>
        <DataTableBodyRowCell index={0} cols={columns.length} selected={selected} row={row} column={{id: 'details'}} actions={actions}>
            {children}
        </DataTableBodyRowCell>
    </TableRow>
));

export interface DataTableBodyRowExpansionProps {
    children?: any,
    classes?: {[key: string]: any},
    row?: any,
    selected?: any,
    columns?: any[],
    actions?: any[],
}

export default DataTableBodyRowExpansion