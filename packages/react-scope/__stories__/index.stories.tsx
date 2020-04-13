import React from 'react';

import {ProgressBar} from '../src';

export default {
    component: ProgressBar,
    title: 'ProgressBar',
    parameters: {
        info: { inline: true },
    }
};

export const basic = () => <ProgressBar level={'primary'} value={66} variant={'determinate'} />;
