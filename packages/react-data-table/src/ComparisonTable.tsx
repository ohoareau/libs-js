import React from 'react';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import component from '@ohoareau/react-component';
import {formatize} from './data-table-helpers';
import DataTableBody from './DataTableBody';
import DataTableHead from './DataTableHead';
import DataTableToolBar from './DataTableToolBar';

// noinspection TypeScriptValidateJSTypes
const ComparisonTable = component<ComparisonTableProps>((theme: any) => ({
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
}), ({classes = {}, t = () => {}, tReady = false, data, totalCount, rows = [], title, subTitle, toolbar = true, size = 'medium'}: ComparisonTableProps) => {
    const count = data.items.length;
    let columns: any[] = data.items.reduce((acc, item, i) => {
        acc.push({id: `item_${i}`, type: 'centered', label: String.fromCharCode(i + 65)});
        return acc;
    }, [{id: 'attribute', label: 'Caractéristiques', type: 'comparison_title', format: 'string'}]);
    columns = columns.map(v => {
        return ({...v, format: formatize(v.format || 'string', {t, ...v})});
    });
    const items = rows.map(r => {
        const x = {
            id: r.id,
            attribute: r.label || r.id || '',
        };
        const format = formatize(r.format || 'string', {t, ...r});
        x.attribute = `${x.attribute.charAt(0).toUpperCase()}${x.attribute.slice(1)}`;
        data.items.reduce((acc, item, i) => {
            acc[`item_${i}`] = format(item[r.id]);
            return acc;
        }, x);

        return x;
    });
    const formatRow = undefined;
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={0}>
                <DataTableToolBar enabled={toolbar}
                                  title={title} subTitle={subTitle} count={count} totalCount={totalCount}
                                  content={<div style={{padding: '15px 0 0 0'}} />}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle" size={size} aria-label="table">
                        <DataTableHead columns={columns} count={count} />
                        <DataTableBody columns={columns} items={items} formatRow={formatRow} selected={{}} expanded={{}} />
                    </Table>
                </div>
            </Paper>
        </div>
    );
});

export interface ComparisonTableProps {
    t?: Function,
    tReady?: boolean,
    classes?: {[key: string]: any},
    data?: any,
    totalCount?: number,
    rows?: any[],
    title?: string,
    subTitle?: string,
    toolbar?: boolean,
    size?: any,
}

export default ComparisonTable