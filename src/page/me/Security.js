import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import {
    Typography,
    Container,
    CssBaseline,
    Paper,
    Avatar,
    Icon,
    Button,
    makeStyles,
    Chip,
    RadioGroup,
    Radio,
    FormControl,
    FormControlLabel,
    Grid,
} from '@material-ui/core';
import { OTPDialog } from '../../fragment/control';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { AlertDialog, LoadingDialog } from '../../fragment/message';
import MasterForm from '../../fragment/MasterForm';
import ProfileApi from '../../api/ProfileApi';
import { APP_NAME, STORAGE_KEYS } from '../../config/Constant';

const styles = makeStyles((theme) => ({
    root: {
        width: '100%',
        margin: theme.spacing(3),
    },
    image: {
        cursor: 'pointer',
        position: 'relative',
        border: '3px solid ' + theme.palette.primary.light,
        display: 'inline-flex',
        width: 128,
        height: 128,
        margin: theme.spacing(2, 1),
    },
    expansionIcon: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    chipIcon: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    radioContent: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
    },
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
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 1, 2, 0),
    },
    loginWith: {
        margin: theme.spacing(1, 0),
    },
    logoImage: {
        height: theme.spacing(3),
        marginRight: theme.spacing(2),
    },
}));

const changePasswordFields = [
    {
        id: 'oldPassword',
        label: 'Old Password',
        required: true,
        type: 'password',
    },
    {
        id: 'newPassword',
        label: 'New Password',
        required: true,
        type: 'password',
    },
    {
        id: 'confirmPassword',
        label: 'Confirm Password',
        required: true,
        type: 'password',
        onValidate: (event, form) => (form.newPassword !== event.target.value ? "Password and Confirm Password doesn't match." : ''),
    },
];

const Security = () => {
    const classes = styles();
    const history = useHistory();
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = React.useState('changePassword');
    const [mfa, setMfa] = React.useState(user);
    const [showMfa, setShowMfa] = React.useState(false);

    const handleAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handlePwdSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }
        setLoading(true);

        const data = {
            newPassword: form.newPassword,
            oldPassword: form.oldPassword,
            user: user.email || user.phoneNumber,
        };

        ProfileApi.changePassword(data)
            .then(() => {
                sessionStorage.clear();
                sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, 'Password has changed! Please log in with new password.');
                history.push('/login');
            })
            .catch((error) => {
                setLoading(false);
                setError(error.message || error.title || 'Please check your internet connection and try again.');
            });
    };

    const handleMfaChange = (event) => {
        setMfa({
            ...mfa,
            mfaType: event.target.value,
        });
    };

    const handleMfaSubmit = (code) => {
        setLoading(true);
        ProfileApi.verifyMfa(code)
            .then(() => {
                setShowMfa(false);
                sessionStorage.clear();
                sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, '2-step verification setup is success! Please log in again.');
                history.push('/login');
            })
            .catch(() => {
                setError('Please check your internet connection and try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleMfaResend = () => {
        ProfileApi.resendMfa();
    };

    const handleMfaConfirm = (value) => {
        if (value) {
            if (!['EMAIL', 'SMS', 'APP'].includes(mfa.mfaType)) {
                setError('Please choose verification type.');
                return;
            }
            if (mfa.mfaType == 'Email' && !mfa.email) {
                setError('You have not setup your email yet.');
                return;
            }
            if (mfa.mfaType == 'SMS' && !mfa.phoneNumber) {
                setError('You have not setup your phone yet.');
                return;
            }
        }

        setLoading(true);
        ProfileApi.setupMfa(value, mfa.mfaType)
            .then(() => {
                if (value) {
                    setShowMfa(true);
                } else {
                    setMfa({
                        ...mfa,
                        mfaEnabled: false,
                    });
                }
            })
            .catch(() => {
                setError('Please check your internet connection and try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderMfaDialog = () => {
        return <OTPDialog type={mfa.mfaType} show={showMfa} onShow={setShowMfa} onSubmit={handleMfaSubmit} onResend={handleMfaResend}></OTPDialog>;
    };

    const renderMfa = () => {
        console.log('mfa ', mfa);
        return (
            <Accordion expanded={expanded === 'twoFactor'} onChange={handleAccordion('twoFactor')}>
                <AccordionSummary expandIcon={<Icon color="primary">expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
                    <Icon className={classes.expansionIcon}>phonelink_lock</Icon>
                    <Typography className={classes.heading}>2-Step Verification</Typography>
                    <Chip
                        className={classes.expansionIcon}
                        color={mfa.mfaEnabled ? 'secondary' : 'primary'}
                        size="small"
                        label={mfa.mfaEnabled ? 'On' : 'Off'}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    <form style={{ width: '100%' }}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1" value={mfa.mfaType} onChange={handleMfaChange}>
                                <FormControlLabel value="EMAIL" control={<Radio color="primary" />} label="Email" />
                                <Typography
                                    style={{ display: mfa.mfaType == 'EMAIL' ? 'block' : 'none' }}
                                    color="primary"
                                    className={classes.radioContent}
                                    variant="overline"
                                    gutterBottom
                                >
                                    Verification codes will send Email to `{mfa.email}`.
                                </Typography>

                                <FormControlLabel value="SMS" control={<Radio color="primary" />} label="SMS Message" />
                                <Typography
                                    style={{ display: mfa.mfaType == 'SMS' ? 'block' : 'none' }}
                                    color="primary"
                                    className={classes.radioContent}
                                    variant="overline"
                                    gutterBottom
                                >
                                    Verification codes will send SMS message to `{mfa.phoneNumber}`.
                                </Typography>
                                <FormControlLabel value="APP" control={<Radio color="primary" />} label="Authenticator app" />
                                <div style={{ display: mfa.mfaType == 'APP' ? 'block' : 'none' }} color="primary">
                                    <Typography color="primary" variant="overline" gutterBottom>
                                        <ul>
                                            <li>Get the authenticator app from store.</li>
                                            <li>In the App select Set up account.</li>
                                            <li>Choose scan a barcode.</li>
                                            <li>Enter the 6-digit code you see in the app and verify.</li>
                                        </ul>
                                    </Typography>

                                    <img className={classes.image} src={qrCode} />
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <Grid container justifyContent="flex-start">
                            <Button
                                onClick={() => handleMfaConfirm(true)}
                                type="button"
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                <Icon>lock</Icon>
                                {mfa.mfaEnabled ? 'Save' : 'Turn On'}
                            </Button>
                            <Button
                                onClick={() => handleMfaConfirm(false)}
                                style={{ display: mfa.mfaEnabled ? 'block' : 'none' }}
                                type="button"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Icon>lock_open</Icon>
                                Turn Off
                            </Button>
                        </Grid>
                    </form>
                </AccordionDetails>
            </Accordion>
        );
    };

    const qrCode = ProfileApi.customLink('/mfa/qr', false) + '&noMargin=true&name=' + APP_NAME;

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>security</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Security
                    </Typography>

                    <div className={classes.root}>
                        <Accordion expanded={expanded === 'changePassword'} onChange={handleAccordion('changePassword')}>
                            <AccordionSummary
                                expandIcon={<Icon color="primary">expand_more</Icon>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Icon className={classes.expansionIcon}>vpn_key</Icon>
                                <Typography className={classes.heading}>Change Password</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MasterForm fields={changePasswordFields} onSubmit={handlePwdSubmit}>
                                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                        Change & Logout Now
                                    </Button>
                                </MasterForm>
                            </AccordionDetails>
                        </Accordion>
                        {renderMfaDialog()}
                        {renderMfa()}
                    </div>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Security);
