import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom, Icon } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

export type AlertDialogProps = {
    show: boolean,
    title: string,
    message: string,
    onClose: () => void,
};

export default function AlertDialog(props: AlertDialogProps) {
    const { title, message, onClose, show } = props;
    return (
        <Dialog maxWidth="sm" open={show} onEscapeKeyDown={onClose} TransitionComponent={Transition}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    <Icon>done</Icon> Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AlertDialog.defaultProps = {
    onClose: () => console.warn('Undefined onClose'),
};
