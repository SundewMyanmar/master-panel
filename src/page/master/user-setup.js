import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    withStyles,
    Paper,
    TextField,
    Icon,
    Button,
    Grid,
    Divider,
    Typography,
    Select,
    MenuItem,
    Input,
    FormControl,
    InputLabel,
} from '@material-ui/core';

import { primary, action, background } from '../../config/Theme';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import UserApi from '../../api/UserApi';
import FileApi from '../../api/FileApi';
import { USER_ACTIONS } from '../../redux/UserRedux';
import FormatManager from '../../util/FormatManager';
import ImageUpload from '../../component/ImageUpload';
import TablePicker from '../../component/TablePicker';

const ROLE_API = 'roles/';
const ROLE_TABLE_FIELDS = [
    {
        name: 'id',
        align: 'center',
        display_name: 'Id',
        sortable: true,
    },
    {
        name: 'name',
        align: 'left',
        display_name: 'Name',
        sortable: true,
    },
    {
        name: 'description',
        align: 'left',
        display_name: 'Description',
        sortable: true,
    },
];

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
    avatar: {
        margin: 10,
    },
});

class UserSetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userStatus: [
                { display: 'Active', key: 'ACTIVE' },
                { display: 'Inactive', key: 'PENDING' },
            ],
            userGender: [
                { display: 'Male', key: 'male' },
                { display: 'Female', key: 'female' },
            ],
            image: null,
            status: 'ACTIVE',
            roles: [],
            showLoading: false,
            showError: false,
            pageCount: 1,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) this._loadData();
    }

    _loadData = async () => {
        this.setState({ showLoading: true });
        try {
            const data = await UserApi.getById(this.props.match.params.id);

            if (data) {
                var image;
                if (data.profile_image) image = data.profile_image;

                this.setState({
                    id: data.id,
                    user_name: data.user_name,
                    email: data.email,
                    status: data.status,
                    roles: data.roles,
                    password: 'PWD123456',
                    showLoading: false,
                    image: image,
                });
                if (data.extras) {
                    this.setState({
                        address: data.extras.address ? data.extras.address : '',
                        gender: data.extras.gender ? data.extras.gender : '',
                        phone: data.extras.phone ? data.extras.phone : '',
                    });
                }
                if (data.display_name) {
                    this.setState({ display_name: data.display_name.uni ? data.display_name.uni : data.display_name });
                }
            }
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again!' });
        }
    };

    validateForm() {
        var user_nameError = false;
        var display_nameError = false;
        var emailError = false;
        var passwordError = false;
        var confirm_passwordError = false;
        var statusError = false;

        if (!this.props.match.params.id) {
            if (!this.state.display_name || this.state.display_name === '') {
                display_nameError = true;
            }

            if (!this.state.user_name || this.state.user_name === '') {
                user_nameError = true;
            }

            if (!FormatManager.ValidateUser(this.state.user_name)) {
                user_nameError = true;
            }

            if (!FormatManager.ValidateEmail(this.state.email)) {
                emailError = true;
            }

            if (!this.state.password || this.state.password === '' || this.state.password.length <= 6) {
                passwordError = true;
            }

            if (this.state.password !== this.state.confirm_password) {
                confirm_passwordError = true;
            }
        }

        if (!this.state.display_name || this.state.display_name === '') {
            display_nameError = true;
        }

        if (!this.state.status) statusError = true;

        this.setState({
            display_nameError: display_nameError,
            user_nameError: user_nameError,
            emailError: emailError,
            passwordError: passwordError,
            confirm_passwordError: confirm_passwordError,
            statusError: statusError,
        });

        return !display_nameError && !user_nameError && !emailError && !passwordError && !confirm_passwordError && !statusError;
    }

    goBack() {
        this.props.history.push('/user/setup');
    }

    onSaveItem = async () => {
        if (!this.validateForm()) {
            return;
        }

        this.setState({ showLoading: true });
        var user = {
            display_name: this.state.display_name,
            user_name: this.state.user_name,
            email: this.state.email,
            password: this.state.password,
            status: this.state.status,
            extras: {
                address: this.state.address,
                phone: this.state.phone,
                gender: this.state.gender,
            },
        };

        try {
            if (this.state.roles.length) {
                var roles = [];
                for (const role of this.state.roles) {
                    roles.push({ id: role.id });
                }
                user.roles = roles;
            }

            if (this.state.image && this.state.image.id) {
                user.profile_image = {
                    id: this.state.image.id,
                };
            } else if (this.state.image && !this.state.image.id) {
                var fileResponse;

                fileResponse = await FileApi.upload(this.state.image);

                if (fileResponse)
                    user.profile_image = {
                        id: fileResponse.id,
                    };
            } else {
                user.profile_image = null;
            }

            console.log('User Image => ', user);

            if (this.props.match.params.id) {
                user.id = this.state.id;
                const response = await UserApi.update(this.state.id, user);
                this.props.dispatch({
                    type: USER_ACTIONS.MODIFIED,
                    id: this.state.id,
                    user: response,
                });
                this.props.match.params.id = null;
                this.props.history.push('/user/setup?callback=success');
            } else {
                const response = await UserApi.insert(user);

                this.props.dispatch({
                    type: USER_ACTIONS.CREATE_NEW,
                    user: response,
                });
                this.props.match.params.id = null;
                this.props.history.push('/user/setup?callback=success');
            }
        } catch (error) {
            console.error(error);
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again.' });
        }
    };

    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    };

    handleError = () => {
        this.setState({ showError: false });
    };

    handleImageChange = image => {
        this.setState({ image: image });
    };

    handleRolesChange = items => {
        this.setState({
            roles: items,
        });
    };

    handleGenderChange = event => {
        this.setState({
            gender: event.target.value,
        });
    };

    handleChange = event => {
        this.setState({ status: event.target.value });
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
                        User Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid spacing={2} className={classes.gridContainer} justify="center" container>
                        <Grid item spacing={2} xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container justify="center">
                                    <ImageUpload id="imageUpload" onImageChange={this.handleImageChange} source={this.state.image} />
                                </Grid>
                                <Divider className={classes.divider} light component="h3" />
                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.display_nameError ? 'error' : 'primary'}>
                                            person_outline
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

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.user_nameError ? 'error' : 'primary'}>
                                            person
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            disabled={this.props.match.params.id ? true : false}
                                            id="user_name"
                                            color="primary"
                                            label="User Name*"
                                            error={this.state.user_nameError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.user_name ? this.state.user_name : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>{this.state.user_nameError ? 'invalid user name field!' : ''}</div>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.emailError ? 'error' : 'primary'}>
                                            email
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            disabled={this.props.match.params.id ? true : false}
                                            id="email"
                                            color="primary"
                                            label="Email*"
                                            error={this.state.emailError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.email ? this.state.email : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>{this.state.emailError ? 'invalid email field!' : ''}</div>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color="primary">
                                            location_on
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="address"
                                            color="primary"
                                            label="Address"
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.address ? this.state.address : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color="primary">
                                            local_phone
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="phone"
                                            color="primary"
                                            label="Phone"
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.phone ? this.state.phone : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="flex-end">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color="primary">
                                            wc
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl fullWidth className={classes.formControl}>
                                            <InputLabel htmlFor="gender">Gender</InputLabel>
                                            <Select
                                                className={classes.select}
                                                value={this.state.gender ? this.state.gender : ''}
                                                onChange={this.handleGenderChange}
                                                input={<Input id="gender" />}
                                                MenuProps={{ className: classes.menu }}
                                            >
                                                {this.state.userGender.map(option => (
                                                    <MenuItem key={option.key} value={option.key}>
                                                        {option.display}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {this.props.match.params.id ? (
                                    ''
                                ) : (
                                    <div>
                                        <Grid container spacing={2} alignItems="flex-start">
                                            <Grid item>
                                                <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.passwordError ? 'error' : 'primary'}>
                                                    lock
                                                </Icon>
                                            </Grid>
                                            <Grid item xs={11} sm={11} md={11} lg={11}>
                                                <TextField
                                                    id="password"
                                                    color="primary"
                                                    label="Password*"
                                                    error={this.state.passwordError ? true : false}
                                                    fullWidth
                                                    type="password"
                                                    className={classes.textField}
                                                    value={this.state.password ? this.state.password : ''}
                                                    margin="dense"
                                                    onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                                />
                                                <div className={classes.form_error}>{this.state.passwordError ? 'invalid password field!' : ''}</div>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} alignItems="flex-start">
                                            <Grid item>
                                                <Icon
                                                    style={{ fontSize: 22, paddingTop: 25 }}
                                                    color={this.state.confirm_passwordError ? 'error' : 'primary'}
                                                >
                                                    lock
                                                </Icon>
                                            </Grid>
                                            <Grid item xs={11} sm={11} md={11} lg={11}>
                                                <TextField
                                                    id="confirm_password"
                                                    color="primary"
                                                    label="confirm_password*"
                                                    error={this.state.confirm_passwordError ? true : false}
                                                    fullWidth
                                                    type="password"
                                                    className={classes.textField}
                                                    value={this.state.confirm_password ? this.state.confirm_password : ''}
                                                    margin="dense"
                                                    onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                                />
                                                <div className={classes.form_error}>
                                                    {this.state.confirm_passwordError ? "password doesn't match!" : ''}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                )}

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color="primary">
                                            whatshot
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TablePicker
                                            title="Choose Roles"
                                            fields={ROLE_TABLE_FIELDS}
                                            apiURL={ROLE_API}
                                            initData={this.state.roles}
                                            onItemLabelWillLoad={item => item.name}
                                            onSelectionChange={this.handleRolesChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color="primary">
                                            code
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="status"
                                            color="primary"
                                            select
                                            fullWidth
                                            label="Select Status"
                                            className={classes.textField}
                                            value={this.state.status}
                                            onChange={this.handleChange}
                                            SelectProps={{
                                                native: true,
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            margin="dense"
                                        >
                                            {this.state.userStatus.map(option => (
                                                <option key={option.key} value={option.key}>
                                                    {option.display}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} alignItems="center" justify="space-evenly">
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
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

UserSetupPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(UserSetupPage)));
