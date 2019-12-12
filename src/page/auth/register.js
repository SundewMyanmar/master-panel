import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Icon, Button, IconButton, Divider, Grid, Typography, InputBase, Paper } from '@material-ui/core';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import uuid from 'uuid/v5';
import { primary, secondary, action, background, text } from '../../config/Theme';
import AuthApi from '../../api/AuthApi';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import FormatManager from '../../util/FormatManager';
import * as DeviceDetect from 'react-device-detect';

const styles = theme => ({
    root: {
        background: primary.light,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    container: {
        padding: 5,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
    textField: {
        width: 'calc(100% - 8px)',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    cardBox: {
        backgroundColor: primary.contrastText,
        borderRadius: 3,
        margin: '40px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
        transition: '0.3s',
    },
    media: {
        width: 'calc(100%)',
        paddingTop: '20px',
        margin: 'auto',
        height: 140,
    },
    cardActions: {
        display: 'inline-block',
        width: '100%',
    },
    txtContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 'calc(100%)',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
    },
    inputContainer: {
        margin: '30px 0 0 0',
        padding: '2px 2px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 0,
        paddingBottom: 0,
    },
    iconLabel: {
        marginTop: 4,
    },
    divider: {
        backgroundColor: theme.palette.primary.main,
        width: 1,
        height: 28,
        margin: 4,
    },
    logo: {
        width: 120,
        height: 120,
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    },
    errorTxt: {
        color: action.warn,
        paddingLeft: '4px',
    },
    errorIcon: {
        color: action.warn,
        fontSize: '16px',
    },
    img: {
        width: '150px',
        height: '150px',
        borderRadius: '15px',
    },
});

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            user: '',
            password: '',
            confirmPassword: '',
            displayName: '',

            showLoading: false,
            showError: false,

            emailError: false,
            userError: false,
            passwordError: false,
            confirmPasswordError: false,
            displayNameError: false,
            errorMessage: '',
        };
    }

    onChangeText = (key, value, password) => {
        var emailError = false;
        var userError = false;
        if (key === 'email') {
            emailError = !FormatManager.ValidateEmail(value);
        }

        if (key === 'user') {
            userError = !FormatManager.ValidateUser(value);
        }

        this.setState(
            {
                [key]: value,
                emailError: emailError,
                userError: userError,
            },
            () => {
                var confirmPasswordError = false;
                if (password) {
                    if (value !== this.state.password) {
                        confirmPasswordError = true;
                    }
                }
                this.setState({
                    confirmPasswordError: confirmPasswordError,
                });
            },
        );
    };

    validating = () => {
        var emailError, userError, displayNameError, passwordError, confirmPasswordError;

        if (this.state.email === '' || !FormatManager.ValidateEmail(this.state.email)) {
            this.setState({ emailError: true });
            return true;
        } else emailError = false;

        if (this.state.user === '' || !FormatManager.ValidateUser(this.state.user) || this.state.user.length < 6) {
            this.setState({ userError: true });
            return true;
        } else userError = false;

        if (this.state.displayName === '') {
            this.setState({ displayNameError: true });
            return true;
        } else displayNameError = false;

        if (this.state.password === '') {
            this.setState({ passwordError: true });
            return true;
        } else passwordError = false;

        if (this.state.confirmPassword === '') {
            this.setState({ confirmPasswordError: true });
            return true;
        } else confirmPasswordError = false;

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ confirmPasswordError: true });
            return true;
        } else confirmPasswordError = false;

        this.setState({
            emailError: emailError,
            userError: userError,
            displayNameError: displayNameError,
            passwordError: passwordError,
            confirmPasswordError: confirmPasswordError,
        });

        return false;
    };

    onRegisterButtonClick = async () => {
        if (this.validating()) return;

        this.setState({ showLoading: true });

        const deviceId = uuid(this.state.user, uuid.URL);
        const userData = {
            email: this.state.email,
            user: this.state.user,
            display_name: this.state.displayName,
            password: this.state.password,
            device_id: deviceId,
            device_os: DeviceDetect.osName + DeviceDetect.osVersion,
        };

        try {
            const data = await AuthApi.register(userData);

            if (data) {
                this.setState({ showLoading: false });
                this.props.history.push('/login?callback=success');
            }
        } catch (error) {
            if (error) {
                this.setState({ showLoading: false, errorMessage: error.response.data.content.message });
                this.handleError();
            } else {
                this.setState({ showLoading: false, errorMessage: 'Please check your internet connection and try again.' });
                this.handleError();
            }
        }
    };

    handleClickShowPassword = name => {
        this.setState({ [name]: !this.state[name] });
    };

    handleError = () => {
        this.setState({ showError: !this.state.showError });
    };

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.onRegisterButtonClick();
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AlertDialog title="Oops!" description={this.state.errorMessage} showDialog={this.state.showError} onClickOk={this.handleError} />
                <LoadingDialog showLoading={this.state.showLoading} message="Please wait registering!" />
                <Grid className={classes.container} container spacing={24} alignItems="center" justify="center">
                    <Grid style={{ padding: '22px' }} className={classes.cardBox} item xs={12} sm={8} md={6} lg={4}>
                        <Grid container justify="center">
                            <img src="res/logo.png" alt="SUNDEW MYANMAR" title="SUNDEW MYANMAR" className={classes.img} />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider light style={{ margin: '20px 0' }} />
                        </Grid>
                        <Grid item>
                            <Paper className={classes.inputContainer} elevation={1}>
                                <Icon className={classes.iconButton} color="primary">
                                    mail
                                </Icon>
                                <Divider className={classes.divider} />
                                <InputBase
                                    autoFocus
                                    name="email"
                                    style={{ color: text.dark }}
                                    className={classes.input}
                                    placeholder="email address"
                                    onChange={event => this.onChangeText(event.target.name, event.target.value)}
                                />
                            </Paper>
                            {this.state.emailError ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                    <Icon className={classes.errorIcon}>warning</Icon>
                                    <Typography className={classes.errorTxt} variant="caption">
                                        invalid email address.
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="caption"></Typography>
                            )}

                            <Paper className={classes.inputContainer} elevation={1}>
                                <Icon className={classes.iconButton} color="primary">
                                    person
                                </Icon>
                                <Divider className={classes.divider} />
                                <InputBase
                                    autoFocus
                                    name="user"
                                    style={{ color: text.dark }}
                                    className={classes.input}
                                    placeholder="user name, eg. mgmg123"
                                    onChange={event => this.onChangeText(event.target.name, event.target.value)}
                                />
                            </Paper>
                            {this.state.userError ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                    <Icon className={classes.errorIcon}>warning</Icon>
                                    <Typography className={classes.errorTxt} variant="caption">
                                        invalid user name.
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="caption"></Typography>
                            )}

                            <Paper className={classes.inputContainer} elevation={1}>
                                <Icon className={classes.iconButton} color="primary">
                                    label
                                </Icon>
                                <Divider className={classes.divider} />
                                <InputBase
                                    autoFocus
                                    name="displayName"
                                    style={{ color: text.dark }}
                                    className={classes.input}
                                    placeholder="display name"
                                    onChange={event => this.onChangeText(event.target.name, event.target.value)}
                                />
                            </Paper>
                            {this.state.displayNameError ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                    <Icon className={classes.errorIcon}>warning</Icon>
                                    <Typography className={classes.errorTxt} variant="caption">
                                        invalid display name.
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="caption"></Typography>
                            )}

                            <Divider light style={{ margin: '30px 0' }} />

                            <Paper className={classes.inputContainer} elevation={1}>
                                <Icon className={classes.iconButton} color="primary">
                                    lock
                                </Icon>
                                <Divider className={classes.divider} />
                                <InputBase
                                    name="password"
                                    style={{ color: text.dark }}
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    className={classes.input}
                                    placeholder="password"
                                    onKeyPress={this.handleKeyPress}
                                    onChange={event => this.onChangeText(event.target.name, event.target.value, true)}
                                />
                                <IconButton
                                    className={classes.iconButton}
                                    aria-label="password"
                                    onClick={() => this.handleClickShowPassword('showPassword')}
                                >
                                    {this.state.showPassword ? <Icon color="primary">visibility</Icon> : <Icon color="primary">visibility_off</Icon>}
                                </IconButton>
                            </Paper>
                            {this.state.passwordError ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                    <Icon className={classes.errorIcon}>warning</Icon>
                                    <Typography className={classes.errorTxt} variant="caption">
                                        invalid password.
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="caption"></Typography>
                            )}

                            <Paper className={classes.inputContainer} elevation={1}>
                                <Icon className={classes.iconButton} color="primary">
                                    lock
                                </Icon>
                                <Divider className={classes.divider} />
                                <InputBase
                                    name="confirmPassword"
                                    style={{ color: text.dark }}
                                    type={this.state.confirmShowPassword ? 'text' : 'password'}
                                    className={classes.input}
                                    placeholder="confirm password"
                                    onKeyPress={this.handleKeyPress}
                                    onChange={event => this.onChangeText(event.target.name, event.target.value, true)}
                                />
                                <IconButton
                                    className={classes.iconButton}
                                    aria-label="password"
                                    onClick={() => this.handleClickShowPassword('confirmShowPassword')}
                                >
                                    {this.state.confirmShowPassword ? (
                                        <Icon color="primary">visibility</Icon>
                                    ) : (
                                        <Icon color="primary">visibility_off</Icon>
                                    )}
                                </IconButton>
                            </Paper>
                            {this.state.confirmPasswordError ? (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                                    <Icon className={classes.errorIcon}>warning</Icon>
                                    <Typography className={classes.errorTxt} variant="caption">
                                        invalid confirm password.
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="caption"></Typography>
                            )}

                            <Button
                                style={{ marginTop: '30px', marginBottom: '0' }}
                                color="primary"
                                variant="contained"
                                size="large"
                                className={classes.button}
                                onClick={() => this.onRegisterButtonClick()}
                            >
                                <Icon className={classes.iconButton}>assignment_turned_in</Icon>
                                Register
                            </Button>

                            <Divider light style={{ margin: '20px 0' }} />

                            <Typography style={{ textAlign: 'center', margin: '0px 0px 8px 0px', fontSize: '14px' }} variant="subtitle1">
                                Copyright © 2019 {new Date().getFullYear() <= 2019 ? '' : '-' + new Date().getFullYear()} by{' '}
                                <a
                                    style={{ color: secondary.main, textDecoration: 'none' }}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href="http://www.sundewmyanmar.com/"
                                >
                                    SUNDEW MYANMAR
                                </a>
                                . <br />
                                All rights reserved.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

RegisterPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(connect()(withStyles(styles)(RegisterPage)));
