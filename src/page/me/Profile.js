import React, { useState,useEffect } from 'react';
import { withRouter } from 'react-router';
import { InputAdornment, Typography, Container, makeStyles, Paper, Avatar, Icon, Button } from '@material-ui/core';
import MasterForm from '../../fragment/MasterForm';
import FileApi from '../../api/FileApi';
import ProfileApi from '../../api/ProfileApi';
import { primary, secondary } from '../../config/Theme';
import FormatManager from '../../util/FormatManager';
import { useDispatch, useSelector } from 'react-redux';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

const styles = makeStyles(theme => ({
    root: {
        backgroundColor: 'inherit',
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

const Profile = props => {
    const classes = styles();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleError = error => {
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

    const handleSubmit = async (form) => {
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
        try {
            let profile = {
                id: user.id,
                displayName: form.displayName || user.displayName,
                email: user.email,
                roles: user.roles,
                status: user.status,
                phoneNumber: user.phoneNumber,
                extras: user.extras || {},
            };

            let theme = {
                primary: form.primary ? FormatManager.generateThemeColors(form.primary) : primary,
                secondary: form.secondary ? FormatManager.generateThemeColors(form.secondary) : secondary,
                darkMode: form.darkMode ? true : false,
            };

            profile.extras.theme = JSON.stringify(theme);
            console.log('profile', profile);
            if (form.image && form.image.id) {
                profile.profileImage = form.image;
            } else if (form.image && !form.image.id) {
                const fileResponse = await FileApi.upload(form.image, true);
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

    const profileFields = [
        {
            id: 'image',
            type: 'image',
            enableFilePicker: true,
            value: user.profileImage || null,
            size: { width: 256, height: 256 },
        },
        {
            id: 'displayName',
            label: 'Full Name',
            icon: 'face',
            required: true,
            type: 'text',
            value: user ? user.displayName : '',
        },
        {
            id: 'phoneNumber',
            label: 'Phone number',
            icon: 'phone',
            required: true,
            InputProps: {
                startAdornment: (
                    <>
                        <InputAdornment position="start"> +959 </InputAdornment>
                    </>
                ),
            },
            type: 'text',
            value: user ? user.phoneNumber : '',
            disabled: true,
        },
        {
            id: 'email',
            label: 'E-mail',
            required: true,
            type: 'email',
            value: user ? user.email : '',
            disabled: true,
        },
    ];

    const userName = user.displayName || 'Unknown';

    return (
        <>
            <Container maxWidth="md">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>account_circle</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {userName + "'s Profile"}
                    </Typography>
                    <MasterForm fields={profileFields} onSubmit={(event, form) => handleSubmit(form)}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            <Icon fontSize="small">save</Icon> Save
                        </Button>
                    </MasterForm>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Profile);
