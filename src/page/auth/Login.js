import React, { useState, createRef, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Grid, Button, Link, Box, ThemeProvider, makeStyles } from '@material-ui/core';
import { isSafari } from 'react-device-detect';
import Copyright from '../../fragment/control/Copyright';
import { AlertDialog, LoadingDialog, Notification } from '../../fragment/message';
import { OTPDialog } from '../../fragment/control';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS, FACEBOOK, FCM_CONFIG, VAPID_KEY } from '../../config/Constant';
import MasterForm from '../../fragment/MasterForm';
import { FacebookTheme } from '../../config/Theme';
import firebase from 'firebase/app';

let FIREBASE_MESSAGING = null;

if (!isSafari && FCM_CONFIG) {
    if (!firebase.apps.length) {
        console.log('! safari INIT');
        firebase.initializeApp(FCM_CONFIG);
    }
    FIREBASE_MESSAGING = firebase.messaging();
}

const styles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.background.paper,
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        paddingBottom: theme.spacing(0.5),
        marginBottom: theme.spacing(4),
        borderRadius: 4,
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    },
    paper: {
        paddingTop: theme.spacing(3),
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.contrastText,
        border: '2px solid ' + theme.palette.secondary.main,
        width: 100,
        height: 100,
    },
    image: {
        width: 96,
        height: 96,
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
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

const Login = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noti, setNoti] = useState(() => {
        const flashMessage = sessionStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
        return flashMessage || '';
    });
    const [showMfa, setShowMfa] = useState(false);
    const submitButton = createRef();
    const [data, setData] = useState(null);

    const classes = styles();

    useEffect(() => {
        if (FIREBASE_MESSAGING && !isSafari && !localStorage.getItem(STORAGE_KEYS.FCM_TOKEN)) {
            FIREBASE_MESSAGING.getToken({ vapidKey: VAPID_KEY }).then((payload) => {
                console.log('FCM payload', payload);
                localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, payload);
            });
        }
    }, []);

    const handleError = (error) => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleMfaSubmit = (code) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);

        let firebaseToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
        if (firebaseToken) data.firebaseMessagingToken = firebaseToken;

        AuthApi.authByUserAndPasswordAndMfa({
            ...data,
            mfa: code,
        })
            .then((result) => {
                setShowMfa(false);
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result));
                history.push('/');
                setLoading(false);
            })
            .catch(handleError);
    };
    const handleMfaResend = () => {
        handleSubmit(null, data);
    };

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);

        let firebaseToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
        if (firebaseToken) form.firebaseMessagingToken = firebaseToken;

        AuthApi.authByUserAndPassword(form)
            .then((result) => {
                console.log('auth data', result);
                if (result.currentToken) {
                    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(result));
                    history.push('/');
                } else {
                    setShowMfa(true);
                    setLoading(false);
                }
            })
            .catch(handleError);
    };

    const facebookLogin = () => {
        if (!FACEBOOK.LOGIN) {
            return null;
        }

        return (
            <>
                <ThemeProvider theme={FacebookTheme}>
                    <Button fullWidth variant="contained" color="primary" className={classes.loginWith}>
                        <img className={classes.logoImage} src="images/facebook.png" alt="Facebook" /> Login with Facebook
                    </Button>
                </ThemeProvider>
                <Typography color="textSecondary" variant="body2" align="center">
                    Or Login with user and password.
                </Typography>
            </>
        );
    };

    return (
        <>
            <Notification show={noti ? true : false} onClose={() => setNoti(false)} type="success" title="Welcome" message={noti.message} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />

            <Container component="main" maxWidth="sm">
                <Box className={classes.container} boxShadow={2}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <img src="/images/logo.png" className={classes.image} />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Welcome
                        </Typography>
                        <OTPDialog show={showMfa} onShow={setShowMfa} onSubmit={handleMfaSubmit} onResend={handleMfaResend}></OTPDialog>
                        {facebookLogin()}
                        <MasterForm fields={loginFields} onChange={handleChange} onSubmit={handleSubmit}>
                            <Button type="submit" ref={submitButton} fullWidth variant="contained" color="primary" className={classes.submit}>
                                Sign In
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/#/auth/forgetPassword" color="textSecondary" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                            </Grid>
                        </MasterForm>
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="/#/auth/forgetPassword" color="textSecondary" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/#/auth/register" color="textSecondary" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                    </div>
                </Box>
                <Box>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default withRouter(Login);
