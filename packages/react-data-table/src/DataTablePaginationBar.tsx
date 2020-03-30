import React, {ComponentType} from 'react';
import TablePagination from '@material-ui/core/TablePagination';

const DataTablePaginationBar: ComponentType<DataTablePaginationBarProps> = ({count = 0, rowsPerPage = 10, page = 0, onChangePage, onChangeRowsPerPage}: DataTablePaginationBarProps) => (
    <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100, 200].filter(r => r <= count)}
        component={'div'}
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{'aria-label': 'previous page'}}
        nextIconButtonProps={{'aria-label': 'next page'}}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
    />
);

interface DataTablePaginationBarProps {
    count?: number,
    rowsPerPage?: number,
    page?: number,
    onChangePage?: any,
    onChangeRowsPerPage?: any,
}

export default DataTablePaginationBar