import React, {ComponentType} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner: ComponentType<SpinnerProps> = ({size = 32}: SpinnerProps) => (
    <CircularProgress size={size} />
);

export interface SpinnerProps {
    size?: number,
}

export default Spinner