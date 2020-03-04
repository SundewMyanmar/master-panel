import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

export type QuestionDialogProps = {
    show: boolean,
    title: string,
    message: string,
    onClose(result: boolean): ?Function,
};

export default function QuestionDialog(props: QuestionDialogProps) {
    const { show, title, message, onClose } = props;
    return (
        <Dialog onEscapeKeyDown={() => onClose(false)} open={show} maxWidth="sm" TransitionComponent={Transition}>
            <DialogTitle id="question-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(true)} variant="contained" color="primary">
                    Ok
                </Button>
                <Button onClick={() => onClose(false)} variant="contained" color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

QuestionDialog.defaultProps = {
    onClose: result => console.warn('Undefined onClose => ', result),
};
