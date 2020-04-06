import React, {ComponentType, forwardRef} from 'react';
import Slide from '@material-ui/core/Slide';
import {Theme} from '@material-ui/core/styles/createMuiTheme';

const Transition: ComponentType<TransitionProps> = forwardRef((props: TransitionProps, ref) => (
    <Slide direction={props.direction || 'up'} ref={ref} {...props} />
));

export interface TransitionProps {
    children?: React.ReactElement<any, any>;
    direction?: 'left' | 'right' | 'up' | 'down';
    ref?: React.Ref<unknown>;
    theme?: Theme;
}

export default Transition