/* @flow */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Typography, makeStyles, Icon, Tooltip, IconButton } from '@material-ui/core';
import Transition from '../control/Transition';
import FileManager from './FileManager';
import type { DialogProps } from '@material-ui/core';

export interface FileManagerPickerProps extends DialogProps {
    show: boolean;
    title?: string;
    guild: string;
    readOnly: boolean;
    onClose: (result: object | Array<Object>) => void;
}

const styles = makeStyles((theme) => ({
    content: {
        backgroundColor: theme.palette.background.paper,
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(1),
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
}));

const FileManagerPicker = (props: FileManagerPickerProps) => {
    const classes = styles();
    const { title, guild, readOnly, show, onClose, ...rest } = props;

    const handleClick = (item) => {
        onClose(item);
    };

    return (
        <>
            <Dialog fullWidth maxWidth="lg" onClose={() => onClose(false)} open={show} TransitionComponent={Transition} {...rest}>
                <DialogTitle className={classes.header}>
                    <Grid container>
                        <Grid container item lg={4} md={4} sm={12} xs={12} alignItems="center" justifyContent="flex-start">
                            <Typography color="inherit" variant="h6" component="h1" noWrap>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            item
                            lg={4}
                            md={4}
                            sm={8}
                            xs={12}
                            alignItems="center"
                            justifyContent="center"
                            alignContent="flex-start"
                        ></Grid>
                        <Grid container item lg={4} md={4} sm={4} xs={12} alignItems="center" justifyContent="flex-end">
                            <Tooltip title="Close Dialog">
                                <IconButton color="inherit" size="small" onClick={() => onClose(false)} aria-label="Close">
                                    <Icon>close</Icon>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <FileManager guild={guild} readOnly={readOnly} onFileClick={handleClick}></FileManager>
                </DialogContent>
            </Dialog>
        </>
    );
};

FileManagerPicker.defaultProps = {
    title: 'File Browser',
    guild: '',
    readOnly: true,
};

export default FileManagerPicker;
