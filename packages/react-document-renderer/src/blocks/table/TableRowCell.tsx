import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from '../../hocs';

const TableRowCell = pdfComponent<TableRowCellProps>(undefined, ({s = () => {}, v = () => {}, data = undefined, header = false, column = {}} : TableRowCellProps) => (
    <View style={s([header && 'table_row_headercell', !header && 'table_row_cell'], {width: column.width})}>
        <View style={s([header && 'table_row_headercell_container', !header && 'table_row_cell_container'])}>
            <Text>{v(data || '')}</Text>
        </View>
    </View>
));

export interface TableRowCellProps {
    s?: Function,
    v?: Function,
    header?: boolean,
    data: any,
    row: any,
    column: any,
}

export default TableRowCell