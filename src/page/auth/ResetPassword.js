import React from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Button, Box, makeStyles } from '@material-ui/core';

import { Copyright } from '../../fragment/control';
import MasterForm from '../../fragment/MasterForm';
import AuthApi from '../../api/AuthApi';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

const styles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.paper,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingBottom: theme.spacing(0.5),
        marginBottom: theme.spacing(4),
        borderRadius: 4,
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    },
    paper: {
        paddingTop: theme.spacing(2),
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
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

const ResetPassword = () => {
    const classes = styles();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const query = new URLSearchParams(location.search);
    const token = query.get('token') || 'Invalid Token';
    const user = query.get('user') || 'Unknown';

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
        const requestData = {
            user: user,
            oldPassword: token,
            newPassword: form.password,
        };

        AuthApi.resetPassword(requestData)
            .then((data) => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: `Welcome ${data.displayName}.` },
                });
                history.push('/login');
            })
            .catch((error) => {
                handleError(error);
            });
    };

    const resetPasswordFields = [
        {
            id: 'user',
            label: 'User Info',
            icon: 'account_circle',
            disabled: true,
            type: 'text',
            value: user,
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
                <Box className={classes.container} boxShadow={2}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <Icon>vpn_key</Icon>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        <MasterForm fields={resetPasswordFields} onSubmit={handleSubmit}>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                Reset Now
                            </Button>
                        </MasterForm>
                    </div>
                </Box>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(ResetPassword);
