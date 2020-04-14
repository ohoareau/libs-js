import component from '@ohoareau/react-component';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';

const DialogBox = component<DialogBoxProps>({
    paper: {
        borderRadius: 0,
    }
}, Dialog, undefined, {i18n: false});

export interface DialogBoxProps extends DialogProps {}

export default DialogBox