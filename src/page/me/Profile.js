import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import {
    Typography,
    Container,
    makeStyles,
    Paper,
    Avatar,
    Icon,
    Button,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import UserApi from '../../api/UserApi';
import ProfileApi from '../../api/ProfileApi';
import { primary, secondary } from '../../config/Theme';
import FormatManager from '../../util/FormatManager';
import { useDispatch, useSelector } from 'react-redux';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import ContactForm from '../../form/ContactForm';
import { EmailInput, ImageInput, TextInput } from '../../fragment/control';
import { GUILD } from '../admin/User';
const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'inherit',
        width: '100%',
        margin: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    expansionIcon: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    heading: {},
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

const Profile = (props) => {
    const classes = styles();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [form, setForm] = useState({ ...user, image: user.profileImage });
    const [expanded, setExpanded] = useState({
        info: true,
        contacts: false,
    });

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    useEffect(() => {
        ProfileApi.getProfile()
            .then((data) => {
                if (!data.currentToken) {
                    data.currentToken = user.currentToken;
                }
                if (data.extras && data.extras.theme) {
                    let theme = JSON.parse(data.extras.theme);
                    data.primary = theme.primary.main || primary.main;
                    data.secondary = theme.secondary.main || secondary.main;
                    data.darkMode = theme.darkMode || false;
                } else {
                    data.primary = primary.main;
                    data.secondary = secondary.main;
                    data.darkMode = false;
                }
                dispatch({ type: USER_REDUX_ACTIONS, profile: data });
            })
            .catch(handleError);
        // eslint-disable-next-line
    }, []);
    const [noti, setNoti] = useState('');

    const handleSubmit = async () => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        try {
            let profile = { ...user, displayName: form.displayName || user.displayName, note: form.note, contacts: form.contacts };

            let theme = {
                primary: form.primary ? FormatManager.generateThemeColors(form.primary) : primary,
                secondary: form.secondary ? FormatManager.generateThemeColors(form.secondary) : secondary,
                darkMode: form.darkMode ? true : false,
            };

            profile.extras.theme = JSON.stringify(theme);
            if (form.image && form.image.id) {
                profile.profileImage = form.image;
            } else if (form.image && !form.image.id) {
                const fileResponse = await UserApi.fileUpload(form.image, 'profileImage', null);
                if (fileResponse) {
                    profile.profileImage = fileResponse;
                }
            } else {
                profile.profileImage = null;
            }

            const response = await ProfileApi.updateProfile(profile);

            if (response) {
                if (!response.currentToken) {
                    delete response.currentToken;
                }
                const updatedData = { ...user, ...response };
                dispatch({ type: USER_REDUX_ACTIONS.UPDATE, profile: updatedData });
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                dispatch({
                    type: FLASH_REDUX_ACTIONS.SHOW,
                    flash: { type: 'success', message: 'Successfully update your new profile.' },
                });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const userName = form?.displayName || 'Unknown';

    return (
        <>
            <Container maxWidth="md">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon>account_circle</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {userName + "'s Profile"}
                    </Typography>
                    <div className={classes.root}>
                        <Accordion expanded={expanded.info} onChange={() => setExpanded({ ...expanded, info: !expanded.info })}>
                            <AccordionSummary
                                className={classes.heading}
                                expandIcon={<Icon>expand_more</Icon>}
                                aria-controls="info-content"
                                id="info-header"
                            >
                                <Icon className={classes.expansionIcon}>info</Icon>
                                <Typography>Information</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container direction="column">
                                    <Grid container direction="row">
                                        <Grid md={4} sm={6} xs={12} item>
                                            <ImageInput
                                                id="image"
                                                guild={GUILD}
                                                enableFilePicker={true}
                                                value={form?.profileImage || null}
                                                size={{ width: 200, height: 200 }}
                                                onChange={(event) => setForm({ ...form, image: event.target.value })}
                                            />
                                        </Grid>
                                        <Grid md={8} sm={6} xs={12} direction="column" container item>
                                            <TextInput
                                                id="displayName"
                                                label="Full Name"
                                                icon="face"
                                                value={form?.displayName || ''}
                                                onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                                                required
                                            />
                                            <TextInput
                                                id="phoneNumber"
                                                label="Auth Phone Number"
                                                icon="phone"
                                                value={form?.phoneNumber || ''}
                                                onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                                                disabled={true}
                                            />
                                            <EmailInput
                                                id="email"
                                                label="Auth Email"
                                                value={form?.email || ''}
                                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                                disabled={true}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <TextInput
                                            id="note"
                                            label="Note"
                                            rows={4}
                                            multiline={true}
                                            value={user?.note}
                                            onChange={(event) => setForm({ ...form, note: event.target.value })}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded.contacts} onChange={() => setExpanded({ ...expanded, contacts: !expanded.contacts })}>
                            <AccordionSummary
                                className={classes.heading}
                                expandIcon={<Icon>expand_more</Icon>}
                                aria-controls="contacts-content"
                                id="contacts-header"
                            >
                                <Icon className={classes.expansionIcon}>contacts</Icon>
                                <Typography>Contacts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ContactForm onChange={(data) => setForm({ ...form, contacts: data })} data={form.contacts} />
                            </AccordionDetails>
                        </Accordion>
                        <Grid justifyContent="flex-end" container>
                            <Button
                                onClick={() => handleSubmit()}
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Icon fontSize="small">save</Icon> Save
                            </Button>
                        </Grid>
                    </div>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Profile);
