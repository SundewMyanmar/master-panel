import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Typography, Container, makeStyles, Paper, Avatar, Icon, Button } from '@material-ui/core';
import { AlertDialog, LoadingDialog, Notification } from '../../fragment/message';
import MasterForm from '../../fragment/MasterForm';
import FileApi from '../../api/FileApi';
import ProfileApi from '../../api/ProfileApi';
import { STORAGE_KEYS } from '../../config/Constant';

const styles = makeStyles(theme => ({
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

const SESSION_USER = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || { displayName: '', email: '', phoneNumber: '', roles: [] };

const Profile = props => {
    const classes = styles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleError = error => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const [user, setUser] = useState(() => {
        ProfileApi.getProfile()
            .then(data => {
                if (!data.currentToken) {
                    data.currentToken = SESSION_USER.currentToken;
                }
                setUser(data);
            })
            .catch(handleError);
        return SESSION_USER;
    });
    const [noti, setNoti] = useState('');

    const handleSubmit = async form => {
        setLoading(true);
        try {
            let profile = {
                id: user.id,
                displayName: form.displayName || user.displayName,
                email: user.email,
                roles: user.roles,
                status: user.status,
                phoneNumber: user.phoneNumber,
            };
            if (form.image && form.image.id) {
                profile.profileImage = form.image;
            } else if (form.image && !form.image.id) {
                const fileResponse = await FileApi.upload(form.image, false);
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
                console.log('Modified user => ', updatedData);
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedData));
                setUser(updatedData);
                setLoading(false);
                setNoti('Successfully update your new profile.');
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
            value: user ? user.profileImage : null,
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
            <Notification show={noti.length > 0} onClose={() => setNoti(false)} type="success" message={noti} />
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
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