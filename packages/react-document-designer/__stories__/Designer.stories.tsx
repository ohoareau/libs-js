import React, {useState} from 'react';
import Designer from '../src/Designer';
import * as models from './models';
import * as themes from './themes';
import * as fontsets from './fontsets';
import * as templates from './templates';
import * as fontsizes from './fontsizes';
import * as formats from './formats';

export default {
    title: 'Designer',
    component: Designer,
}

export const designer = () => {
    const [value, onChange] = useState({});
    return (
        <Designer model={models.model1}
                  value={value}
                  templates={templates}
                  formats={formats}
                  themes={themes}
                  fontsets={fontsets}
                  fontsizes={fontsizes}
                  onChange={onChange}
        />
    );
};