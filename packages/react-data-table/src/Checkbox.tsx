import component from '@ohoareau/react-component';
import MuiCheckbox, {CheckboxProps as MuiCheckboxProps} from '@material-ui/core/Checkbox';

const Checkbox = component<CheckboxProps>(theme => ({
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
}), MuiCheckbox);

interface ExtraProps {
    inverted?: boolean,
}

export interface CheckboxProps extends MuiCheckboxProps,ExtraProps {}

export default Checkbox