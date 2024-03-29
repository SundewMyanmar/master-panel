import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    InputAdornment,
    Tooltip,
    IconButton,
    Icon,
    Grid,
    makeStyles,
    Button,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import TextInput from './TextInput';
import Transition from './Transition';
import MasterForm from '../MasterForm';
import type { DialogProps } from '@material-ui/core';

export interface FolderDialogProps extends DialogProps {
    data: string;
    show: boolean;
    onShow: () => void;
    onSubmit: () => void;
}

const styles = makeStyles((theme) => ({
    title: {
        color: theme.palette.text.primary,
    },
}));

const FolderDialog = (props: FolderDialogProps) => {
    const { data, show, onShow, onSubmit, ...rest } = props;
    const classes = styles();

    const handleOnShow = (isShow) => {
        if (onShow) onShow(isShow);
    };

    const handleOnSubmit = (form) => {
        let result = {
            ...data,
            ...form,
        };
        if (onSubmit)
            onSubmit({
                icon: result.icon || 'folder',
                ...result,
            });
    };

    const fields = [
        {
            id: 'name',
            label: 'Name',
            icon: 'create',
            required: true,
            type: 'text',
            autoFocus: true,
            value: data.name || 'New Folder',
        },
        {
            id: 'color',
            label: 'Color',
            icon: 'format_color_fill',
            required: true,
            type: 'color',
            value: data.color || '#000',
        },
        {
            id: 'icon',
            label: 'Icon',
            required: true,
            type: 'icon',
            value: data.icon || 'folder',
        },
        {
            id: 'priority',
            label: 'Priority',
            icon: 'sort',
            type: 'number',
            value: data.priority ? data.priority.toString() : '0', //Don't display zero value
        },
    ];

    return (
        <Dialog maxWidth="xs" fullWidth={true} open={show} onClose={() => handleOnShow(false)} TransitionComponent={Transition} {...rest}>
            <DialogTitle>
                <Grid container>
                    <Grid container item lg={11} md={11} sm={11} xs={11} alignItems="center" justifyContent="flex-start">
                        <Typography className={classes.title} variant="h6" component="h1" noWrap>
                            Folder
                        </Typography>
                    </Grid>
                    <Grid container item lg={1} md={1} sm={1} xs={1} alignItems="center" justifyContent="flex-end">
                        <Tooltip title="Close Dialog">
                            <IconButton className={classes.title} size="small" color="primary" onClick={() => handleOnShow(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <MasterForm fields={fields} onSubmit={(event, form) => handleOnSubmit(form)}>
                    <Button type="submit" fullWidth style={{ marginTop: 8, marginBottom: 8 }} color="primary" variant="contained" aria-label="save">
                        Save
                    </Button>
                </MasterForm>
            </DialogContent>
        </Dialog>
    );
};

export default FolderDialog;
