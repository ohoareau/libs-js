import component from '@ohoareau/react-component';
import {darken, lighten} from '@material-ui/core';
import LinearProgress, {LinearProgressProps} from '@material-ui/core/LinearProgress';

const colorMap = theme => ({level}: ProgressBarProps) => {
    switch (level) {
        case 'error': return theme.palette.check_error.main;
        case 'warning': return theme.palette.check_warning.main;
        case 'success': return theme.palette.check_success.main;
        case 'info': return theme.palette.check_info.main;
        case 'pending': return theme.palette.check_pending.main;
        case 'primary': return theme.palette.primary.main;
        case 'secondary': return theme.palette.secondary.main;
        default: return theme.palette.check_pending.main;
    }
};

const ProgressBar = component<ProgressBarProps>(theme => {
    const computeColor = colorMap(theme);
    return {
        root: {
            marginBottom: (props: ProgressBarProps) => props.margin ? 60 : 0,
            height: (props: ProgressBarProps) => props.thin ? 4 : 20,
            backgroundColor: (props: ProgressBarProps) => lighten(computeColor(props), 0.5),
        },
        bar: {
            backgroundColor: (props: ProgressBarProps) => props.darken ? darken(computeColor(props), 0.3) : computeColor(props),
        },
    };
}, LinearProgress, undefined, {i18n: false});

type ExtraProps = {
    margin?: boolean,
    thin?: boolean,
    darken?: boolean,
    level?: string,
};

export type ProgressBarProps = LinearProgressProps & ExtraProps;

export default ProgressBar