import React, { useState } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Button, Box, makeStyles } from '@material-ui/core';

import { Copyright } from '../../fragment/control';
import MasterForm from '../../fragment/MasterForm';
import { AlertDialog, LoadingDialog } from '../../fragment/message';
import AuthApi from '../../api/AuthApi';

const styles = makeStyles(theme => ({
    paper: {
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
                history.push('/login?messageType=success&message=Welcome ' + data.displayName);
            })
            .catch(error => {
                setLoading(false);
                setError(error.message || 'Please check your internet connection and try again.');
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
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(ResetPassword);
