import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles } from '@material-ui/core';

import { LoadingDialog, AlertDialog } from '../../fragment/message';
import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
import UserApi from '../../api/UserApi';
import { ROLE_TABLE_FIELDS } from './Role';
import FileApi from '../../api/FileApi';
import { STORAGE_KEYS } from '../../config/Constant';

const styles = makeStyles((theme) => ({
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
    submit: {
        marginLeft: theme.spacing(1),
    },
}));

const UserDetail = (props) => {
    const classes = styles();
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpdate, setUpdate] = useState(id > 0);

    const handleRoleData = async (currentPage, pageSize, sort, search) => {
        return await RoleApi.getPaging(currentPage, pageSize, sort, search);
    };

    const handleError = (error) => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const [detail, setDetail] = useState(() => {
        setLoading(true);
        UserApi.getById(id)
            .then((data) => {
                setDetail(data);
                setUpdate(true);
            })
            .catch((error) => {
                if (error.code !== 'HTTP_406') {
                    handleError(error);
                } else {
                    setUpdate(false);
                }
            })
            .finally(() => setLoading(false));
        return {};
    });

    const handleSubmit = async (form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }

        let user = {
            displayName: form.displayName,
            phoneNumber: form.phoneNumber,
            email: form.email,
            roles: form.roles,
            password: form.password,
            status: form.status ? 'ACTIVE' : 'CANCEL',
            extras: {
                address: form.address || '',
                gender: form.gender && typeof form.gender === 'string' ? form.gender : '',
            },
        };

        if (form.image && form.image.id) {
            user.profileImage = form.image;
        } else if (form.image && !form.image.id) {
            const fileResponse = await FileApi.upload(form.image, false);
            if (fileResponse) {
                user.profileImage = fileResponse;
            }
        } else {
            user.profileImage = null;
        }

        if (isUpdate) {
            user.id = detail.id;
            user.password = 'default_password';
            user.version = detail.version;
            UserApi.modifyById(id, user)
                .then((response) => {
                    setLoading(false);
                    sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, 'Modified user : ' + response.id + ' .');
                    history.push('/user');
                })
                .catch(handleError);
        } else {
            UserApi.addNew(user)
                .then((response) => {
                    setLoading(false);
                    sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, 'Created new user : ' + response.id + ' .');
                    history.push('/user');
                })
                .catch(handleError);
        }

        setLoading(true);
    };

    const newUserFields = [
        {
            id: 'password',
            label: 'Password',
            required: true,
            type: 'password',
        },
        {
            id: 'confirmPassword',
            label: 'Confirm Password',
            required: true,
            type: 'password',
            onValidate: (event, form) => (form.password !== event.target.value ? "Password and Confirm Password doesn't match." : ''),
        },
    ];

    const fields = [
        {
            id: 'image',
            type: 'image',
            enableFilePicker: true,
            required: true,
            value: detail.profileImage || null,
        },
        {
            id: 'displayName',
            label: 'Full Name',
            icon: 'face',
            required: true,
            type: 'text',
            value: detail.displayName,
        },
        {
            id: 'email',
            label: 'E-mail',
            required: true,
            type: 'email',
            value: detail.email,
        },
        {
            id: 'phoneNumber',
            label: 'Phone number',
            icon: 'phone',
            required: true,
            type: 'text',
            value: detail.phoneNumber,
        },
        {
            id: 'roles',
            label: 'Roles',
            icon: 'people',
            type: 'table',
            multi: true,
            required: true,
            fields: ROLE_TABLE_FIELDS,
            onLoadData: handleRoleData,
            onLoadItem: (item) => item.name,
            values: detail.roles,
        },
        {
            id: 'gender',
            label: 'Gender',
            icon: 'person',
            type: 'list',
            data: ['Male', 'Female', 'Other'],
            value: detail.extras ? detail.extras.gender : null,
        },
        {
            id: 'address',
            label: 'Address',
            type: 'text',
            multiline: true,
            rows: '4',
            value: detail.extras ? detail.extras.address : null,
        },
        {
            id: 'status',
            label: 'Active User?',
            type: 'checkbox',
            value: detail.status,
            checked: detail.status ? detail.status.toLowerCase() === 'active' : false,
        },
    ];

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="md">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>account_box</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        User Setup
                    </Typography>
                    <MasterForm fields={isUpdate ? fields : [...fields, ...newUserFields]} onSubmit={(event, form) => handleSubmit(form)}>
                        <Grid container justifyContent="flex-end">
                            <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                                <Icon>arrow_back</Icon> Back to List
                            </Button>
                            <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                                <Icon>save</Icon> Save
                            </Button>
                        </Grid>
                    </MasterForm>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(UserDetail);
