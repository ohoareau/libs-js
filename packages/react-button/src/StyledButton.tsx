import {ComponentType} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button, {ButtonProps} from '@material-ui/core/Button';

const StyledButton: ComponentType<StyledButtonProps> = withStyles(() => ({
    root: {
        boxShadow: 'none',
        borderRadius: 0,
    },
    outlined: {
        boxShadow: 'none',
        borderRadius: 0,
    }
}))(Button);

export type StyledButtonProps = ButtonProps

export default StyledButton