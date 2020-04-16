import React from 'react';
import Table from './table/Table';
import {pdfComponent} from '../hocs';

export const TableBlock = pdfComponent<TableBlockProps>(undefined, ({block, v = () => {}}: TableBlockProps) => (
    <Table title={block.title} headers={block.headers}
           rows={v(block.data)} columns={block.columns}
    />
));

export interface TableBlockProps {
    s?: Function,
    v?: Function,
    block: any,
}

export default TableBlock