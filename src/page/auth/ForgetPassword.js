import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Grid, Button, Link, Box, makeStyles } from '@material-ui/core';

import Copyright from '../../fragment/control/Copyright';
import MasterForm from '../../fragment/MasterForm';
import AuthApi from '../../api/AuthApi';
import { AlertDialog, LoadingDialog } from '../../fragment/message';

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

const ForgetPassword = props => {
    const classes = styles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);
        const callbackUrl = window.location.origin + '/auth/resetPassword';

        AuthApi.forgetPassword({ ...form, callback: callbackUrl })
            .then(data => {
                setLoading(false);
                history.push('/login?messageType=info&message=' + data.message);
            })
            .catch(error => {
                setLoading(false);
                setError(error.message || error.title || 'Please check your internet connection and try again.');
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
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
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
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/#/login" variant="body2">
                                    Remember your password? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </MasterForm>
                </div>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(ForgetPassword);
