import React, {useCallback} from 'react';
import TableRow from '@material-ui/core/TableRow';
import component from '@ohoareau/react-component';
import DataTableBodyRowCell from './DataTableBodyRowCell';
import DataTableBodyRowExpansion from './DataTableBodyRowExpansion';

const DataTableBodyRow = component<DataTableBodyRowProps>(theme => ({
    root: (props: DataTableBodyRowProps) => {
        const {hover = {}, selected = {}, selectedHover = {}, ...properties} = props.formatRow ? props.formatRow(props.row, theme) : {};
        return {
            ...properties,
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: theme.palette.primary.dark,
                color: 'white',
                ...hover,
            },
            '&$selected': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                ...selected,
            },
            '&$selected:hover': {
                backgroundColor: theme.palette.primary.dark,
                color: 'white',
                ...selectedHover,
            },
        };
    },
    selected: () => ({}),
}), ({buttonComponent, classes, row, expandedComponent: ExpandedComponent, onClick, selected, expanded, columns, actions}: DataTableBodyRowProps) => (
    <>
        <TableRow classes={classes} role="checkbox" aria-checked={selected} tabIndex={-1} selected={selected}
                  onClick={useCallback(event => onClick && onClick(event, row.id), [row.id, onClick])}
        >
            {columns.map((c, i) => (
                <DataTableBodyRowCell key={c.id} buttonComponent={buttonComponent} index={i} selected={selected} expanded={expanded} row={row} column={c} actions={actions}/>
            ))}
        </TableRow>
        {expanded && (
            <DataTableBodyRowExpansion row={row} selected={selected} columns={columns} actions={actions}>
                {!!ExpandedComponent && <ExpandedComponent row={row} />}
            </DataTableBodyRowExpansion>
        )}
    </>
), undefined, {i18n: false});

export interface DataTableBodyRowProps {
    buttonComponent?: any,
    classes?: {[key: string]: any},
    row?: any,
    expandedComponent?: any,
    onClick?: Function,
    selected?: any,
    expanded?: any,
    columns?: any,
    actions?: any,
    formatRow?: Function,
}

export default DataTableBodyRow