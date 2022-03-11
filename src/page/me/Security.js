import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import {
    ThemeProvider,
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
    IconButton,
} from '@material-ui/core';
import { QuestionDialog } from '../../fragment/message';
import { OTPDialog, TextInput } from '../../fragment/control';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import MasterForm from '../../fragment/MasterForm';
import ProfileApi from '../../api/ProfileApi';
import { APP_NAME, STORAGE_KEYS } from '../../config/Constant';
import { useDispatch, useSelector } from 'react-redux';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import MfaApi from '../../api/MfaApi';
import DataTable from '../../fragment/table';
import { ErrorTheme, WarningTheme } from '../../config/Theme';

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

export const MFA_TABLE_FIELDS = [
    {
        name: 'type',
        label: 'MFA Type',
        sortable: true,
    },
    {
        name: 'key',
        label: 'Key',
        sortable: true,
    },
    {
        name: 'default',
        align: 'center',
        label: 'Default MFA',
        type: 'bool',
        sortable: true,
        width: 50,
    },
];

const Security = (props) => {
    const classes = styles();
    const history = useHistory();
    const dispatch = useDispatch();

    const [mfaPaging, setMfaPaging] = useState({
        total: 0,
        pageSize: 10,
        currentPage: 0,
        sort: 'modifiedAt:DESC',
    });
    const [currentMfa, setCurrentMfa] = useState(null);
    const [showOtp, setShowOtp] = useState(false);

    const [question, setQuestion] = useState('');
    const [questionType, setQuestionType] = useState('remove');
    const user = useSelector((state) => state.user);
    const [expanded, setExpanded] = React.useState('changePassword');

    const handleAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleError = (error) => {
        console.log('Error => ', error);
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleLoadMfa = async (currentPage = 0, pageSize = 10, sort = 'modifiedAt:DESC') => {
        try {
            const result = await MfaApi.getPaging(currentPage, pageSize, sort, '');
            if (!result.data || result.data.length == 0) {
                dispatch({
                    type: USER_REDUX_ACTIONS.UPDATE,
                    profile: { ...user, mfa: null },
                });
            }
            setMfaPaging(result);
        } catch (error) {
            handleError(error);
        }
        return {};
    };

    useEffect(() => {
        handleLoadMfa();

        // eslint-disable-next-line
    }, []);

    const handleEditMfa = (item) => {
        if (!item.default) {
            setQuestion('Are you sure to change default 2-step verification?');
            setQuestionType('change-default');
        }
        setCurrentMfa(item);
    };

    const handlePwdSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        const data = {
            newPassword: form.newPassword,
            oldPassword: form.oldPassword,
            user: user.email || user.phoneNumber,
        };

        ProfileApi.changePassword(data)
            .then((response) => {
                dispatch({ type: USER_REDUX_ACTIONS.LOGOUT });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: 'Password has changed! Please log in with new password.' },
                });
                history.push('/login');
            })
            .catch(handleError);
    };

    const handleRemoveMfa = (item) => {
        setCurrentMfa(item);
        setQuestionType('remove');
        if (item.type === 'APP') {
            setQuestion('Are you sure to remove MFA by App?');
        } else {
            setQuestion(`Are you sure to remove ${item.mfaKey} MFA?`);
        }
    };

    const handleQuestionDialog = (status) => {
        setQuestion('');
        if (!status) {
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        if (questionType === 'disable') {
            MfaApi.disable()
                .then((resp) => {
                    dispatch({ type: USER_REDUX_ACTIONS.UPDATE, profile: { ...user, mfa: null } });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Disabled 2-step verification. Please login again!` },
                    });
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    history.push('/login');
                })
                .catch(handleError);
        } else if (questionType === 'remove') {
            MfaApi.remove(currentMfa.id)
                .then((resp) => {
                    handleLoadMfa();
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Removed MFA setting.` },
                    });
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                })
                .catch(handleError);
        } else if (questionType === 'change-default') {
            MfaApi.setDefault(currentMfa.id).then((resp) => {
                dispatch({ type: USER_REDUX_ACTIONS.UPDATE, profile: { ...user, mfa: resp } });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: `Changed default MFA.` },
                });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                handleLoadMfa();
            });
        } else {
            dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
        }
    };

    const handleOtpSubmit = (code) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (!code) {
            handleError('Please fill code.');
            return;
        }

        setShowOtp(false);
        MfaApi.verify(code, currentMfa?.type === 'APP' ? null : currentMfa?.mfaKey)
            .then((result) => {
                if (currentMfa.default) {
                    dispatch({ type: USER_REDUX_ACTIONS.UPDATE, profile: { ...user, mfa: currentMfa } });
                }

                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: '2-step verification setup is success!.' },
                });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                handleLoadMfa();
            })
            .catch(handleError);
    };

    const renderMfa = () => {
        const fields_with_action = [
            ...MFA_TABLE_FIELDS,
            {
                name: 'mfa_remove',
                align: 'center',
                label: '@',
                minWidth: 50,
                type: 'raw',
                onLoad: (item) => (
                    <>
                        <ThemeProvider theme={ErrorTheme}>
                            <IconButton size="small" onClick={() => handleRemoveMfa(item)}>
                                <Icon color="primary">delete</Icon>
                            </IconButton>
                        </ThemeProvider>
                    </>
                ),
            },
        ];
        return (
            <Accordion expanded={expanded === 'twoFactor'} onChange={handleAccordion('twoFactor')}>
                <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
                    <Icon className={classes.expansionIcon}>phonelink_lock</Icon>
                    <Typography className={classes.heading}>2-Step Verification</Typography>
                    <Chip className={classes.expansionIcon} color={user.mfa ? 'secondary' : 'primary'} size="small" label={user.mfa ? 'On' : 'Off'} />
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid container item>
                            <Typography variant="overline" gutterBottom>
                                Please double click to set default MFA.
                            </Typography>
                        </Grid>
                        <Grid container item>
                            <DataTable
                                multi={false}
                                fields={fields_with_action}
                                items={mfaPaging.data}
                                total={mfaPaging.total}
                                pageSize={mfaPaging.pageSize}
                                currentPage={mfaPaging.currentPage}
                                sort={mfaPaging.sort}
                                onPageChange={(page) => handleLoadMfa(page.page, page.pageSize, page.sort)}
                                onEdit={handleEditMfa}
                            />
                        </Grid>
                        <Grid justifyContent="flex-end" container item>
                            <Button
                                onClick={() => history.push('/mfa/setup')}
                                type="button"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Icon color="action">vpn_key</Icon> Add New
                            </Button>
                            {user.mfa ? (
                                <ThemeProvider theme={ErrorTheme}>
                                    <Button
                                        onClick={() => {
                                            setQuestion('Are you sure to turn off 2-step verification?');
                                            setQuestionType('disable');
                                        }}
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        <Icon>lock</Icon> Turn Off
                                    </Button>
                                </ThemeProvider>
                            ) : null}
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <>
            <OTPDialog
                userId={user.id}
                mfaKey={currentMfa?.type === 'APP' ? null : currentMfa?.mfaKey}
                show={showOtp}
                onClose={() => setShowOtp(false)}
                onSubmit={handleOtpSubmit}
            />
            <QuestionDialog show={question.length > 0} title="Confirm?" message={question} onClose={handleQuestionDialog} />
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon>security</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Security
                    </Typography>

                    <div className={classes.root}>
                        <Accordion expanded={expanded === 'changePassword'} onChange={handleAccordion('changePassword')}>
                            <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
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
                        {renderMfa()}
                    </div>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Security);
