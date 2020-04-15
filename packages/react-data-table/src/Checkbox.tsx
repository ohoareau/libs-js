import React from 'react';
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
}), ({inverted = false, ...props}: CheckboxProps) => <MuiCheckbox {...props} />, undefined, {i18n: false});

export interface CheckboxProps extends MuiCheckboxProps {
    inverted?: boolean,
}

export default Checkbox