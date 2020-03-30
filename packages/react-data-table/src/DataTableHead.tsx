import React, {ComponentType} from 'react';
import TableHead from '@material-ui/core/TableHead';
import DataTableHeadRow from './DataTableHeadRow';

const DataTableHead: ComponentType<DataTableHeadProps> = ({selectedCount, count, onSelectAllClick, columns, orderBy, order, createSortHandler}: DataTableHeadProps) => (
    <TableHead>
        <DataTableHeadRow selectedCount={selectedCount}
                          count={count}
                          onSelectAllClick={onSelectAllClick}
                          columns={columns} orderBy={orderBy} order={order}
                          createSortHandler={createSortHandler}
        />
    </TableHead>
);

export interface DataTableHeadProps {
    selectedCount?: number,
    count?: number,
    onSelectAllClick?: Function,
    columns?: any,
    orderBy?: any,
    order?: any,
    createSortHandler?: Function,
}

export default DataTableHead