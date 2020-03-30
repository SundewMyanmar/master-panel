import React from 'react';
import { Grid, Typography, IconButton, Icon, makeStyles, useTheme } from '@material-ui/core';

type DrawerHeaderProps = {
    image?: string,
    name: string,
    hideMenu: boolean,
    onMenuClick: ?Function,
};

const styles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    title: {
        color: theme.palette.primary.contrastText,
        borderLeft: '3px solid ' + theme.palette.secondary.main,
        paddingLeft: theme.spacing(1),
    },
    glassBackground: {
        background: '#36373ac9',
    },
    menuIcon: {
        color: theme.palette.primary.contrastText,
    },
}));

const DrawerHeader = (props: DrawerHeaderProps) => {
    const classes = styles();
    const theme = useTheme();

    return (
        <div className={classes.root} style={props.image ? { backgroundImage: 'url("' + props.image + '")' } : null}>
            <div className={classes.glassBackground} style={props.hideMenu ? { padding: 0 } : { padding: theme.spacing(3) }}>
                <Grid container alignItems="center" direction="row" justify="space-around">
                    {props.hideMenu ? null : (
                        <div>
                            <Typography style={{ color: theme.palette.common.white }} variant="h6" gutterBottom>
                                Welcome!
                            </Typography>
                            <Typography className={classes.title} variant="subtitle1">
                                {props.name}
                            </Typography>
                        </div>
                    )}
                    <IconButton onClick={props.onMenuClick}>
                        <Icon className={classes.menuIcon}>{props.hideMenu ? 'menu' : 'chevron_left'}</Icon>
                    </IconButton>
                </Grid>
            </div>
        </div>
    );
};

DrawerHeader.defaultProps = {
    image: '/images/logo.png',
};

export default DrawerHeader;
