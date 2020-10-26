import React, { useState, createRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, CssBaseline, Avatar, Grid, Button, Link, Box, MuiThemeProvider, makeStyles } from '@material-ui/core';

import Copyright from '../../fragment/control/Copyright';
import { AlertDialog, LoadingDialog, Notification } from '../../fragment/message';
import AuthApi from '../../api/AuthApi';
import { STORAGE_KEYS, FACEBOOK } from '../../config/Constant';
import MasterForm from '../../fragment/MasterForm';
import { FacebookTheme } from '../../config/Theme';

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
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.contrastText,
        border: '2px solid ' + theme.palette.secondary.main,
        width: 150,
        height: 150,
    },
    image: {
        width: 120,
        height: 120,
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

const Login = props => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noti, setNoti] = useState(() => {
        const flashMessage = sessionStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
        return flashMessage || '';
    });

    const submitButton = createRef();

    const classes = styles();

    const handleError = error => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const handleSubmit = (event, form) => {
        // if (!window.navigator.onLine) {
        //     setError('Please check your internet connection and try again.');
        //     return;
        // }
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
            <Notification show={noti ? true : false} onClose={() => setNoti(false)} type="success" title="Welcome" message={noti.message} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />

            <Container component="main" maxWidth="xs">
                <Box className={classes.container} boxShadow={2}>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            {/* <Icon>lock_out_lined_icon</Icon> */}
                            <img src="/images/logo.png" className={classes.image} />
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
                                <Link href="/#/auth/forgetPassword" color="textSecondary" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/#/auth/register" color="textSecondary" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
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
