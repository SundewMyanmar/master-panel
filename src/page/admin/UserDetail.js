import React, { useRef, useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, InputAdornment } from '@material-ui/core';

import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
import UserApi from '../../api/UserApi';
import { ROLE_TABLE_FIELDS } from './Role';
import { STORAGE_KEYS } from '../../config/Constant';
import FormatManager from '../../util/FormatManager';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { CheckboxInput, EmailInput, ImageInput, ListInput, ObjectInput, PasswordInput, TabControl, TextInput } from '../../fragment/control';
import DataTable from '../../fragment/table';
import ContactForm from '../../form/ContactForm';
import { validateForm } from '../../util/ValidationManager';

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
    const [contact, setContact] = useState(null);
    const infoForm = useRef();

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

        if (
            !validateForm(
                form,
                [
                    { fieldId: 'phoneNumber', require: true, rules: [{ type: 'phone' }] },
                    { fieldId: 'displayName', require: true },
                    { fieldId: 'email', require: true, rules: [{ type: 'email' }] },
                    { fieldId: 'roles', require: true },
                    isUpdate ? null : { fieldId: 'password', require: true, rules: [{ type: 'match', matchId: 'confirmPassword' }] },
                ],
                handleError,
            )
        ) {
            return;
        }

        let user = { ...form };
        user.phoneNumber = FormatManager.cleanPhoneNumber(form.phoneNumber);

        if (form.image && form.image.id) {
            user.profileImage = form.image;
        } else if (form.image && !form.image.id) {
            const fileResponse = await UserApi.fileUpload(form.image, null);
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

    const renderInfoForm = () => {
        return (
            <Grid container direction="column">
                <Grid direction="row" spacing={3} container>
                    <Grid lg={3} md={4} sm={6} xs={12} item>
                        <Grid container justifyContent="center">
                            <ImageInput
                                size={{ width: 180, height: 180 }}
                                id="image"
                                enableFilePicker={true}
                                required={true}
                                value={form?.profileImage}
                                onChange={(event) => setForm({ ...form, image: event.target.value })}
                            />
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
                                icon="mail"
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
                        variant="outlined"
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
                                onValidate={(event) => (form.password !== event.target.value ? "Password and Confirm Password doesn't match." : '')}
                                required
                            />
                        </Grid>
                    </>
                )}
                <Grid item>
                    <TextInput
                        id="note"
                        label="Note"
                        rows={4}
                        multiline={true}
                        value={form?.note}
                        onChange={(event) => setForm({ ...form, note: event.target.value })}
                    />
                </Grid>
            </Grid>
        );
    };

    const renderContactGrid = () => {
        return <ContactForm onChange={(data) => setForm({ ...form, contacts: data })} data={form.contacts} />;
    };

    const tabFields = [
        {
            label: 'Info',
            icon: 'info',
            content: renderInfoForm(),
        },
        {
            label: 'Contacts',
            icon: 'contacts',
            content: renderContactGrid(),
        },
    ];

    return (
        <>
            <Container component="main" maxWidth="md">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon color="action">account_box</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        User Setup
                    </Typography>
                    <MasterForm>
                        <TabControl tabs={tabFields} />
                        <Grid justifyContent="flex-end" container>
                            <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                                <Icon>arrow_back</Icon> Back to List
                            </Button>
                            <Button type="button" variant="contained" color="primary" onClick={() => handleSubmit()} className={classes.submit}>
                                <Icon color="action">save</Icon> Save
                            </Button>
                        </Grid>
                    </MasterForm>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(UserDetail);
