import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, Dialog, IconButton, Icon, Typography, CardContent, CardActions, Button, Divider, Grid } from '@material-ui/core';

const styles = theme => ({
    root: {
        position: 'relative',
        padding: '3px 3px 0px 3px',
    },
    btnClose: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        color: theme.palette.common.gray,
    },
    btnRemove: {
        color: theme.palette.common.red,
        border: '1px solid ' + theme.palette.common.red,
    },
});

class ImageDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
        };
    }

    handleImageLoading = ({ target: img }) => {
        this.setState({ width: img.naturalWidth, height: img.naturalHeight });
    };

    renderDelete = () => {
        const { data, onRemoveImage, classes } = this.props;
        if (!onRemoveImage || !data) {
            return null;
        }

        return (
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                    color="secondary"
                    variant="outlined"
                    className={classes.btnRemove}
                    onClick={() => onRemoveImage(data)}
                    startIcon={<Icon fontSize="large">delete</Icon>}
                >
                    Remove
                </Button>
            </CardActions>
        );
    };

    renderInfo = () => {
        const { data } = this.props;

        if (!data) {
            return (
                <Typography variant="caption" align="center">
                    There is no image.
                </Typography>
            );
        }

        return (
            <div>
                <Typography variant="subtitle2" align="center" gutterBottom>
                    {data.name}
                </Typography>
                <Grid container>
                    <Grid container item xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="caption" gutterBottom>
                                Dimesions{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="caption" gutterBottom>
                                : {this.state.width} x {this.state.height}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="caption" gutterBottom>
                                Size{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="caption" gutterBottom>
                                : {data.size}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="caption" gutterBottom>
                                Type{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="caption" gutterBottom>
                                : {data.type}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item xs={2}>
                            <Typography variant="caption" gutterBottom>
                                Extension{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="caption" gutterBottom>
                                : {data.extension}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    };
    render() {
        const { classes, showDialog, data, onCloseImage } = this.props;

        return (
            <Dialog
                scroll="body"
                open={showDialog}
                onClose={onCloseImage}
                aria-labelledby={(data ? data.name : 'image-dialog') + '-title'}
                aria-describedby={(data ? data.name : 'image-dialog') + '-description'}
            >
                <div className={classes.root}>
                    <IconButton onClick={onCloseImage} className={classes.btnClose} aria-label="Close">
                        <Icon fontSize="large">cancel</Icon>
                    </IconButton>
                    <img
                        onLoad={this.handleImageLoading}
                        width="100%"
                        height="100%"
                        src={data ? data.public_url : '/res/default-image.png'}
                        alt="img"
                    />
                </div>
                <Divider light />
                <CardContent>{this.renderInfo()}</CardContent>
                {this.renderDelete()}
            </Dialog>
        );
    }
}

ImageDialog.defaultProps = {
    onCloseImage: console.log('Preview Image closed!'),
    onRemoveImage: false,
};

ImageDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    onCloseImage: PropTypes.func,
    onRemoveImage: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(ImageDialog);
