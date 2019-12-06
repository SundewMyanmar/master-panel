import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, Dialog, IconButton, Icon, Typography, CardContent, CardActions, Button, Divider, Grid } from '@material-ui/core';

const styles = theme => ({
    root: {
        padding: '3px 3px 0px 3px',
    },
    btnClose: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        color: theme.palette.common.red
    },
});

class ImageDialog extends React.Component {

    render() {
        const { classes, showImage, data, onClose, onLoadImage, width, height, deleteButton, _this } = this.props;

        return (
            <Dialog
                scroll="body"
                open={showImage}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className={classes.root}>
                    <IconButton onClick={onClose} className={classes.btnClose} aria-label="Close">
                        <Icon fontSize="large">cancel</Icon>
                    </IconButton>
                    <img onLoad={onLoadImage} width="100%" height="100%" src={data ? data.public_url : "/res/default-image.png"} alt="img" />
                </div>
                <Divider light />
                <CardContent>
                    {data ? (
                        <div>
                            <Typography variant="subtitle2" align="center" gutterBottom>{data.name}</Typography>
                            <Grid container>
                                <Grid container item xs={12}>
                                    <Grid item xs={2}>
                                        <Typography variant="caption" gutterBottom>Dimesions </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="caption" gutterBottom>: {width} x {height}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12}>
                                    <Grid item xs={2}>
                                        <Typography variant="caption" gutterBottom>Size </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="caption" gutterBottom>: {data.size}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12}>
                                    <Grid item xs={2}>
                                        <Typography variant="caption" gutterBottom>Type </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="caption" gutterBottom>: {data.type}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12}>
                                    <Grid item xs={2}>
                                        <Typography variant="caption" gutterBottom>Extension </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="caption" gutterBottom>: {data.extension}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                            <Typography variant="caption" align="center">There is no image.</Typography>
                        )}
                </CardContent>
                <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button style={{ color: "red" }} onClick={() => deleteButton(data.id, data.name, _this)}>Delete</Button>
                </CardActions>
            </Dialog>
        );
    }
}

ImageDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageDialog);