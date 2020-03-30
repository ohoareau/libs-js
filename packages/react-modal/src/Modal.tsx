import React, {ComponentType} from 'react';
import {withTranslation} from 'react-i18next';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DialogBox from './DialogBox';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Transition from './Transition';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import {CircularProgress} from "@material-ui/core";

const tKeys = (k, p) => p ? [`${p}_${k}`, k] : [k];

// noinspection TypeScriptValidateJSTypes
const Modal: ComponentType<ModalProps> = withStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: (props: ModalProps) => props.disableEscapeKeyDown ? 'unset' : theme.spacing(2),
        flex: 1,
    },
}))(withTranslation()(({classes = {}, t = () => {}, disableEscapeKeyDown = false, name = 'modal', i18nPrefix, noTitle = false, mode = 'dialog', open = true, onClose, onCancel, onSubmit, children, loading = false, isSubmittable = true, cancelLabel = undefined, submitLabel = undefined}: ModalProps) => {
    const title = t([...tKeys('title', i18nPrefix), name.replace(/_/g, ' ')]);
    const description = t([...tKeys('description', i18nPrefix), '']);
    return (
        <DialogBox disableEscapeKeyDown={disableEscapeKeyDown} {...(mode === 'fullscreen' ? {fullScreen: true, TransitionComponent: Transition} : {})}
                   fullWidth={true} open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            {mode === 'fullscreen' && (
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        {!disableEscapeKeyDown && (
                            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        )}
                        <Typography variant="h6" className={classes.title}>{title}</Typography>
                    </Toolbar>
                </AppBar>
            )}
            {(mode !== 'fullscreen' && !noTitle) && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
            <DialogContent>
                {!!description && <DialogContentText>{description}</DialogContentText>}
                {children}
            </DialogContent>
            {(!!onSubmit || !!onCancel) && (
                <DialogActions>
                    {!!onSubmit && (
                        <>
                            <Button disabled={loading} onClick={onCancel} color="primary">{cancelLabel || t(tKeys('buttons_cancel_label', i18nPrefix))}</Button>
                            <Button startIcon={loading ? <CircularProgress size={20} color={'inherit'} /> : null} disabled={loading || !isSubmittable} variant={'contained'} type={'submit'} onClick={onSubmit} color="primary">
                                {submitLabel || t(tKeys('buttons_submit_label', i18nPrefix))}
                            </Button>
                        </>
                    )}
                    {!onSubmit && (
                        <>
                            <Button startIcon={loading ? <CircularProgress size={20} color={'inherit'} /> : null} disabled={loading} variant={'contained'} onClick={onCancel} color="secondary">{cancelLabel || t(tKeys('buttons_cancel_label', i18nPrefix))}</Button>
                        </>
                    )}
                </DialogActions>
            )}
        </DialogBox>
    );
}));

export interface ModalProps {
    classes?: {[key: string]: any},
    t?: Function,
    disableEscapeKeyDown?: boolean,
    name?: string,
    i18nPrefix?: string,
    noTitle?: boolean,
    mode?: 'dialog' | 'fullscreen',
    open?: boolean,
    onClose?: any,
    onCancel?: any,
    onSubmit?: any,
    children?: any,
    loading?: boolean,
    isSubmittable?: boolean,
    cancelLabel?: string,
    submitLabel?: string,
}

export default Modal