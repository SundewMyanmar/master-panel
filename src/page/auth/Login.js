import React, { useState, createRef, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Grid, Button, Link, Box, ThemeProvider, makeStyles } from '@material-ui/core';
import { isSafari } from 'react-device-detect';
import Copyright from '../../fragment/control/Copyright';
import { OTPDialog } from '../../fragment/control';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS, FACEBOOK, FCM_CONFIG, VAPID_KEY } from '../../config/Constant';
import MasterForm from '../../fragment/MasterForm';
import { FacebookTheme } from '../../config/Theme';
import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';

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
    const [showMfa, setShowMfa] = useState(false);
    const submitButton = createRef();
    const [mfaInfo, setMfaInfo] = useState(null);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();

    const classes = styles();

    useEffect(() => {
        if (FIREBASE_MESSAGING && !isSafari && !localStorage.getItem(STORAGE_KEYS.FCM_TOKEN)) {
            FIREBASE_MESSAGING.getToken({ vapidKey: VAPID_KEY }).then((payload) => {
                console.log('FCM payload', payload);
                localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, payload);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (code = null) => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        let firebaseToken = localStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
        if (firebaseToken) data.firebaseMessagingToken = firebaseToken;

        let authData = { ...data };
        if (code) {
            authData.mfaCode = code;
            authData.mfaKey = mfaInfo?.mfaKey;
        }

        AuthApi.authByUserAndPassword(authData)
            .then((result) => {
                if (result.currentToken) {
                    dispatch({
                        type: USER_REDUX_ACTIONS.LOGIN,
                        authInfo: result,
                    });
                    history.push('/');
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                } else if (result.mfa) {
                    setShowMfa(true);
                    setMfaInfo({ ...result.mfa, userId: result.id });
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
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
                        <OTPDialog
                            userId={mfaInfo?.userId}
                            mfaKey={mfaInfo && mfaInfo.type !== 'APP' ? mfaInfo?.mfaKey : null}
                            mfa={mfaInfo}
                            show={showMfa}
                            onClose={() => setShowMfa(false)}
                            onSubmit={handleSubmit}
                        ></OTPDialog>
                        {facebookLogin()}
                        <MasterForm fields={loginFields} onChange={handleChange} onSubmit={(event, form) => handleSubmit()}>
                            <Button type="submit" ref={submitButton} fullWidth variant="contained" color="primary" className={classes.submit}>
                                Sign In
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/auth/forgetPassword" color="textSecondary" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                            </Grid>
                        </MasterForm>
                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="/auth/forgetPassword" color="textSecondary" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/auth/register" color="textSecondary" variant="body2">
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
