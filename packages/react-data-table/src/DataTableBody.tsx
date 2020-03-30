import React, {ComponentType} from 'react';
import TableBody from '@material-ui/core/TableBody';
import DataTableBodyRow from './DataTableBodyRow';

const DataTableBody: ComponentType<DataTableBodyProps> = ({buttonComponent, items = [], selected, expanded, expandedComponent, onClick, itemActions, columns, formatRow}: DataTableBodyProps) => (
    <TableBody>
        {items.map(row => (
            <DataTableBodyRow buttonComponent={buttonComponent} key={row.id} row={row} selected={!!selected[row.id]} expanded={!!expanded[row.id]} columns={columns}
                              onClick={onClick} actions={itemActions}
                              expandedComponent={expandedComponent}
                              formatRow={formatRow}
            />
        ))}
    </TableBody>
);

export interface DataTableBodyProps {
    buttonComponent?: Function,
    items?: any[],
    selected?: any,
    expanded?: any,
    expandedComponent?: any,
    onClick?: Function,
    itemActions?: any,
    columns?: any,
    formatRow?: any,
}

export default DataTableBody