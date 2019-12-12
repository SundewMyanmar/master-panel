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
    Tooltip,
    Grid,
    Divider,
    Typography,
    Chip,
    Select,
    MenuItem,
    Input,
    IconButton,
    Radio,
    FormControlLabel,
    FormControl,
    RadioGroup,
} from '@material-ui/core';

import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import RoleApi from '../../api/RoleApi';
import MenuApi from '../../api/MenuApi';
import { MENU_ACTIONS } from '../../redux/MenuRedux';
import { primary, action, background } from '../../config/Theme';
import TableDialog from '../../component/Dialogs/TableDialog';
import MaterialIconDialog from '../../component/Dialogs/MaterialIconDialog';

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
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    chipContainer: {
        display: 'flex',
        justifyContent: 'start',
        flexWrap: 'wrap',
    },
    chipPaper: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(1),
        width: '100%',
    },
    paperHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    chipButton: {
        width: 'calc(50%)',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    chipLabel: {
        width: 'calc(50%)',
        textAlign: 'start',
        paddingLeft: theme.spacing(1),
    },
    chipDivider: {
        marginBottom: theme.spacing(1),
    },
});

class MenuSetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'ACTIVE',
            roles: [],
            roleItems: [],
            menus: [],
            showTable: false,
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
        this._loadRoles();
        this.paging();
    }

    _loadRoles = async () => {
        this.setState({ showLoading: true });
        try {
            const response = await RoleApi.getAll();
            if (response.data && response.data.length > 0) {
                this.setState(
                    {
                        roleItems: response.data,
                        showLoading: false,
                        roles: [],
                    },
                    () => {
                        if (this.props.match.params.id) this._loadData();
                    },
                );
            } else {
                if (this.props.match.params.id) this._loadData();
            }
        } catch (error) {
            this.setState({ showLoading: false, showError: true, errorMessage: 'Please check your internet connection and try again!' });
        }
    };

    paging = async () => {
        try {
            var result = await MenuApi.getPaging(this.state.currentPage, this.state.pageSize, 'id:ASC', this.state.searchFilter);
            this.setState({ total: result.total, pageCount: result.page_count, showLoading: false });

            for (var i = 0; i < result.data.length; i++) {
                var role = '';
                if (result.data[i].roles) {
                    for (var j = 0; j < result.data[i].roles.length; j++) {
                        if (role !== '') role += ', ';

                        role += result.data[i].roles[j].name;
                    }
                }
                result.data[i].role_data = role;
            }

            for (var k = 0; k < result.data.length; k++) {
                var menu = '';
                if (result.data[k].children) {
                    for (var l = 0; l < result.data[k].children.length; l++) {
                        if (menu !== '') menu += ', ';

                        menu += result.data[k].children[l].name;
                    }
                }
                result.data[k].child_menu = menu;
            }

            if (result.count > 0) {
                this.props.dispatch({
                    type: MENU_ACTIONS.INIT_DATA,
                    data: result.data,
                });
            } else {
                this.props.dispatch({
                    type: MENU_ACTIONS.INIT_DATA,
                    data: [],
                });

                this.setState({ showLoading: false, showError: true, errorMessage: 'There is no data to show.' });
            }
        } catch (error) {
            this.props.dispatch({
                type: MENU_ACTIONS.INIT_DATA,
                data: [],
            });
        }
    };

    _loadData = async () => {
        this.setState({ showLoading: true });
        try {
            const data = await MenuApi.getById(this.props.match.params.id);

            if (data) {
                var roles = [];
                if (data.roles && data.roles.length > 0) {
                    for (var i = 0; i < this.state.roleItems.length; i++) {
                        for (var j = 0; j < data.roles.length; j++) {
                            if (this.state.roleItems[i].id === data.roles[j].id) {
                                roles.push(this.state.roleItems[i]);
                                break;
                            }
                        }
                    }
                }

                this.setState({
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    state: data.state,
                    parent_id: data.parent_id,
                    selectedValue: data.type,
                    roles: roles,
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

    handleTableDialog = () => {
        this.setState({ showTable: !this.state.showTable });
    };

    selected = id => this.state.menus.map(t => t.id).indexOf(id) !== -1;

    chipDelete = data => {
        const chipData = [...this.state.menus];
        const chipToDelete = chipData.indexOf(data);
        chipData.splice(chipToDelete, 1);
        this.setState({ menus: chipData });
    };

    handleRowClick = (event, data) => {
        const { menus } = this.state;
        const selectedIndex = menus.map(t => t.id).indexOf(data.id);

        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(menus, data);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(menus.slice(1));
        } else if (selectedIndex === menus.length - 1) {
            newSelected = newSelected.concat(menus.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(menus.slice(0, selectedIndex), menus.slice(selectedIndex + 1));
        }
        this.setState({ menus: newSelected });
    };

    handleChangePage(e) {}

    handleChangeRowsPerPage(e, _this) {
        _this.setState(
            {
                pageSize: e.target.value,
            },
            () => {
                _this.paging();
            },
        );
    }

    pageChange = (pageParam, _this) => {
        var currentPage = _this.state.currentPage;
        if (pageParam === 'first') {
            currentPage = 0;
        } else if (pageParam === 'previous') {
            if (currentPage > 0) currentPage -= 1;
            else currentPage = _this.state.pageCount - 1;
        } else if (pageParam === 'forward') {
            if (currentPage === _this.state.pageCount - 1) currentPage = 0;
            else currentPage += 1;
        } else if (pageParam === 'last') {
            currentPage = _this.state.pageCount - 1;
        }

        _this.setState(
            {
                currentPage: currentPage,
                showLoading: true,
            },
            () => {
                _this.paging();
            },
        );
    };

    onKeyDown = e => {
        if (e.keyCode === 13) {
            this.onSearch();
        }
    };

    onSearch() {
        this.setState(
            {
                currentPage: 0,
            },
            () => {
                this.paging();
            },
        );
    }

    filterTextChange = (key, value) => {
        this.setState({
            searchFilter: value,
        });
    };

    radioHandleChange(_this, event) {
        _this.setState({
            selectedValue: event.target.value,
        });
    }

    loadIconDialog() {
        console.log('load');
        this.setState({
            showIconDialog: true,
        });
    }

    closeIconDialog(result, _this) {
        if (!result) {
            result = _this.state.icon;
        }
        _this.setState({
            showIconDialog: false,
            icon: result,
        });
    }

    render() {
        const { classes } = this.props;

        const handleRoleChange = event => {
            this.setState({
                roles: event.target.value,
            });
        };

        const fields = [
            {
                name: '',
                align: 'center',
                display_name: '',
            },
            {
                name: 'id',
                align: 'center',
                display_name: 'Id',
            },
            {
                name: 'name',
                align: 'left',
                display_name: 'Name',
            },
            {
                name: 'icon',
                align: 'left',
                display_name: 'Icon',
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
            {
                name: 'child_menu',
                align: 'left',
                display_name: 'Child Menu',
            },
            {
                name: 'is_divider',
                align: 'center',
                display_name: 'Divider',
            },
        ];

        return (
            <div>
                <LoadingDialog showLoading={this.state.showLoading} message="Loading please wait!" />
                <AlertDialog showDialog={this.state.showError} title="Oops!" description={this.state.errorMessage} onClickOk={this.handleError} />
                <MaterialIconDialog showDialog={this.state.showIconDialog} onIconClick={this.closeIconDialog} _this={this} />
                <TableDialog
                    tableTitle="Menu List"
                    fields={fields}
                    items={this.props.masterpanel.menu}
                    searchText={this.state.searchFilter}
                    filterTextChange={this.filterTextChange}
                    onKeyDown={this.onKeyDown}
                    onOpenDialog={this.state.showTable}
                    onCloseDialog={this.handleTableDialog}
                    isSelected={this.selected}
                    handleRowClick={this.handleRowClick}
                    pageChange={this.pageChange}
                    total={this.state.total}
                    pageSize={this.state.pageSize}
                    currentPage={this.state.currentPage}
                    handleChangePage={this.handleChangePage}
                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                    _this={this}
                    multi={true}
                />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: 'center' }} color="primary" variant="h5" component="h3">
                        Menu Setup
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={8} lg={6}>
                            <form className={classes.form} autoComplete="off">
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.nameError ? 'error' : 'primary'}>
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
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.iconError ? 'error' : 'primary'}>
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
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.stateError ? 'error' : 'primary'}>
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
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color={this.state.typeError ? 'error' : 'primary'}>
                                            code
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <FormControl className={classes.radio} component="fieldset">
                                            <RadioGroup
                                                aria-label="position"
                                                name="position"
                                                value={this.state.selectedValue}
                                                onChange={event => this.radioHandleChange(this, event)}
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
                                <Grid container spacing={8} alignItems="flex-start">
                                    <Grid item>
                                        <Icon style={{ fontSize: 22, paddingTop: 40 }} color="primary">
                                            star
                                        </Icon>
                                    </Grid>
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                        <Select
                                            multiple
                                            className={classes.select}
                                            value={this.state.roles}
                                            onChange={handleRoleChange}
                                            input={<Input id="select-multiple" />}
                                            MenuProps={{ className: classes.menu }}
                                        >
                                            {this.state.roleItems.map(option => (
                                                <MenuItem key={option.id} value={option}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="center">
                                    <Paper className={classes.chipPaper}>
                                        <div className={classes.paperHeader}>
                                            <div className={classes.chipLabel}>
                                                <Typography
                                                    style={this.state.clientError ? { color: '#f44336' } : { color: 'rgba(0, 0, 0, 0.87)' }}
                                                    variant="subtitle1"
                                                    gutterBottom
                                                >
                                                    Child Menu
                                                </Typography>
                                            </div>
                                            <div className={classes.chipButton}>
                                                <Tooltip title="Add Child" placement="left">
                                                    <IconButton onClick={() => this.handleTableDialog()} color="primary" aria-label="Add Child">
                                                        <Icon>add</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <Divider light className={classes.chipDivider} />
                                        <div className={classes.chipContainer}>
                                            {this.state.menus.map(data => {
                                                return (
                                                    <Chip
                                                        key={data.id}
                                                        label={data.name}
                                                        className={classes.chip}
                                                        onDelete={() => this.chipDelete(data)}
                                                        color="primary"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </Paper>
                                </Grid>
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
