import React from 'react';
import { Dialog, DialogContent, DialogContentText, CircularProgress, makeStyles, Zoom } from '@material-ui/core';
import Transition from '../control/Transition';
import type { DialogProps } from '@material-ui/core';

const loadingStyle = makeStyles((theme) => ({
    progress: {
        display: 'block',
        textAlign: 'center',
        margin: theme.spacing(2),
    },
}));

export interface LoadingDialogProps extends DialogProps {
    show: boolean;
    message?: string;
}

export default function LoadingDialog(props: LoadingDialogProps) {
    const classes = loadingStyle();
    const { message, show, ...rest } = props;
    return (
        <Dialog maxWidth="sm" open={show} TransitionComponent={Transition} {...rest}>
            <DialogContent>
                <div className={classes.progress}>
                    <CircularProgress color="inherit" />
                </div>
                <DialogContentText color="inherit" id="loading-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

LoadingDialog.defaultProps = {
    message: 'Please wait ...',
};
