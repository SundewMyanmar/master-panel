import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom, Icon } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

export type QuestionDialogProps = {
    show: boolean,
    title: string,
    message: string,
    onClose: (result: boolean) => void,
};

export default function QuestionDialog(props: QuestionDialogProps) {
    let { show, title, message, onClose } = props;
    if (!FormatManager.defaultNull(show)) {
        show = false;
    }

    return (
        <Dialog onEscapeKeyDown={() => onClose(false)} open={show} maxWidth="sm" TransitionComponent={Transition}>
            <DialogTitle id="question-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(true)} variant="contained" color="primary">
                    <Icon>done</Icon> Ok
                </Button>
                <Button onClick={() => onClose(false)} variant="contained" color="default">
                    <Icon>close</Icon> Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

QuestionDialog.defaultProps = {
    onClose: result => console.warn('Undefined onClose => ', result),
};
