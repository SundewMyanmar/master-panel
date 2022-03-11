import React from 'react';
import { withRouter } from 'react-router';
import { Typography, Container, Paper, Avatar, Icon, makeStyles, Grid, Button, Divider } from '@material-ui/core';
import { TextInput, ListInput } from '../fragment/control';
import ApiManager from '../util/ApiManager';
import { ALERT_REDUX_ACTIONS } from '../util/AlertManager';
import { useDispatch } from 'react-redux';

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
        height: 55,
        marginTop: theme.spacing(1),
    },
    codePreview: {
        height: 320,
        width: '100%',
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        border: '1px solid ' + theme.palette.divider,
        padding: theme.spacing(1),
    },
}));

const apiManager = new ApiManager('/');

const Developer = () => {
    const classes = styles();
    const [form, setForm] = React.useState({});
    const [output, setOutput] = React.useState({});
    const dispatch = useDispatch();

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const handleResult = (result) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.HIDE,
        });
        setOutput(result);
    };

    const handleChange = (event) => {
        form[event.target.name] = event.target.value;
        setForm(form);
    };

    const handleSubmit = () => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW_LOADING,
        });
        switch (form.type) {
            case 'GET':
                apiManager.get(form.url, apiManager.getHeaders(true)).then(handleResult).catch(handleError);
                break;
            case 'POST':
                apiManager.post(form.url, JSON.parse(form.body), apiManager.getHeaders(true)).then(handleResult).catch(handleError);
                break;
            case 'PUT':
                apiManager.put(form.url, JSON.parse(form.body), apiManager.getHeaders(true)).then(handleResult).catch(handleError);
                break;
            case 'DELETE':
                apiManager.delete(form.url, JSON.parse(form.body), apiManager.getHeaders(true)).then(handleResult).catch(handleError);
                break;
            default:
                dispatch({
                    type: ALERT_REDUX_ACTIONS.HIDE,
                });
                break;
        }
    };

    return (
        <>
            <Container component="main" maxWidth="lg">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon>code</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Api Request Tool
                    </Typography>
                    <Grid alignItems="center" alignContent="space-between" spacing={2} container direction="row">
                        <Grid item lg={2} md={3} sm={4} xs={12}>
                            <ListInput
                                id="type"
                                label="Type"
                                required={true}
                                data={['GET', 'POST', 'PUT', 'DELETE']}
                                value="GET"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={8} md={7} sm={8} xs={12}>
                            <TextInput id="url" label="URL" type="url" required={true} onChange={handleChange} />
                        </Grid>
                        <Grid item lg={2} md={2} sm={12} xs={12}>
                            <Button type="button" className={classes.submit} fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                                <Icon>send</Icon> Submit
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container>
                        <TextInput id="body" label="Body JSON" multiline={true} rows="8" onChange={handleChange} />
                    </Grid>
                    <Grid container>
                        <div className={classes.codePreview}>
                            <code>{JSON.stringify(output, null, '\n\t')}</code>
                        </div>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Developer);
