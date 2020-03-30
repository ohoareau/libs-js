import {ComponentType} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';

const DialogBox: ComponentType<DialogBoxProps> = withStyles({
    paper: {
        borderRadius: 0,
    }
})(Dialog);

export interface DialogBoxProps extends DialogProps {}

export default DialogBox