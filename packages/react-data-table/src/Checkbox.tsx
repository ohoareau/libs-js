import withStyles from '@material-ui/core/styles/withStyles';
import MuiCheckbox, {CheckboxProps as MuiCheckboxProps} from '@material-ui/core/Checkbox';
import {ComponentType} from "react";

const Checkbox: ComponentType<CheckboxProps> = withStyles(theme => ({
    colorPrimary: {
        color: 'inherit',
        '&$checked': {
            color: (props: CheckboxProps) => theme.palette.primary[!!props.inverted ? 'contrastText' : 'main'],
            '&:hover': {
                color: (props: CheckboxProps) => theme.palette.primary[!!props.inverted ? 'contrastText' : 'main'],
            }
        },
    },
    checked: {},
}))(MuiCheckbox);

interface ExtraProps {
    inverted?: boolean,
}

export interface CheckboxProps extends MuiCheckboxProps,ExtraProps {}

export default Checkbox