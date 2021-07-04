import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography, Link, Container, CssBaseline, Paper, Avatar, Icon, Grid, Box, makeStyles } from '@material-ui/core';
import { Copyright } from '../fragment/control';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.active,
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

const Dashboard = () => {
    const classes = styles();

    return (
        <React.Fragment>
            <Paper className={classes.paper} elevation={6}>
                <Typography color="error" component="h1" variant="h1">
                    404 - Not Found !
                </Typography>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="/#/login" color="textSecondary" variant="body2">
                            Back to login?
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </React.Fragment>
    );
};

export default withRouter(Dashboard);
