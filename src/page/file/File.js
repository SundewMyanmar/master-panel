import React from 'react';
import { withRouter } from 'react-router';
import { Grid, Paper, Container, Avatar, Icon, Typography, makeStyles } from '@material-ui/core';
import FileManager from '../../fragment/file/FileManager';

const styles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    innerBox: {
        marginTop: theme.spacing(2),
    },
}));

const File = props => {
    const classes = styles();
    return (
        <>
            <Container component="main" maxWidth="lg">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>collections_bookmark</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        File Manager
                    </Typography>
                    <Grid className={classes.innerBox} container>
                        <FileManager />
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(File);
