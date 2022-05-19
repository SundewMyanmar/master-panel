import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, ThemeProvider, ImageListItem } from '@material-ui/core';
import { TABLE_FIELDS } from './UnitOfMeasurement';
import UnitOfMeasurementApi from '../../api/UnitOfMeasurementApi';
import { UOM } from '../../config/Constant';
import MasterForm from '../../fragment/MasterForm';
import { InfoTheme, success } from '../../config/Theme';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';
import { useDispatch } from 'react-redux';
import { FLASH_REDUX_ACTIONS } from '../../util/FlashManager';

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
    submit: {
        marginLeft: theme.spacing(1),
    },
}));

const UnitOfMeasurementDetail = () => {
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

    const handleUomData = async (currentPage, pageSize, sort, search) => {
        return await UnitOfMeasurementApi.getPaging(currentPage, pageSize, sort, search);
    }

    const [detail, setDetail] = useState(() => {
        if (id && id > 0)
            UnitOfMeasurementApi.getById(id)
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
            UnitOfMeasurementApi.modifyById(id, form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Modified unit of measurement : ${response.id} .` },
                    });
                    history.push('/inventory/uom');
                })
                .catch(handleError);
        } else {
            UnitOfMeasurementApi.addNew(form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Created new unit of measurement : ${response.id} .` },
                    });
                    history.push('/inventory/uom');
                })
                .catch(handleError);
        }
    };

    const fields = [
        {
            id: 'code',
            label: 'Code',
            required: true,
            type: 'text',
            value: detail.code || '',
            autoFocus: true,
        },
        {
            id: 'name',
            label: 'Name',
            required: true,
            type: 'text',
            value: detail.name || '',
            autoFocus: true,
        },
        {
            id: 'guild',
            label: 'Group',
            required: true,
            type: 'list',
            data: UOM,
            value: detail.guild || '',
        },
        {
            id: 'relatedUom',
            label: 'Related Unit',
            type: 'table',
            fields: TABLE_FIELDS,
            multi: false,
            onLoadData: handleUomData,
            onLoadItem: (item) => item.name,
            value: detail.relatedUom,
        },
        {
            id: 'relatedValue',
            icon: 'eco',
            label: 'Related Value',
            required: false,
            type: 'number',
            value: detail.relatedValue,
        }
    ];

    return (
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <Icon>perm_data_setting</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Category Setup
                </Typography>
                <MasterForm fields={fields} onSubmit={handleSubmit}>
                    <Grid container justifyContent="flex-end">
                        <Button type="button" variant="contained" color="default" onClick={() => history.goBack()}>
                            <Icon>arrow_back</Icon> Go back
                        </Button>
                        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                            <Icon>save</Icon> Save
                        </Button>
                    </Grid>
                </MasterForm>
            </Paper>
        </Container>
    );
};

export default withRouter(UnitOfMeasurementDetail);