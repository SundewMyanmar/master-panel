import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
    withStyles,
    InputLabel,
    InputAdornment,
    Paper,
    TextField,
    Icon,
    Button,
    Grid,
    Divider,
    Typography,
    Input,
    IconButton,
    Radio,
    FormControlLabel,
    FormControl,
    RadioGroup,
} from '@material-ui/core';

import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import MenuApi from '../../api/MenuApi';
import { MENU_ACTIONS } from '../../redux/MenuRedux';
import { primary, action, background } from '../../config/Theme';
import MaterialIconDialog from '../../component/Dialogs/MaterialIconDialog';
import TablePicker from '../../component/TablePicker';

const MENU_API = 'menus/';
const MENU_TABLE_FIELDS = [
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
        name: 'state',
        align: 'left',
        display_name: 'State',
    },
    {
        name: 'type',
        align: 'left',
        display_name: 'Type',
    },
    {
        name: 'role_data',
        align: 'left',
        display_name: 'Roles',
    },
];

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
    inputContainer: {
        marginTop: 18,
        marginLeft: -8,
        width: '100%',
    },
    inputLabel: {
        paddingLeft: 11,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    radio: {
        paddingTop: 27,
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
    tablePicker: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
});

class MenuSetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'ACTIVE',
            roles: [],
            menus: [],
            showMenuTable: false,
            showRoleTable: false,
            showError: false,
            showLoading: false,
            currentPage: 0,
            pageSize: 10,
            total: 0,
            pageCount: 1,
            selectedValue: 'folder',
            showIconDialog: false,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const id = this.props.match.params.id;
        if (!id || typeof id === 'undefined') {
            return;
        }

        this.setState({ showLoading: true });
        try {
            console.log('This props.match.params.id => ', id);
            const data = await MenuApi.getById(id);

            if (data) {
                this.setState({
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    state: data.state,
                    parent_id: data.parent_id,
                    selectedValue: data.type,
                    roles: data.roles,
                    menus: data.children,
                    showLoading: false,
                });
            }
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again!' });
        }
    };

    validateForm() {
        var nameError = false;
        var iconError = false;
        var stateError = false;
        var typeError = false;

        if (!this.state.name) nameError = true;

        if (!this.state.icon) iconError = true;

        if (!this.state.state) stateError = true;

        if (!this.state.selectedValue) typeError = true;

        this.setState({
            nameError: nameError,
            iconError: iconError,
            stateError: stateError,
            typeError: typeError,
        });

        return !nameError && !iconError && !stateError && !typeError;
    }

    goBack() {
        this.props.history.push('/menu/setup');
    }

    onSaveItem = async () => {
        if (!this.validateForm()) {
            return;
        }

        const childMenus = this.state.menus.map(menu => ({ id: menu.id }));

        this.setState({ showLoading: true });
        var menu = {
            name: this.state.name,
            icon: this.state.icon,
            state: this.state.state,
            type: this.state.selectedValue,
            roles: this.state.roles,
            children: childMenus,
            parent_id: this.state.parent_id,
        };

        try {
            if (this.props.match.params.id) {
                menu.id = this.state.id;
                const response = await MenuApi.update(this.state.id, menu);
                this.props.dispatch({
                    type: MENU_ACTIONS.MODIFIED,
                    id: this.state.id,
                    menu: response,
                });
                this.props.match.params.id = null;
                this.props.history.push('/menu/setup?callback=success');
            } else {
                const response = await MenuApi.insert(menu);
                this.props.dispatch({
                    type: MENU_ACTIONS.CREATE_NEW,
                    menu: response,
                });
                this.props.match.params.id = null;
                this.props.history.push('/menu/setup?callback=success');
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

    handleRadioChange = event => {
        this.setState({
            selectedValue: event.target.value,
        });
    };

    loadIconDialog() {
        console.log('load');
        this.setState({
            showIconDialog: true,
        });
    }

    closeIconDialog = result => {
        if (!result) {
            result = this.state.icon;
        }
        this.setState({
            showIconDialog: false,
            icon: result,
        });
    };

    handleRolesChange = items => {
        this.setState({
            roles: items,
        });
    };

    handleChildMenuChange = items => {
        this.setState({
            menus: items,
        });
    };

    render() {
        const { classes } = this.props;

        console.log('Current State => ', this.state);

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog
                    showDialog={this.state.showError}
                    title="Oops!"
                    description={this.state.errorMessage}
                    onOkButtonClick={this.handleError}
                />
                <MaterialIconDialog showDialog={this.state.showIconDialog} onIconClick={this.closeIconDialog} />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: 'center' }} color="primary" variant="h5" component="h3">
                        Menu Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.nameError ? 'error' : 'primary'}>
                                            menu
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="name"
                                            color="primary"
                                            label="Name*"
                                            error={this.state.nameError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.name ? this.state.name : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>{this.state.nameError ? 'invalid name field!' : ''}</div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 32 }} color={this.state.iconError ? 'error' : 'primary'}>
                                            {this.state.icon ? this.state.icon : 'toys'}
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.inputContainer}>
                                            <InputLabel className={classes.inputLabel} htmlFor="iconInput">
                                                Icon*
                                            </InputLabel>
                                            <Input
                                                id="icon"
                                                color="primary"
                                                label="Icon*"
                                                error={this.state.iconError ? true : false}
                                                fullWidth
                                                className={classes.input}
                                                value={this.state.icon ? this.state.icon : ''}
                                                margin="dense"
                                                onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => this.loadIconDialog()}>
                                                            <Icon style={{ fontSize: 22 }} color={this.state.iconError ? 'error' : 'primary'}>
                                                                games
                                                            </Icon>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <div className={classes.form_error}>{this.state.iconError ? 'invalid icon field!' : ''}</div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 25 }} color={this.state.stateError ? 'error' : 'primary'}>
                                            toc
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <TextField
                                            id="state"
                                            color="primary"
                                            label="State*"
                                            error={this.state.stateError ? true : false}
                                            fullWidth
                                            className={classes.textField}
                                            value={this.state.state ? this.state.state : ''}
                                            margin="dense"
                                            onChange={event => this.onChangeText(event.target.id, event.target.value)}
                                        />
                                        <div className={classes.form_error}>{this.state.stateError ? 'invalid state field!' : ''}</div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 35 }} color={this.state.typeError ? 'error' : 'primary'}>
                                            code
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.radio} component="fieldset">
                                            <RadioGroup
                                                aria-label="position"
                                                name="position"
                                                value={this.state.selectedValue}
                                                onChange={event => this.handleRadioChange(event)}
                                                row
                                            >
                                                <FormControlLabel
                                                    value="folder"
                                                    control={<Radio color="primary" />}
                                                    label="Folder"
                                                    labelPlacement="end"
                                                />
                                                <FormControlLabel
                                                    value="link"
                                                    control={<Radio color="primary" />}
                                                    label="Link"
                                                    labelPlacement="end"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.tablePicker} alignItems="flex-start">
                                    <TablePicker
                                        title="Choose Roles"
                                        fields={ROLE_TABLE_FIELDS}
                                        apiURL={ROLE_API}
                                        initData={this.state.roles}
                                        onItemLabelWillLoad={item => item.name}
                                        onSelectionChange={this.handleRolesChange}
                                    />
                                </Grid>
                                <Grid container className={classes.tablePicker} alignItems="flex-start">
                                    <TablePicker
                                        title="Choose Child Menus"
                                        fields={MENU_TABLE_FIELDS}
                                        apiURL={MENU_API}
                                        initData={this.state.menus}
                                        onItemLabelWillLoad={item => item.name}
                                        onSelectionChange={this.handleChildMenuChange}
                                    />
                                </Grid>
                                <Grid container spacing={3} alignItems="center" justify="space-evenly">
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

MenuSetupPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles)(MenuSetupPage)));
