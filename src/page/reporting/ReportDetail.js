import React, { useRef, useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles } from '@material-ui/core';

import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
import ReportApi from '../../api/ReportApi';
import FormatManager from '../../util/FormatManager';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';
import { CheckboxInput, EmailInput, ImageInput, ObjectInput, PasswordInput, TextInput } from '../../fragment/control';
import ContactForm from '../../form/ContactForm';
import { validateForm } from '../../util/ValidationManager';
import BranchApi from '../../api/BranchApi';
import { BRANCH_TABLE_FIELDS } from '../setup/Branch';
import { ROLE_TABLE_FIELDS } from '../admin/Role';
import { useDropzone } from 'react-dropzone';

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
    form: {
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(2, 0),
    },
    dropzone: {
        minHeight: 150,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        outline: 'none',
        color: theme.palette.action.disabled,
        transition: 'border .24s ease-in-out',
        border: '2px dashed ' + theme.palette.info.main,
        background: theme.palette.background.default,
        cursor: 'pointer',
        marginBottom: theme.spacing(1),
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
}));

const ReportDetail = (props) => {
    const classes = styles();
    const history = useHistory();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isUpdate, setUpdate] = useState(id.length == 36);

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
        if (id.length == 36) {
            ReportApi.getById(id)
                .then((data) => {
                    setForm({ ...data });
                    setUpdate(true);
                })
                .catch((error) => {
                    if (error.code !== 'HTTP_406') {
                        handleError(error);
                    } else {
                        setUpdate(false);
                    }
                });
        }
        return {};
    });

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        multiple: false,
        accept: '.jasper,.jrxml',
        onDrop: (acceptedFiles) => {
            console.log('Uploaded File => ', acceptedFiles);
            if (acceptedFiles.length > 0) {
                const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, '');
                console.log('File Name => ', name);
                if (isUpdate) {
                    setForm({ ...form, reportFile: acceptedFiles[0] });
                } else {
                    setForm({ ...form, name: name, reportFile: acceptedFiles[0] });
                }
            }
        },
        onError: handleError,
    });

    const handleSubmit = async () => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }

        if (!validateForm(form, [{ fieldId: 'name', required: true }], handleError)) {
            return;
        }

        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        try {
            const report = {
                name: form.name,
                reportFile: form.reportFile,
                roles: form.public ? [] : form.roles ?? [],
                public: form.public ?? false,
            };

            let response, message;
            if (isUpdate) {
                report.id = form.id;
                report.version = form.version;
                console.log('Report => ', report);
                response = await ReportApi.modifyById(id, report);
                message = `Modified report : ${response.name} .`;
            } else {
                response = await ReportApi.addNew(report);
                message = `Upload new report : ${response.name} .`;
            }
            dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
            dispatch({
                type: FLASH_REDUX_ACTIONS.SHOW,
                flash: { type: 'success', message: message },
            });
            history.push('/report');
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <>
            <Container component="main" maxWidth="md">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon color="action">bar_chart</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Report Setup
                    </Typography>
                    <Grid container direction="row" spacing={3} className={classes.form}>
                        <Grid container lg={4} md={4} sm={12} xs={12} item>
                            <div {...getRootProps({ className: classes.dropzone })}>
                                <input {...getInputProps()} />
                                <p align="center">
                                    <Icon color="inherit" style={{ fontSize: 60 }}>
                                        {form?.reportFile ? 'description' : 'cloud_upload'}
                                    </Icon>
                                    <br />
                                    {form?.reportFile ? form?.reportFile?.name : 'Drag & drop your report file.'}
                                </p>
                            </div>
                        </Grid>
                        <Grid container lg={8} md={8} sm={12} xs={12} item>
                            <TextInput
                                id="name"
                                icon="code"
                                label="Name"
                                value={form?.name}
                                onChange={(event) => setForm({ ...form, name: event.target.value })}
                                required
                            />
                            <ObjectInput
                                variant="outlined"
                                id="roles"
                                label="Roles"
                                icon="people"
                                onLoadData={handleRoleData}
                                onLoadItem={(item) => item.name}
                                onChange={(event) => {
                                    setForm({ ...form, roles: event.target.value });
                                }}
                                values={form?.roles}
                                fields={ROLE_TABLE_FIELDS}
                                multi={true}
                                required={true}
                            />
                            <CheckboxInput
                                id="public"
                                label="Is public?"
                                onChange={(event) => {
                                    const checked = event.target.checked;
                                    const newForm = { ...form, public: checked };
                                    if (checked) {
                                        newForm.roles = [];
                                    }
                                    console.log('newForm => ', newForm);
                                    setForm(newForm);
                                }}
                                checked={form?.public ?? false}
                            />
                        </Grid>
                    </Grid>
                    <Grid justifyContent="flex-end" container>
                        <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                            <Icon>arrow_back</Icon> Go back
                        </Button>
                        <Button type="button" variant="contained" color="primary" onClick={() => handleSubmit()} className={classes.submit}>
                            <Icon color="action">save</Icon> Save
                        </Button>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(ReportDetail);
