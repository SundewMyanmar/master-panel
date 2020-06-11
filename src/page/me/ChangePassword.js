import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router';
import { Typography, Container, CssBaseline, Paper, Avatar, Icon, Button, makeStyles } from '@material-ui/core';
import { AlertDialog, LoadingDialog } from '../../fragment/message';
import MasterForm from '../../fragment/MasterForm';
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

const ChangePassword = props => {
    const classes = styles();
    const history = useHistory();
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (event, form) => {
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
            .then(response => {
                sessionStorage.clear();
                history.push('/login?message=Password has changed! Please log in with new password.');
            })
            .catch(error => {
                setLoading(false);
                setError(error.message || error.title || 'Please check your internet connection and try again.');
            });
    };

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>vpn_key</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <MasterForm fields={changePasswordFields} onSubmit={handleSubmit}>
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Change & Logout Now
                        </Button>
                    </MasterForm>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(ChangePassword);
