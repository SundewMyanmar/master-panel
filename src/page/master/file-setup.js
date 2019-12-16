import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { withStyles, Paper, Icon, Button, IconButton, Grid, Divider, Typography, CardMedia, CardActionArea } from '@material-ui/core';

import { primary, action, background } from '../../config/Theme';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import FileApi from '../../api/FileApi';
import { FILE_ACTIONS } from '../../redux/FileRedux';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        borderRadius: 0,
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    button: {
        width: 'calc(100%)',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    iconButton: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
    },
    form_error: {
        color: action.error,
    },
    select: {
        width: '100%',
        marginTop: 32,
    },
    media: {
        height: 200,
        width: 200,
        borderRadius: 6,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    },
    btnClose: {
        position: 'absolute',
        top: '-13px',
        right: '-13px',
        color: theme.palette.common.red,
    },
    btnUpload: {
        height: 200,
        width: 200,
        borderRadius: 6,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    },
});

class FileSetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            showError: false,
            files: [],
        };
    }

    componentDidMount() {}

    validateForm() {
        var fileError = false;

        if (this.state.files.length === 0 || this.state.files.length < 1) fileError = true;

        this.setState({
            fileError: fileError,
        });

        return !fileError;
    }

    goBack() {
        this.props.history.push('/file/setup');
    }

    onSaveItem = async () => {
        if (!this.validateForm()) {
            return;
        }

        this.setState({ showLoading: true });
        try {
            const response = await FileApi.multiUpload(this.state.files);
            this.props.dispatch({
                type: FILE_ACTIONS.CREATE_NEW,
                file: response,
            });
            this.props.history.push('/file/setup?callback=success');
        } catch (error) {
            console.error(error);
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again.' });
        }
    };

    handleError = () => {
        this.setState({ showError: false });
    };

    onChangeImage = event => {
        var files = Array.from(event.target.files);

        files.forEach(file => {
            var reader = new FileReader();
            reader.onloadend = () => {
                file.previewImage = reader.result;
                this.setState({
                    files: [...this.state.files, file],
                });
            };
            reader.readAsDataURL(file);
        });
    };

    removeImage = file => {
        const files = [...this.state.files];
        const toDelete = files.indexOf(file);
        files.splice(toDelete, 1);
        this.setState({ files: files });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog
                    showDialog={this.state.showError}
                    title="Oops!"
                    description={this.state.errorMessage}
                    onOkButtonClick={this.handleError}
                />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: 'center' }} color="primary" variant="h5" component="h3">
                        File Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <Grid container spacing={16} justify="center">
                                <input
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    id="image_upload"
                                    type="file"
                                    multiple
                                    onChange={event => this.onChangeImage(event)}
                                />
                                <Grid item>
                                    <label htmlFor="image_upload">
                                        <CardActionArea component="span">
                                            <CardMedia
                                                className={classes.btnUpload}
                                                image="res/upload2.png"
                                                style={{ border: this.state.fileError ? '2px solid #d50000' : 0 }}
                                            />
                                        </CardActionArea>
                                    </label>
                                </Grid>

                                {this.state.files.map(file => {
                                    return (
                                        <Grid key={file.name} item style={{ position: 'relative' }}>
                                            <IconButton className={classes.btnClose} aria-label="Close" onClick={() => this.removeImage(file)}>
                                                <Icon>cancel</Icon>
                                            </IconButton>
                                            <CardMedia className={classes.media} image={file.previewImage} />
                                        </Grid>
                                    );
                                })}
                            </Grid>

                            {this.state.fileError ? (
                                <Grid container justify="center" alignItems="center" style={{ marginTop: 8 }}>
                                    <Icon fontSize="small" style={{ color: '#d50000', marginRight: 4 }}>
                                        error
                                    </Icon>
                                    <Typography variant="body2" align="center" style={{ color: '#d50000' }}>
                                        no image to upload.
                                    </Typography>
                                </Grid>
                            ) : (
                                ''
                            )}

                            <Grid container spacing={8} alignItems="center" justify="space-evenly">
                                <Grid xs={12} sm={6} item md={5} lg={5}>
                                    <Button
                                        style={{ marginTop: '30px', marginBottom: '20px', color: background.default }}
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        className={classes.button}
                                        onClick={() => this.onSaveItem()}
                                    >
                                        <Icon className={classes.iconButton}>save</Icon>
                                        Save
                                    </Button>
                                </Grid>
                                <Grid xs={12} sm={6} item md={5} lg={5}>
                                    <Button
                                        style={{ marginTop: '30px', marginBottom: '20px', color: primary.main }}
                                        variant="contained"
                                        size="large"
                                        className={classes.button}
                                        onClick={() => this.goBack()}
                                    >
                                        <Icon className={classes.iconButton}>cancel_presentation</Icon>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

FileSetupPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(FileSetupPage)));
