import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Zoom,
    Icon,
    ThemeProvider,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { AlertDialog, LoadingDialog } from '.';

export default function Alert(props: AlertDialogProps) {
    const alert = useSelector((state) => state.alert);
    const flash = useSelector((state) => state.flash);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
    };

    if (alert.type && alert.type === 'loading') {
        return <LoadingDialog show={alert.show} message={alert.title || alert.message} />;
    }

    return <AlertDialog show={alert.show} title={alert.title} message={alert.message} onClose={handleClose} />;
}
