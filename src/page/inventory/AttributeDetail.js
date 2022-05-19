import React, { useState } from 'react';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { Typography, Container, Avatar, Icon, Grid, Button, Paper, makeStyles, ThemeProvider, ImageListItem } from '@material-ui/core';
import AttributeApi from '../../api/AttributeApi';
import { ATTRIBUTE } from '../../config/Constant';
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

const AttributeDetail = () => {
    const classes = styles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [isUpdate, setUpdate] = useState(id > 0);

    const [attributeTypes, setAttributeTypes] = useState(() => {
        AttributeApi.getAttributeTypes()
            .then((data) => {
                setAttributeTypes(data);
            }).catch((error) => {
                if (error.code !== 'HTTP_406') {
                    handleError(error);
                } else {
                    setUpdate(false);
                }
            })
        return {};
    })

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const [detail, setDetail] = useState(() => {
        if (id && id > 0)
            AttributeApi.getById(id)
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
        return [];
    });

    const handleSubmit = (event, form) => {
        if (!window.navigator.onLine) {
            handleError('Please check your internet connection and try again.');
            return;
        }
        dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });

        if (form.allowedValues && !Array.isArray(form.allowedValues)) {

            form.allowedValues = form.allowedValues.split(',');
        }

        if (!form.allowedValues) form.allowedValues = [];

        if (isUpdate) {
            form.id = id;
            form.version = detail.version;
            AttributeApi.modifyById(id, form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Modified attribute : ${response.id} .` },
                    });
                    history.push('/inventory/attribute');
                })
                .catch(handleError);
        } else {
            AttributeApi.addNew(form)
                .then((response) => {
                    dispatch({
                        type: FLASH_REDUX_ACTIONS.SHOW,
                        flash: { type: 'success', message: `Created new attribute : ${response.id} .` },
                    });
                    history.push('/inventory/attribute');
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
        {
            id: 'guild',
            label: 'Group',
            required: true,
            type: 'list',
            data: ATTRIBUTE,
            value: detail.guild || '',
        },
        {
            id: 'type',
            label: 'Type',
            required: true,
            type: 'list',
            data: attributeTypes,
            value: detail.type || '',
        },
        {
            id: 'allowedValues',
            label: 'Allowed Values',
            required: false,
            type: 'chip',
            value: detail.allowedValues || '',
        },
        {
            id: 'hasUom',
            label: 'Has Uom?',
            required: false,
            type: 'checkbox',
            value: detail.hasUom || false,
            checked: detail.hasUom || false
        },
        {
            id: 'searchable',
            label: 'Is Searchable?',
            required: false,
            type: 'checkbox',
            value: detail.searchable || false,
            checked: detail.searchable || false
        },
    ];

    return (
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <Icon>settings_applications</Icon>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Attribute Setup
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

export default withRouter(AttributeDetail);