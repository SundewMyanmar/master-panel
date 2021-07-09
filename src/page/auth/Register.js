import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Grid, Button, Link, Box, Paper, makeStyles } from '@material-ui/core';

import { Copyright } from '../../fragment/control';
import AuthApi from '../../api/AuthApi';
import MasterForm from '../../fragment/MasterForm';
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

const Register = () => {
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

        const userData = {
            displayName: form.displayName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            password: form.password,
        };

        AuthApi.register(userData)
            .then(() => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: 'Register success! Please log in to continue.' },
                });
                history.push('/login');
            })
            .catch((error) => {
                handleError(error);
            });
    };

    const registerFields = [
        {
            id: 'displayName',
            label: 'Full Name',
            icon: 'face',
            required: true,
            type: 'text',
        },
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
        {
            id: 'password',
            label: 'Password',
            required: true,
            type: 'password',
        },
        {
            id: 'confirmPassword',
            label: 'Confirm Password',
            required: true,
            type: 'password',
            onValidate: (event, form) => (form.password !== event.target.value ? "Password and Confirm Password doesn't match." : ''),
        },
    ];

    return (
        <>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>description</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registration Form
                    </Typography>
                    <MasterForm fields={registerFields} onSubmit={handleSubmit}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Register Now
                        </Button>
                    </MasterForm>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" color="textSecondary" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(Register);
