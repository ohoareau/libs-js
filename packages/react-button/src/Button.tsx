import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Spinner from './Spinner';
import component from '@ohoareau/react-component';
import StyledButton, {StyledButtonProps} from './StyledButton';

// @ts-ignore
const Button = component<ButtonProps>(undefined, ({t = () => {}, type, tReady = false, tooltip, color, startIcon, endIcon, variant = 'contained', noLabel, dispatch, size, submitting, label, noStartIcon, ...props }: ButtonProps) => {
    const compProps: StyledButtonProps = {
        disableElevation: true,
        size,
        disabled: submitting,
        // @ts-ignore
        ...((variant === 'default') ? {} : {variant}),
        color,
        ...(submitting ? ({startIcon: <Spinner size={24} />}) : ((startIcon && !noStartIcon) ? {startIcon} : {})),
        ...(endIcon ? {endIcon} : {}),
        ...props,
        ...(props.onClick ? {} : {type: 'submit'}),
    };
    const content = noLabel ? <></> : (label || t([`buttons_${type}_label`, type]));
    return tooltip
        ? <Tooltip title={tooltip}><StyledButton {...compProps}>{content}</StyledButton></Tooltip>
        : <StyledButton {...compProps}>{content}</StyledButton>
    ;
});

export type ButtonProps = Omit<StyledButtonProps, "type"> & {
    tooltip?: any,
    color?: string,
    startIcon?: any,
    endIcon?: any,
    variant?: string,
    noLabel?: boolean,
    dispatch?: any,
    size?: any,
    t?: Function,
    tReady?: boolean,
    submitting?: boolean,
    label?: any,
    noStartIcon?: boolean,
    type?: string,
};

export default Button