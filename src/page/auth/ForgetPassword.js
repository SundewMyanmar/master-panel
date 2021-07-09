import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Paper, Container, CssBaseline, Avatar, Icon, Grid, Button, Link, Box, makeStyles } from '@material-ui/core';

import Copyright from '../../fragment/control/Copyright';
import MasterForm from '../../fragment/MasterForm';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS } from '../../config/Constant';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.active,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    loginWith: {
        margin: theme.spacing(1, 0),
    },
    logoImage: {
        height: theme.spacing(3),
        marginRight: theme.spacing(2),
    },
}));

const ForgetPassword = () => {
    const classes = styles();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        const callbackUrl = window.location.origin + '/auth/resetPassword';

        AuthApi.forgetPassword({ ...form, callback: callbackUrl })
            .then((data) => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: data.message },
                });
                history.push('/login');
            })
            .catch((error) => {
                handleError(error);
            });
    };

    const forgetPasswordFields = [
        {
            id: 'phoneNumber',
            label: 'Phone number',
            icon: 'phone',
            required: true,
            type: 'text',
        },
        {
            id: 'email',
            label: 'E-mail',
            required: true,
            type: 'email',
        },
    ];

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>dialpad</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forget Password
                    </Typography>
                    <MasterForm fields={forgetPasswordFields} onSubmit={handleSubmit}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Request OTP
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" color="textSecondary" variant="body2">
                                    Remember your password?
                                </Link>
                            </Grid>
                        </Grid>
                    </MasterForm>
                </Paper>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(ForgetPassword);
