import React from 'react';

import DataTable from '../src/DataTable';

const data = {
    items: [
        {id: 'a', name: 'Superman'},
        {id: 'b', name: 'Iron Man'},
    ],
};
const columns = [{id: 'selector'}, {id: 'name'}];

export default {
    title: 'DataTable',
    component: DataTable,
}

export const basic = () => <DataTable data={data} columns={columns}/>;