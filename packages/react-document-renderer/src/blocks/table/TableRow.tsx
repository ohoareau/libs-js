import React from 'react';
import {View} from '@react-pdf/renderer';
import TableRowCell from './TableRowCell';
import {pdfComponent} from '../../hocs';

const TableRow = pdfComponent<TableRowProps>({
    table_row: {
        margin: "auto",
        flexDirection: "row"
    },
}, ({s = () => {}, header = false, rowIndex = 0, row, columns = []} : TableRowProps) => (
    <View style={s('table_row')}>
        {columns.map((column, i) => <TableRowCell key={column.id || i} header={header} data={(!header && (column.id === 'index')) ? (rowIndex + 1) : row[column.id]} column={column} row={row} />)}
    </View>
));

export interface TableRowProps {
    s?: Function,
    header?: boolean,
    rowIndex?: number,
    row: any,
    columns: any[],
}

export default TableRow