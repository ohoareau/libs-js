import React from 'react';
import {View} from '@react-pdf/renderer';
import TableRow from './TableRow';
import {pdfComponent} from '../../hocs';

const prepareColumns = (columns: any[]): [any, any[]] => {
    const n = columns.length;
    const columnsRow = {id: 'headers'};
    const spans = columns.reduce((x, c) => x + (c.span || 1), 0);
    const ratioForOne = n > 0 ? (1 / spans) : 1;
    const columnsData = columns.map(c => {
        columnsRow[c.id] = c.label;
        return {width: `${ratioForOne * (c.span || 1) * 100}%`, ...c};
    });
    return [columnsRow, columnsData];
};

export const Table = pdfComponent<TableProps>({
    table: {
        display: 'table',
        width: 'auto',
    },
}, ({s = () => {}, headers = true, title = undefined, rows = [], columns = []} : TableProps) => {
    const [columnsRow, columnsData] = prepareColumns(columns);
    headers && (rows = [columnsRow, ...rows]);
    return (
        <View style={s('table')}>
            {!!title && <TableRow header={true} row={{title}} columns={[{id: 'title', width: '100%'}]} />}
            {rows.map((row, i) => <TableRow key={row.id || i} rowIndex={headers ? (i - 1) : i} header={headers && (i === 0)} row={row} columns={columnsData} />)}
        </View>
    );
});

export interface TableProps {
    s?: Function,
    title?,
    headers?,
    rows: any[],
    columns: any[],
}

export default Table