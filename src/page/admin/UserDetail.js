import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, InputAdornment } from '@material-ui/core';

import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
import UserApi from '../../api/UserApi';
import { ROLE_TABLE_FIELDS } from './Role';
import FileApi from '../../api/FileApi';
import { STORAGE_KEYS } from '../../config/Constant';
import FormatManager from '../../util/FormatManager';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { CheckboxInput, EmailInput, ImageInput, ListInput, ObjectInput, PasswordInput, TextInput } from '../../fragment/control';

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
    avatarIcon: {
        color: theme.palette.common.white,
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
    redContainer: {
        backgroundColor: theme.palette.error.main,
    },
}));

const UserDetail = (props) => {
    const classes = styles();
    const history = useHistory();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isUpdate, setUpdate] = useState(id > 0);

    const handleRoleData = async (currentPage, pageSize, sort, search) => {
        return await RoleApi.getPaging(currentPage, pageSize, sort, search);
    };

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };
    const [form, setForm] = useState(() => {
        UserApi.getById(id)
            .then((data) => {
                setForm({ ...data, image: data.profileImage });
                setUpdate(true);
            })
            .catch((error) => {
                if (error.code !== 'HTTP_406') {
                    handleError(error);
                } else {
                    setUpdate(false);
                }
            });
        return {};
    });

    const handleSubmit = async () => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        if (!FormatManager.cleanPhoneNumber(form.phoneNumber)) {
            handleError('Invalid phone no.');
            return;
        }

        // let user = {
        //     displayName: form.displayName,
        //     phoneNumber: FormatManager.cleanPhoneNumber(form.phoneNumber),
        //     email: form.email,
        //     roles: form.roles,
        //     password: form.password,
        //     status: form.status ? 'ACTIVE' : 'CANCEL',
        //     extras: {
        //         address: form.address || '',
        //         gender: form.gender && typeof form.gender === 'string' ? form.gender : '',
        //     },
        // };
        let user = { ...form };
        user.phoneNumber = FormatManager.cleanPhoneNumber(form.phoneNumber);
        console.log('Form => ', form);
        if (form.image && form.image.id) {
            user.profileImage = form.image;
        } else if (form.image && !form.image.id) {
            const fileResponse = await FileApi.upload(form.image, true);
            if (fileResponse) {
                user.profileImage = fileResponse;
            }
        } else {
            user.profileImage = null;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (isUpdate) {
            user.password = 'default_password';
            UserApi.modifyById(id, user)
                .then((response) => {
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Modified user : ${response.id} .` },
                    });
                    history.push('/user');
                })
                .catch(handleError);
        } else {
            UserApi.addNew(user)
                .then((response) => {
                    dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Created new user : ${response.id} .` },
                    });
                    history.push('/user');
                })
                .catch(handleError);
        }
    };

    return (
        <>
            <Container component="main" maxWidth="md">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon color="action">account_box</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        User Setup
                    </Typography>
                    <MasterForm onSubmit={(event, form) => handleSubmit(form)}>
                        <Grid container direction="column">
                            <Grid direction="row" spacing={10} container>
                                <Grid lg={3} md={4} sm={6} xs={12} item>
                                    <ImageInput
                                        size={{ width: 200, height: 200 }}
                                        id="image"
                                        enableFilePicker={true}
                                        required={true}
                                        value={form?.profileImage}
                                        onChange={(event) => setForm({ ...form, image: event.target.value })}
                                    />
                                </Grid>
                                <Grid lg={9} md={8} sm={6} xs={12} direction="column" container item>
                                    <Grid item>
                                        <TextInput
                                            id="displayName"
                                            icon="face"
                                            label="Full Name"
                                            value={form?.displayName}
                                            onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item>
                                        <EmailInput
                                            id="email"
                                            icon="face"
                                            label="Email"
                                            value={form?.email}
                                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextInput
                                            id="phoneNumber"
                                            icon="phone"
                                            label="Phone number"
                                            value={form?.phoneNumber}
                                            onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <ObjectInput
                                    id="roles"
                                    label="Roles"
                                    icon="people"
                                    onLoadData={handleRoleData}
                                    onLoadItem={(item) => item.name}
                                    onChange={(event) => setForm({ ...form, roles: event.target.value })}
                                    values={form?.roles}
                                    fields={ROLE_TABLE_FIELDS}
                                    multi={true}
                                    required={true}
                                />
                            </Grid>
                            {isUpdate ? null : (
                                <>
                                    <Grid item>
                                        <PasswordInput
                                            id="password"
                                            label="Password"
                                            onChange={(event) => setForm({ ...form, password: event.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item>
                                        <PasswordInput
                                            id="confirmPassword"
                                            label="Confirm Password"
                                            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                                            onValidate={(event) =>
                                                form.password !== event.target.value ? "Password and Confirm Password doesn't match." : ''
                                            }
                                            required
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item>
                                <ListInput
                                    label="Gender"
                                    id="gender"
                                    data={['Male', 'Female', 'LGBT', 'Other']}
                                    value={form?.extras?.gender}
                                    onChange={(event) => {
                                        let updateExtras = { ...form.extras };
                                        updateExtras.gender = event.target.value;
                                        setForm({ ...form, extras: updateExtras });
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextInput
                                    id="address"
                                    label="Address"
                                    rows={4}
                                    multiline={true}
                                    value={form?.extras?.address}
                                    onChange={(event) => {
                                        let updateExtras = { ...form.extras };
                                        updateExtras.address = event.target.value;
                                        setForm({ ...form, extras: updateExtras });
                                    }}
                                />
                            </Grid>
                            <Grid container>
                                <Grid lg={4} md={5} sm={12} xs={12} item>
                                    <CheckboxInput
                                        id="status"
                                        label="Active User?"
                                        value={form?.status}
                                        onChange={(event) => {
                                            setForm({ ...form, status: event.target.checked ? 'ACTIVE' : 'CANCEL' });
                                        }}
                                        checked={form.status?.toLowerCase() === 'active'}
                                    />
                                </Grid>
                                <Grid lg={8} md={7} sm={12} xs={12} justifyContent="flex-end" container item>
                                    <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                                        <Icon>arrow_back</Icon> Back to List
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                                        <Icon color="action">save</Icon> Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MasterForm>
                    {/* <MasterForm fields={isUpdate ? fields : [...fields, ...newUserFields]} onSubmit={(event, form) => handleSubmit(form)}>
                        <Grid container justifyContent="flex-end">
                            <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                                <Icon>arrow_back</Icon> Back to List
                            </Button>
                            <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                                <Icon>save</Icon> Save
                            </Button>
                        </Grid>
                    </MasterForm> */}
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(UserDetail);
