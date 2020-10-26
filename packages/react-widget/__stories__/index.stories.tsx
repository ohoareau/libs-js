import React from 'react';

import component from '../src';

export default {
    component: component({}, () => <div />),
    title: 'component',
    parameters: {
        info: { inline: true },
    }
};

export const basic = component({root: {backgroundColor: 'red'}}, ({classes}) => <div className={classes.root}>Hello world</div>);
