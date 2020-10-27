import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Typography, Grid, Divider, makeStyles } from '@material-ui/core';
import { info, warning, success } from '../../config/Theme';

const styles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
    },
}));

export type InfoCardProps = {
    icon: Any,
    title: String,
    info: String,
    description1: String,
    description2: String,
};

const InfoCard = (props: InfoCardProps) => {
    const classes = styles();
    const { icon, title, info, description1, description2 } = props;

    return (
        <div className={classes.root}>
            <div>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs="2">
                        {icon ? <Icon>{icon}</Icon> : null}
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="subtitle1">
                            {title}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography variant="h5">{info}</Typography>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs="2">
                        <Typography style={{ color: warning.main }} gutterBottom variant="subtitle1">
                            {description1}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant="subtitle1">
                            {description2}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default InfoCard;
