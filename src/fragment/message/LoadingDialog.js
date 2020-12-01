import React from 'react';
import { Dialog, DialogContent, DialogContentText, CircularProgress, makeStyles, Zoom } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

const loadingStyle = makeStyles(theme => ({
    progress: {
        display: 'block',
        textAlign: 'center',
        margin: theme.spacing(2),
    },
}));

export type LoadingDialogProps = {
    show: boolean,
    message?: string,
};

export default function LoadingDialog(props: LoadingDialogProps) {
    const classes = loadingStyle();
    const { message, show } = props;
    return (
        <div>
            <Dialog maxWidth="sm" open={show} TransitionComponent={Transition}>
                <DialogContent>
                    <div className={classes.progress}>
                        <CircularProgress />
                    </div>
                    <DialogContentText id="loading-dialog-description">{message}</DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

LoadingDialog.defaultProps = {
    message: 'Please wait ...',
};
