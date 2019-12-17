import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { primary, action, background } from '../../config/Theme';
import {
    withStyles,
    Paper,
    TextField,
    Icon,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormHelperText,
    Grid,
    Divider,
    Typography,
    Chip,
    Select,
    MenuItem,
    Input,
    InputLabel,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import FileApi from '../../api/FileApi';
import ProfileApi from '../../api/ProfileApi';
import ImageUpload from '../../component/ImageUpload';
import { STORAGE_KEYS } from '../../config/Constant';
import Snackbar from '../../component/Snackbar';
import FileDialog from '../../component/Dialogs/FileDialog';
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
});

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFile: false,
            fileCurrentPage: 0,
            filePageSize: 18,
            fileTotal: 0,
            filePageCount: 1,
        };
    }

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
        var image;
        if (user.profile_image) image = user.profile_image;

        this.setState({
            id: user.id,
            display_name: user.display_name,
            email: user.email,
            image: image,
            roles: user.roles,
            status: user.status,
            user_name: user.user_name,
        });
    }

    onSaveItem = async () => {
        if (!this.state.display_name || this.state.display_name === '') {
            this.setState({
                display_nameError: true,
            });
            return;
        }

        var profile = {
            id: this.state.id,
            display_name: this.state.display_name,
            email: this.state.email,
            roles: this.state.roles,
            status: this.state.status,
            user_name: this.state.user_name,
        };

        try {
            if (this.state.image && this.state.image.id) {
                profile.profile_image = {
                    id: this.state.image.id,
                };
            } else if (this.state.image && !this.state.image.id) {
                var fileResponse;

                fileResponse = await FileApi.upload(this.state.image);

                if (fileResponse)
                    profile.profile_image = {
                        id: fileResponse.id,
                    };
            } else {
                profile.profile_image = null;
            }

            const response = await ProfileApi.updateProfile(profile);

            //update session storage
            var data = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
            data.display_name = response.display_name;
            data.profile_image = response.profile_image;
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));

            this.setState({
                showSnack: true,
                snackMessage: 'Save success.',
            });
        } catch (error) {
            console.error(error);
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again.' });
        }
    };

    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    };

    onCloseSnackbar = () => {
        this.setState({ showSnack: false });
    };

    handleError = () => {
        this.setState({ showError: false });
    };

    handleImageChange = image => {
        this.setState({ image: image });
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
                <Snackbar
                    vertical="top"
                    horizontal="right"
                    showSnack={this.state.showSnack}
                    type="success"
                    message={this.state.snackMessage}
                    onCloseSnackbar={this.onCloseSnackbar}
                />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: 'center' }} color="primary" variant="h5" component="h3">
                        My Profile
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container justify="center">
                                    <ImageUpload id="imageUpload" onImageChange={this.handleImageChange} source={this.state.image} />
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.display_nameError ? 'error' : 'primary'}>
                                            storage
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="display_name"
                                            color="primary"
                                            label="Display Name*"
                                            error={this.state.display_nameError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.display_name ? this.state.display_name : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>{this.state.display_nameError ? 'invalid display name field!' : ''}</div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start" justify="space-evenly">
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button
                                            style={{ marginTop: '30px', marginBottom: '20px', color: background.default }}
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            className={classes.button}
                                            onClick={() => this.onSaveItem()}
                                        >
                                            <Icon className={classes.iconButton} style={{ color: background.default }}>
                                                save
                                            </Icon>
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

ProfilePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(ProfilePage)));
