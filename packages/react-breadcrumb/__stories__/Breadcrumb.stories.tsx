import React from 'react';
import Breadcrumb from '../src/Breadcrumb';

export default {
    title: 'Breadcrumb',
    component: Breadcrumb,
}

export const basic = () => <Breadcrumb parentScopes={[{name: 'P1'}, {name: 'P2'}, {name: 'P3'}]} scope={{name: 'P4'}}  />;
