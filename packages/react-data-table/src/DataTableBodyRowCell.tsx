import React, {ComponentType} from 'react';
import Checkbox from './Checkbox';
import TableCell from '@material-ui/core/TableCell';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DataTableBodyRowCellAction from './DataTableBodyRowCellAction';

const DataTableBodyRowCell: ComponentType<DataTableBodyRowCellProps> = ({buttonComponent, index, row, column, expanded, selected, actions, cols = 1, children}: DataTableBodyRowCellProps) => {
    let content;
    const extraProps: {[key: string]: any} = {colSpan: cols, style: {cursor: 'pointer', color: 'inherit'}, padding: 'none'};
    if (!!index) {
        extraProps.id = row.id;
        extraProps.component = 'th';
        extraProps.scope = 'row';
    }
    if (column.component) {
        const Component = column.component;
        content = <Component>{row[column.id]}</Component>;
    } else {
        switch (column.type || column.id) {
            case 'status':
                extraProps.padding = 'checkbox';
                extraProps.style = {...extraProps.style, width: 50};
                const v = row.status;
                switch (v) {
                    case 'CREATED':
                        content = <FiberManualRecordIcon />;
                        break;
                    case 'STARTED':
                        content = <CircularProgress size={20} />;
                        break;
                    case 'COMPLETED':
                        content = <CheckCircleIcon />;
                        break;
                    case 'ERRORED':
                        content = <ErrorOutlineIcon />;
                        break;
                    default:
                        content = column.format ? column.format(row[column.id], row) : row[column.id];
                        break;
                }
                break;
            case 'selector':
                extraProps.padding = 'checkbox';
                content = <Checkbox inverted={true} color={'primary'} checked={selected} inputProps={{'aria-labelledby': `enhanced-table-checkbox-${row.id}`}} />;
                break;
            case 'actions':
                extraProps.padding = 'checkbox';
                extraProps.style = {...extraProps.style, width: (actions.length > 1) ? 160 : 130};
                content = (
                    <div style={{display: 'flex'}}>
                        {(actions as any[]).map((action) => <DataTableBodyRowCellAction key={action.id} buttonComponent={buttonComponent} {...action} expanded={expanded} row={row} />)}
                    </div>
                );
                break;
            case 'details':
                extraProps.padding = 'none';
                content = (
                    <div style={{padding: 20}}>
                        {children}
                    </div>
                );
                break;
            case 'title':
                content = (
                    <div style={{padding: '10px 0 10px 0', fontWeight: 'bold'}}>{column.format ? column.format(row[column.id], row) : row[column.id]}</div>
                );
                break;
            case 'comparison_title':
                extraProps.padding = 'checkbox';
                content = (
                    <div style={{padding: '10px 0 10px 0', fontWeight: 'bold', textAlign: 'right'}}>{column.format ? column.format(row[column.id], row) : row[column.id]}</div>
                );
                break;
            case 'centered':
                content = (
                    <div style={{textAlign: 'center'}}>{column.format ? column.format(row[column.id], row) : row[column.id]}</div>
                );
                break;
            default:
                content = column.format ? column.format(row[column.id], row) : row[column.id];
                break;
        }
    }
    
    const RootComponent = row.rootComponent || TableCell;

    return <RootComponent {...extraProps}>{content}</RootComponent>;
};

export interface DataTableBodyRowCellProps {
    buttonComponent?: any,
    index?: any,
    row?: any,
    column?: any,
    expanded?: any,
    selected?: any,
    actions?: any,
    cols?: any,
    children?: any,
}

export default DataTableBodyRowCell
