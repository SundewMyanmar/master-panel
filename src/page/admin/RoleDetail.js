import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles } from '@material-ui/core';

import { LoadingDialog, AlertDialog } from '../../fragment/message';
import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
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

const RoleDetail = () => {
    const classes = styles();
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpdate, setUpdate] = useState(id > 0);

    const handleError = (error) => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const [detail, setDetail] = useState(() => {
        setLoading(true);
        RoleApi.getById(id)
            .then((data) => {
                setDetail(data);
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

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            setError('Please check your internet connection and try again.');
            return;
        }

        if (isUpdate) {
            form.id = id;
            form.version = detail.version;
            RoleApi.modifyById(id, form)
                .then((response) => {
                    setLoading(false);
                    sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, `Modified role : ${response.id} .`);
                    history.push('/role');
                })
                .catch(handleError);
        } else {
            RoleApi.addNew(form)
                .then((response) => {
                    setLoading(false);
                    sessionStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, `Created new role : ${response.id} .`);
                    history.push('/role');
                })
                .catch(handleError);
        }

        setLoading(true);
    };

    const fields = [
        {
            id: 'name',
            label: 'Name',
            required: true,
            type: 'text',
            value: detail.name || '',
            autoFocus: true,
        },
        {
            id: 'description',
            label: 'Description',
            type: 'text',
            multiline: true,
            rows: '4',
            value: detail.description || '',
        },
    ];

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="sm">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>people</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Role Setup
                    </Typography>
                    <MasterForm fields={fields} onSubmit={handleSubmit}>
                        <Grid container justify="flex-end">
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

export default withRouter(RoleDetail);
