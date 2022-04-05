import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Container, DialogProps, Divider, Icon, Paper, useTheme } from '@material-ui/core';
import { Grid, Typography, withTheme, makeStyles } from '@material-ui/core';
import ToothTable from '../fragment/tooth/ToothTable';
import ToothPicker from '../fragment/tooth/ToothPicker';

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
}));

const Dashboard = (props) => {
    const classes = styles();

    return (
        <>
            <Container component="main">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <Icon>home</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Dashboard
                    </Typography>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(Dashboard);
