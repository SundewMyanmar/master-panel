import React, { useState, createRef } from 'react';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Icon, Grid, Button, Link, Box, MuiThemeProvider, makeStyles } from '@material-ui/core';

import Copyright from '../../fragment/control/Copyright';
import { AlertDialog, LoadingDialog, Notification } from '../../fragment/message';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS, FACEBOOK } from '../../config/Constant';
import MasterForm from '../../fragment/MasterForm';
import { FacebookTheme } from '../../config/Theme';

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
    fbLoginButton: {},
}));

const loginFields = [
    {
        id: 'user',
        label: 'User',
        icon: 'account_circle',
        required: true,
        type: 'text',
    },
    {
        id: 'password',
        label: 'Password',
        required: true,
        type: 'password',
    },
];

const Login = props => {
    const location = useLocation();
    const history = useHistory();

    const query = new URLSearchParams(location.search);
    const message = query.get('message');
    const messageType = query.get('messageType') || 'info';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noti, setNoti] = useState(message ? { type: messageType, message: message } : false);

    const submitButton = createRef();

    const classes = styles();

    const handleError = error => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);
        AuthApi.authByUserAndPassword(form)
            .then(data => {
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));
                history.push('/');
            })
            .catch(handleError);
    };

    const facebookLogin = () => {
        if (!FACEBOOK.LOGIN) {
            return null;
        }

        return (
            <>
                <MuiThemeProvider theme={FacebookTheme}>
                    <Button fullWidth variant="contained" color="primary" className={classes.loginWith}>
                        <img className={classes.logoImage} src="images/facebook.png" alt="Facebook" /> Login with Facebook
                    </Button>
                </MuiThemeProvider>
                <Typography color="textSecondary" variant="body2" align="center">
                    Or Login with user and password.
                </Typography>
            </>
        );
    };

    return (
        <>
            <Notification show={noti ? true : false} onClose={() => setNoti(false)} type={noti.type} title={noti.type} message={noti.message} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Icon>lock_out_lined_icon</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    {facebookLogin()}
                    <MasterForm fields={loginFields} onSubmit={handleSubmit}>
                        <Button type="submit" ref={submitButton} fullWidth variant="contained" color="primary" className={classes.submit}>
                            Sign In
                        </Button>
                    </MasterForm>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/#/auth/forgetPassword" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/#/auth/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </div>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(Login);
