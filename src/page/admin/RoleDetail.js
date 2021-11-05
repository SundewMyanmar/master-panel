import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, ThemeProvider } from '@material-ui/core';

import RoleApi from '../../api/RoleApi';
import MasterForm from '../../fragment/MasterForm';
import { STORAGE_KEYS } from '../../config/Constant';
import { InfoTheme, success } from '../../config/Theme';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch } from 'react-redux';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

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
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isUpdate, setUpdate] = useState(id > 0);

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const [detail, setDetail] = useState(() => {
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
            });
        return {};
    });

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (isUpdate) {
            form.id = id;
            form.version = detail.version;
            RoleApi.modifyById(id, form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Modified role : ${response.id} .` },
                    });
                    history.push('/role');
                })
                .catch(handleError);
        } else {
            RoleApi.addNew(form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Created new role : ${response.id} .` },
                    });
                    history.push('/role');
                })
                .catch(handleError);
        }
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
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <Icon>people</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Role Setup
                </Typography>
                <MasterForm fields={fields} onSubmit={handleSubmit}>
                    <Grid container justifyContent="flex-end">
                        <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                            <Icon>arrow_back</Icon> Back to List
                        </Button>
                        <ThemeProvider theme={InfoTheme}>
                            <Button type="button" variant="contained" color="primary" className={classes.submit} href={'/permission/' + id}>
                                <Icon>router</Icon> API Route
                            </Button>
                        </ThemeProvider>
                        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                            <Icon>save</Icon> Save
                        </Button>
                    </Grid>
                </MasterForm>
            </Paper>
        </Container>
    );
};

export default withRouter(RoleDetail);
