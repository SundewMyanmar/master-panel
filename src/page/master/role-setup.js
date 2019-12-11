import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { withStyles, Paper, TextField, Icon, Button, Grid, Divider, Typography } from '@material-ui/core';

import { primary, action, background } from '../../config/Theme';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import ErrorDialog from '../../component/Dialogs/ErrorDialog';
import RoleApi from '../../api/RoleApi';
import { ROLE_ACTIONS } from '../../redux/RoleRedux';

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
        paddingBottom: 0
    },
    form_error: {
        color: action.error
    },
    select: {
        width: '100%',
        marginTop: 32
    }
});

class RoleSetupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            showError: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id)
            this._loadData();
    }

    _loadData = async () => {
        this.setState({ showLoading: true });
        try {
            const data = await RoleApi.getById(this.props.match.params.id);
            if (data) {
                this.setState({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    showLoading: false,
                });
            }
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: "Please check your internet connection and try again!" });
        }
    }

    validateForm() {
        var nameError = false;

        if (!this.state.name)
            nameError = true;

        this.setState({
            nameError: nameError,
        });

        return !nameError;
    }

    goBack() {
        this.props.history.push("/role/setup")
    }

    onSaveItem = async () => {
        if (!this.validateForm()) {
            return;
        }

        this.setState({ showLoading: true });
        var role = {
            "name": this.state.name,
            "description": this.state.description,
        }

        try {
            if (this.props.match.params.id) {
                role.id = this.state.id;
                const response = await RoleApi.update(this.state.id, role);
                this.props.dispatch({
                    type: ROLE_ACTIONS.MODIFIED,
                    id: this.state.id,
                    role: response
                });
                this.props.match.params.id = null;
                this.props.history.push("/role/setup?callback=success");
            } else {
                const response = await RoleApi.insert(role);
                this.props.dispatch({
                    type: ROLE_ACTIONS.CREATE_NEW,
                    role: response,
                });
                this.props.match.params.id = null;
                this.props.history.push("/role/setup?callback=success");
            }
        } catch (error) {
            console.error(error);
            this.setState({ showLoading: false, showError: true, errorMessage: "Please check your internet connection and try again." });
        }
    }

    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    }

    handleError = () => {
        this.setState({ showError: false });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <ErrorDialog showError={this.state.showError} title="Oops!" description={this.state.errorMessage} handleError={this.handleError} />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: "center" }} color="primary" variant="h5" component="h3">
                        Role Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.nameError ? "error" : "primary"}>verified_user</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="name"
                                            color="primary"
                                            label="Name*"
                                            error={this.state.nameError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.name ? this.state.name : ""}
                                            margin="dense"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>
                                            {this.state.nameError ? "invalid Name field!" : ""}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color="primary">sms</Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="description"
                                            color="primary"
                                            label="Description"
                                            fullWidth
                                            multiline
                                            rows="3"
                                            className={classes.textField}
                                            value={this.state.description ? this.state.description : ""}
                                            margin="dense"
                                            onChange={(event) => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="center" justify="space-evenly">
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{ marginTop: '30px', marginBottom: '20px', color: background.default }} color="primary" variant="contained" size="large" className={classes.button} onClick={() => this.onSaveItem()}>
                                            <Icon className={classes.iconButton}>save</Icon>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid xs={12} sm={6} item md={5} lg={5}>
                                        <Button style={{ marginTop: '30px', marginBottom: '20px', color: primary.main }} variant="contained" size="large" className={classes.button} onClick={() => this.goBack()}>
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

RoleSetupPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        masterpanel: state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(RoleSetupPage)));