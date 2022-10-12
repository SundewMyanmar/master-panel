import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';

import MfaApi from '../../api/MfaApi';
import { APP_NAME } from '../../config/Constant';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch, useSelector } from 'react-redux';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { OTPDialog, TextInput } from '../../fragment/control';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(3),
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
        marginLeft: theme.spacing(1),
    },
    qrImage: {
        cursor: 'pointer',
        position: 'relative',
        border: '3px solid ' + theme.palette.primary.light,
        display: 'inline-flex',
        width: 128,
        height: 128,
        margin: theme.spacing(2, 1),
    },
    radioContent: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
    },
    actions: {
        paddingTop: theme.spacing(2),
    },
}));

const MultiFactorAuthDetail = () => {
    const classes = styles();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [mfa, setMfa] = React.useState({
        type: '',
        email: '',
        phoneNumber: '',
        isMain: false,
    });
    const [showOtp, setShowOtp] = React.useState(false);

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleMfaChange = (key, value) => {
        let changedData = { ...mfa };
        if (key === 'type') {
            changedData.key = '';
        }
        setMfa({
            ...changedData,
            [key]: value,
        });
    };

    const buildMfa = () => {
        let key = '';
        if (mfa.type == 'EMAIL') {
            key = mfa.email || user.email;
        } else if (mfa.type == 'SMS') {
            key = mfa.phoneNumber || user.phoneNumber;
        }

        if (mfa.type != 'APP' && (key == null || key.length <= 0)) {
            handleError('Invalid MFA verification input.');
            return;
        }
        return {
            key: key,
            totp: true,
        };
    };

    const handleOtpSubmit = (code) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (!code) {
            handleError('Please fill code.');
            return;
        }

        setShowOtp(false);
        const mfa = buildMfa();
        MfaApi.verify(code, mfa.type === 'APP' ? null : mfa.key)
            .then((result) => {
                dispatch({ type: USER_REDUX_ACTIONS.UPDATE, profile: { ...user, mfa: mfa } });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: '2-step verification setup is success!' },
                });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                history.goBack();
            })
            .catch(handleError);
    };

    const handleSetup = () => {
        if (!['EMAIL', 'SMS', 'APP'].includes(mfa.type)) {
            handleError('Please choose verification type.');
            return;
        }

        if (mfa.type === 'APP') {
            setShowOtp(true);
            return;
        }

        let key = '';
        if (mfa.type == 'EMAIL') {
            key = mfa.email || user.email;
        } else if (mfa.type == 'SMS') {
            key = mfa.phoneNumber || user.phoneNumber;
        }

        if (mfa.type != 'APP' && (key == null || key.length <= 0)) {
            handleError('Invalid MFA verification input.');
            return;
        }
        const data = {
            mfaKey: mfa.type == 'APP' ? APP_NAME : key,
            totp: true,
            main: true,
        };

        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        MfaApi.setup(data)
            .then((resp) => {
                setShowOtp(true);
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
            })
            .catch(handleError);
    };

    const handleSubmit = (event, form) => {};
    const mfaKey = mfa.type === 'SMS' ? mfa.phoneNumber : mfa.email;

    return (
        <Container component="main" maxWidth="sm">
            <OTPDialog
                show={showOtp}
                userId={user.id}
                mfaKey={mfa.type === 'APP' ? null : mfaKey}
                onClose={() => setShowOtp(false)}
                onSubmit={handleOtpSubmit}
            />
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <Icon>vpn_key</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    2-Step Verification
                </Typography>
                <Grid style={{ width: '100%' }}>
                    <RadioGroup aria-label="Type" name="mfaType" value={mfa.type} onChange={(event) => handleMfaChange('type', event.target.value)}>
                        <FormControlLabel value="APP" control={<Radio color="primary" />} label="Authenticator app" />
                        {mfa.type === 'APP' ? (
                            <Grid className={classes.radioContent} color="primary" item>
                                <Typography variant="overline" gutterBottom>
                                    <ul>
                                        <li>Get the authenticator app from store.</li>
                                        <li>In the App select Set up account.</li>
                                        <li>Choose scan a barcode.</li>
                                        <li>Enter the 6-digit code you see in the app and verify.</li>
                                    </ul>
                                </Typography>

                                <img className={classes.qrImage} src={MfaApi.appQrLink()} />
                            </Grid>
                        ) : null}

                        <FormControlLabel value="EMAIL" control={<Radio color="primary" />} label="Email" />
                        {mfa.type === 'EMAIL' ? (
                            <Grid className={classes.radioContent} color="primary" item>
                                <TextInput
                                    id="mfaEmail"
                                    label="Verification Email"
                                    type="email"
                                    icon="email"
                                    value={mfa.email}
                                    onChange={(event) => handleMfaChange('email', event.target.value)}
                                />
                            </Grid>
                        ) : null}

                        <FormControlLabel value="SMS" control={<Radio color="primary" />} label="SMS Message" />
                        {mfa.type === 'SMS' ? (
                            <Grid className={classes.radioContent} color="primary" item>
                                <TextInput
                                    id="mfaPhone"
                                    label="Verification Phone"
                                    type="phone"
                                    icon="sms"
                                    value={mfa.phoneNumber}
                                    onChange={(event) => handleMfaChange('phoneNumber', event.target.value)}
                                />
                            </Grid>
                        ) : null}
                    </RadioGroup>
                    <Grid className={classes.actions} container justifyContent="flex-end">
                        <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                            <Icon>arrow_back</Icon> Go back
                        </Button>
                        <Button onClick={handleSetup} type="button" variant="contained" color="primary" className={classes.submit}>
                            <Icon>save</Icon> Setup
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default withRouter(MultiFactorAuthDetail);
