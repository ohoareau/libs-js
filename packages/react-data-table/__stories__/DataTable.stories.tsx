import React from 'react';
import DataTable from '../src/DataTable';
import {Chip} from "@material-ui/core";

const CustomChip = ({children, row}) => <Chip label={children} color={children === "COMPLETED" ? "primary" : "default"} />

const data = {
    items: [
        {id: 'a', name: 'Superman', origin: 'Krypton', status: 'CREATED'},
        {id: 'b', name: 'Iron Man', origin: 'Earth', status: 'COMPLETED'},
    ],
};

const columns = [{id: 'selector'}, {id: 'name'}, {id: 'origin'}, {id: 'status'}];
const columnsWithCustomComp = [{id: 'selector'}, {id: 'name'}, {id: 'origin'}, {id: 'status', component: CustomChip}];

export default {
    title: 'DataTable',
    component: DataTable,
}

export const basic = () => <DataTable data={data} columns={columns}/>;
export const withRowComponents = () => <DataTable data={data} columns={columnsWithCustomComp} />;