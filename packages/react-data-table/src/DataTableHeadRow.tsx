import React, {ComponentType} from 'react';
import TableRow from '@material-ui/core/TableRow';
import DataTableHeadRowCell from './DataTableHeadRowCell';

const DataTableHeadRow: ComponentType<DataTableHeadRowProps> = ({selectedCount, count, onSelectAllClick, columns = [], orderBy, order, createSortHandler}: DataTableHeadRowProps) => (
    <TableRow>
        {columns.map((c: any) => (
            <DataTableHeadRowCell key={c.id}
                                  column={c}
                                  selectedCount={selectedCount} count={count} onSelectAllClick={onSelectAllClick}
                                  sortable={!!createSortHandler}
                                  sortEnabled={orderBy === c.id} sortDirection={orderBy === c.id ? order : undefined}
                                  onSortClick={createSortHandler ? createSortHandler(c.id) : undefined}
            />
        ))}
    </TableRow>
);

export interface DataTableHeadRowProps {
    selectedCount?: number,
    count?: number,
    onSelectAllClick?: Function,
    columns?: any[],
    orderBy?: string,
    order?: any,
    createSortHandler?: Function,
}

export default DataTableHeadRow