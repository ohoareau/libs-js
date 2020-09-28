import React, {useCallback, useMemo, useState} from 'react';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import component from '@ohoareau/react-component';
import DataTableBody from './DataTableBody';
import DataTableHead from './DataTableHead';
import DataTableToolBar from './DataTableToolBar';
import DataTablePaginationBar from './DataTablePaginationBar';
import {formatize, stableSort, getSorting} from './data-table-helpers';

// noinspection TypeScriptValidateJSTypes
const DataTable = component<DataTableProps>((theme: any) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}),({classes = {}, buttonComponent, comparable = 0, actionPosition = 'default', actionContainerClassName = undefined, actionContainerComponent = undefined, onCompareClick = undefined, forcedSelected, forcedSetSelected, formatRow, globalActions = [], t = () => {}, tReady = false, filterPanelComponent, onFilter, filters = {}, data, totalCount, columns, title, subTitle, toolbarContent, itemActions, expanded = {}, expandedComponent, loading, toolbar = true, size = 'medium', defaultRowsPerPage = 10, defaultOrderBy = undefined, defaultOrder = 'asc', defaultSelected = {}, defaultPage = 0, defaultFilterOpened = false, onClick}: DataTableProps) => {
    const [filterOpened, setFilterOpened] = useState(defaultFilterOpened);
    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    let [selected, setSelected]: [any, any] = useState(defaultSelected);
    forcedSelected && (selected = forcedSelected);
    forcedSetSelected && (setSelected = forcedSetSelected);
    const [page, setPage] = useState(defaultPage);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const count = data.items.length;
    columns = useMemo(() => columns.map(v => ({...v, format: formatize(v.format, {t, ...v})})), [columns, t]);
    const selectedCount = Object.keys(selected).length;
    const onSelectAllClick = useCallback(() => {
        setSelected((selectedCount === count) ? {} : data.items.reduce((acc, n) => {acc[n.id] = true; return acc;}, {}))
    }, [data.items, selectedCount, count, setSelected]);
    const handleClick = useCallback((event, name) => {
        const newSelected ={...selected};
        !!selected[name] ? (delete newSelected[name]) : newSelected[name] = true;
        setSelected(newSelected);
        onClick && onClick(name);
    }, [selected, setSelected, onClick]);
    const onChangePage = useCallback((event, newPage) => setPage(newPage), [setPage]);
    const onChangeRowsPerPage = useCallback(event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, [setRowsPerPage, setPage]);
    const onToggleFilterOpened = useCallback(() => {
        setFilterOpened(!filterOpened);
    }, [setFilterOpened, filterOpened]);
    const createSortHandler = useCallback(property => () => {
        setOrder((orderBy === property && order === 'desc') ? 'asc' : 'desc');
        setOrderBy(property);
    }, [orderBy, order, setOrder, setOrderBy]);
    const sorting = useMemo(() => getSorting(order, orderBy), [order, orderBy]);
    const startRow = page * rowsPerPage;
    const items = useMemo(
        () => stableSort(data.items, sorting).slice(startRow, startRow + rowsPerPage),
        [data.items, sorting, startRow, rowsPerPage]
    );
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <DataTableToolBar buttonComponent={buttonComponent} enabled={toolbar} selectedCount={selectedCount} loading={loading} filterOpened={filterOpened}
                                  title={title} subTitle={subTitle} count={count} totalCount={totalCount} actions={globalActions} onToggleFilterOpened={onToggleFilterOpened}
                                  filters={filters} onFiltersChange={onFilter}
                                  filterPanelComponent={filterPanelComponent}
                                  content={toolbarContent}
                                  comparable={comparable} onCompareClick={onCompareClick}
                                  actionPosition={actionPosition} actionContainerClassName={actionContainerClassName} actionContainerComponent={actionContainerComponent}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle" size={size} aria-label="table">
                        <DataTableHead columns={columns} selectedCount={selectedCount} count={count}
                                       onSelectAllClick={onSelectAllClick}
                                       orderBy={orderBy} order={order} createSortHandler={createSortHandler}
                        />
                        <DataTableBody buttonComponent={buttonComponent} columns={columns} selected={selected} expanded={expanded} items={items}
                                       onClick={handleClick} itemActions={itemActions}
                                       expandedComponent={expandedComponent}
                                       formatRow={formatRow}
                        />
                    </Table>
                </div>
                <DataTablePaginationBar page={page} count={count} rowsPerPage={rowsPerPage}
                                        onChangePage={onChangePage}
                                        onChangeRowsPerPage={onChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
});

export interface DataTableProps {
    classes?: {[key: string]: any},
    buttonComponent?: any,
    comparable?: number,
    onCompareClick?: Function,
    forcedSelected?: boolean,
    forcedSetSelected?: Function,
    formatRow?: any,
    globalActions?: any[],
    t?: Function,
    tReady?: boolean,
    filterPanelComponent?: any,
    onFilter?: Function,
    filters?: {[key: string]: any},
    data?: any,
    totalCount?: number,
    columns?: any,
    title?: string,
    subTitle?: string,
    toolbarContent?: any,
    itemActions?: any,
    expanded?: {[key: string]: any},
    expandedComponent?: any,
    loading?: any,
    toolbar?: boolean,
    size?: any,
    defaultRowsPerPage?: number,
    defaultOrderBy?: any,
    defaultOrder?: string,
    defaultSelected?: any,
    defaultPage?: number,
    defaultFilterOpened?: boolean,
    onClick?: Function,
    actionContainerClassName?: string,
    actionContainerComponent?: any,
    actionPosition?: 'default' | 'head'
}

export default DataTable