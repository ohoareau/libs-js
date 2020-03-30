import React from 'react';

import Collapsable from './Collapsable';

export default {
    component: Collapsable,
    title: 'Collapsable',
    parameters: {
        info: { inline: true },
    }
};

export const basic = () => <Collapsable title={'Basic Title'}>Basic content</Collapsable>;
