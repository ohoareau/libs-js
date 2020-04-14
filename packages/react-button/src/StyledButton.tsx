import component from '@ohoareau/react-component';
import Button, {ButtonProps} from '@material-ui/core/Button';

const StyledButton = component<StyledButtonProps>({
    root: {
        boxShadow: 'none',
        borderRadius: 0,
    },
    outlined: {
        boxShadow: 'none',
        borderRadius: 0,
    }
}, Button, undefined, {i18n: false});

export type StyledButtonProps = ButtonProps

export default StyledButton