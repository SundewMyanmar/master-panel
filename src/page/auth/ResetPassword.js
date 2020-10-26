import React, { useState } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Button, Box, makeStyles } from '@material-ui/core';

import { Copyright } from '../../fragment/control';
import MasterForm from '../../fragment/MasterForm';
import { AlertDialog, LoadingDialog } from '../../fragment/message';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS } from '../../config/Constant';

const styles = makeStyles(theme => ({
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

const ResetPassword = props => {
    const classes = styles();
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);
    const token = query.get('token') || 'Invalid Token';
    const user = query.get('user') || 'Unknown';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);
        const requestData = {
            user: user,
            oldPassword: token,
            newPassword: form.password,
        };

        AuthApi.resetPassword(requestData)
            .then(data => {
                setLoading(false);
                sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, `Welcome ${data.displayName}.`);
                history.push('/login');
            })
            .catch(error => {
                setLoading(false);
                setError(error.message || error.title || 'Please check your internet connection and try again.');
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
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="xs">
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
