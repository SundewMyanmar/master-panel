import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Paper,
    Typography,
    Divider,
    Grid,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Icon,
    Collapse,
    ListItemSecondaryAction,
    Checkbox,
} from '@material-ui/core';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import LoadingDialog from '../../component/Dialogs/LoadingDialog';
import AlertDialog from '../../component/Dialogs/AlertDialog';
import TablePicker from '../../component/TablePicker';
import { background } from '../../config/Theme';
import PermissionApi from '../../api/PermissionApi';
import Snackbar from '../../component/Snackbar';

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
    formControl: {
        width: '100%',
    },
    list: {
        border: '1px solid #f8f9fb',
    },
    listItem: {
        borderBottom: '1px solid #f8f9fb',
        padding: 12,
    },
    nestedListItem: {
        paddingLeft: 48,
    },
});

class RoutePermissionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            default_routes: {},
            modified_routes: {},
            role: {},
            showLoading: false,
            showError: false,
            errorMessage: '',
            showSnack: false,
            snackMessage: '',
        };
    }

    componentDidMount() {
        this.setState({
            showLoading: true,
        });
        this.loadDefaultRoutes();
    }

    loadDefaultRoutes = async () => {
        try {
            var result = await PermissionApi.getAvailableRoutes();
            this.setState({
                default_routes: result,
            });
        } catch (error) {
            this.setState({
                default_routes: [],
            });
        }

        this.setState({
            showLoading: false,
        });
    };

    loadRoutesByRoles = async () => {
        if (!this.state.role) return;

        this.setState({
            showLoading: true,
        });

        try {
            var result = await PermissionApi.getPermissionByRoles(this.state.role.id);

            var modified_routes = {};
            Object.keys(this.state.default_routes).forEach(key => {
                if (this.state.default_routes[key] && this.state.default_routes[key].routes) {
                    var routes = this.state.default_routes[key].routes;
                    var count = 0;
                    for (var i = 0; i < routes.length; i++) {
                        for (var j = 0; j < result.length; j++) {
                            if (routes[i].pattern === result[j].pattern && routes[i].method === result[j].http_method) {
                                count++;
                                var route = routes[i];
                                route.data = result[j];
                                route.checked = true;
                                modified_routes[routes[i].method + ':' + routes[i].pattern] = route;
                            }
                        }
                    }

                    if (count === routes.length) {
                        var proute = this.state.default_routes[key];
                        proute.checked = true;
                        modified_routes[key] = proute;
                    }
                }
            });
            this.setState({
                modified_routes: modified_routes,
            });
        } catch (error) {
            this.setState({
                modified_routes: {},
            });
        }
        this.setState({
            showLoading: false,
        });
    };

    onSaveItem = async () => {
        this.setState({
            showLoading: true,
        });
        try {
            var datas = [];
            await Object.keys(this.state.modified_routes).forEach(key => {
                var item = this.state.modified_routes[key];

                var data = {
                    roles: [],
                    checked: item.checked,
                };

                if (item.data) {
                    data.id = item.data.id;
                    data.roles = [];

                    if (item.data.roles) {
                        for (var i = 0; i < item.data.roles.length; i++) {
                            if (item.data.roles[i].id !== this.state.role.id) {
                                data.roles.push({ id: item.data.roles[i].id });
                            }
                        }
                    }
                }

                data.pattern = item.pattern;
                data.http_method = item.method;

                if (item.checked) data.roles.push({ id: this.state.role.id });

                if ((item.checked || (item.data && !item.checked)) && data.pattern !== undefined) {
                    datas.push(data);
                }
            });

            await PermissionApi.insertMulti(datas);
            this.setState({
                snackMessage: 'Permissions saved successful.',
                showSnack: true,
            });
        } catch (error) {
            console.error(error);
        }
        this.setState({
            showLoading: false,
        });
    };

    handleClick = route => {
        var obj = {};
        obj['open' + route.name] = !this.state['open' + route.name];
        this.setState(obj);
    };

    overrideModify = (key, item, modifyData) => {
        if (!modifyData[key]) modifyData[key] = item;
        else {
            modifyData[key].method = item.method;
            modifyData[key].name = item.name;
            modifyData[key].pattern = item.pattern;
        }

        return modifyData;
    };

    handleToggle = (item, key) => {
        var modified_routes = this.state.modified_routes;
        var checkKey = key;

        if (!key) checkKey = item.method + ':' + item.pattern;

        var checked = !modified_routes[checkKey] || !modified_routes[checkKey].checked;

        if (item.routes) {
            //Go a long way to not override all data
            item.routes.forEach(i => {
                modified_routes = this.overrideModify(i.method + ':' + i.pattern, i, modified_routes);

                modified_routes[i.method + ':' + i.pattern].checked = checked;
            });
        }

        if (!key) {
            modified_routes = this.overrideModify(checkKey, item, modified_routes);
        } else modified_routes[checkKey] = item;

        modified_routes[checkKey].checked = checked;

        if (modified_routes[checkKey].data) {
            modified_routes[checkKey].dirty = true;
        }

        this.setState({
            modified_routes: modified_routes,
        });
    };

    renderDefaultRouteItems = items => {
        const { classes } = this.props;

        return items.map((item, index) => {
            return (
                <ListItem button className={classes.nestedListItem} key={item.id ? item.id : index}>
                    <ListItemIcon>
                        <Icon color="primary">language</Icon>
                    </ListItemIcon>
                    <ListItemText primary={item.name} secondary={item.method + ' : ' + item.pattern} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            color="primary"
                            onChange={() => this.handleToggle(item)}
                            checked={
                                this.state.modified_routes[item.method + ':' + item.pattern] &&
                                this.state.modified_routes[item.method + ':' + item.pattern].checked &&
                                this.state.modified_routes[item.method + ':' + item.pattern].method === item.method
                                    ? true
                                    : false
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });
    };

    renderDefaultRoutes() {
        const { classes } = this.props;

        const routes = Object.keys(this.state.default_routes).map(key => (
            <div key={key}>
                <ListItem className={classes.listItem} button onClick={() => this.handleClick(this.state.default_routes[key])}>
                    <ListItemIcon>
                        {this.state['open' + this.state.default_routes[key].name] ? (
                            <Icon color="primary">remove_circle</Icon>
                        ) : (
                            <Icon color="primary">add_circle</Icon>
                        )}
                    </ListItemIcon>
                    <ListItemText primary={this.state.default_routes[key].name} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            color="primary"
                            onChange={() => this.handleToggle(this.state.default_routes[key], key)}
                            checked={this.state.modified_routes[key] && this.state.modified_routes[key].checked ? true : false}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={this.state['open' + this.state.default_routes[key].name]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {this.renderDefaultRouteItems(this.state.default_routes[key].routes)}
                    </List>
                </Collapse>
            </div>
        ));
        return (
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.list}>
                {routes}
            </List>
        );
    }

    handleError = () => {
        this.setState({ showError: !this.state.showError });
    };

    handleRoleChange = role => {
        console.log('Selected Role => ', role);
        this.setState(
            {
                role: role,
            },
            () => {
                this.loadRoutesByRoles();
            },
        );
    };

    handleCloseSnackBar = () => {
        this.setState({ showSnack: false });
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
                    onCloseSnackbar={this.handleCloseSnackBar}
                />
                <Paper className={classes.root} elevation={1}>
                    <Typography style={{ textAlign: 'center' }} color="primary" variant="h5" component="h3">
                        Route Permission
                    </Typography>
                    <Divider className={classes.divider} light component="h3" />
                    <Grid className={classes.gridContainer} justify="center" container>
                        <Grid item xs={12} sm={12} md={7} lg={7}>
                            <Grid container justify="center">
                                <Grid item>
                                    <Icon style={{ fontSize: 22, paddingTop: 18, paddingRight: 5 }} color="primary">
                                        wc
                                    </Icon>
                                </Grid>
                                <Grid item xs={11} sm={11} md={11} lg={11}>
                                    <TablePicker
                                        title="Choose Role"
                                        fields={ROLE_TABLE_FIELDS}
                                        apiURL={ROLE_API}
                                        multiSelect={false}
                                        onItemLabelWillLoad={item => item.name}
                                        onSelectionChange={this.handleRoleChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        style={{ marginTop: '30px', marginBottom: '20px', marginRight: '30px', color: background.default }}
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
                            </Grid>
                            <Divider className={classes.divider} light component="h3" />

                            {this.renderDefaultRoutes()}
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

RoutePermissionPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(RoutePermissionPage)));
