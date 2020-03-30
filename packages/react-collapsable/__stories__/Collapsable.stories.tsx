import React from 'react';

import {Collapsable} from '../src';

export default {
    component: Collapsable,
    title: 'Collapsable',
    parameters: {
        info: { inline: true },
    }
};

export const basic = () => <Collapsable title={'Basic Title'}>Basic content</Collapsable>;
export const full_width_content = () => <Collapsable title={'Full width'}><div style={{backgroundColor: 'yellow'}}>This content should be with yellow full width background</div></Collapsable>;
