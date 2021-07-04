import React from 'react';
import { withRouter } from 'react-router';
import {
    Typography,
    Container,
    Paper,
    Avatar,
    Icon,
    makeStyles,
    Grid,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Collapse,
    List,
    Divider,
} from '@material-ui/core';
import { AlertDialog, LoadingDialog } from '../../fragment/message';
import { ObjectInput } from '../../fragment/control';
import { ROLE_TABLE_FIELDS } from './Role';
import RoleApi from '../../api/RoleApi';
import RouteApi from '../../api/RouteApi';
import SwaggerApi from '../../api/SwaggerApi';

const styles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        padding: theme.spacing(3),
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    submit: {
        height: 55,
        marginTop: theme.spacing(1),
    },
    expansionPanel: {
        width: '100%',
    },
    listItem: {
        padding: theme.spacing(1),
    },
    route: {
        paddingLeft: theme.spacing(4),
    },
    method: {
        paddingLeft: theme.spacing(4) * 2,
    },
}));

const isPatternMatch = (pattern1, pattern2) => {
    const regexPattern = /\{[^}/]+}/g;
    return pattern1 === pattern2 || pattern1.replace(regexPattern, '%') === pattern2 || pattern1 === pattern2.replace(regexPattern, '%');
};

const ApiPermission = () => {
    const classes = styles();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [expanded, setExpanded] = React.useState([]);
    const [selectedData, setSelectedData] = React.useState([]);
    const [selectedRole, setSelectedRole] = React.useState(null);

    const handleError = (error) => {
        setLoading(false);
        setError(error.message || error.title || 'Please check your internet connection and try again.');
    };

    const [openApi, setOpenApi] = React.useState(() => {
        SwaggerApi.getOpenApiV2()
            .then((data) => {
                setOpenApi(data);
                setLoading(false);
            })
            .catch(handleError);
        return [];
    });

    const handleRoleData = async (currentPage, pageSize, sort, search) => {
        return await RoleApi.getPaging(currentPage, pageSize, sort, search);
    };

    const handleRoleChange = (event) => {
        const role = event.target.value;
        if (!role) {
            return;
        }
        setSelectedRole(role);
        RouteApi.getPermissionByRole(role.id)
            .then((allowRoutes) => {
                const markedData = allowRoutes.data.map((route) => {
                    return route;
                });
                setLoading(false);
                setSelectedData(markedData);
            })
            .catch((error) => {
                setSelectedData([]);
                handleError(error);
            });
    };

    const handleSubmit = () => {
        if (!selectedRole) {
            handleError({ message: 'Please select a role.' });
            return;
        }

        if (!selectedData || selectedData.length <= 0) {
            handleError({ message: 'Please select a route.' });
            return;
        }

        console.log('Selected Data => ', selectedData);
        setLoading(true);

        RouteApi.savePermissionByRole(selectedRole.id, selectedData)
            .then((savedData) => {
                setLoading(false);
                console.log('Response Data => ', savedData.data);
                setSelectedData(savedData.data);
            })
            .catch(handleError);
    };

    const handleToggleModule = (item) => {
        const existIdx = expanded.findIndex((x) => x === item);
        const updateExpandedModules = existIdx < 0 ? [...expanded, item] : expanded.filter((x) => x !== item);
        setExpanded(updateExpandedModules);
    };

    const handleModuleCheck = (event, module) => {
        const checked = event.target.checked;
        const savedData = selectedData.filter((r) => r.module !== module.name);
        if (checked) {
            module.routes.forEach((route) => {
                route.supportedMethods.forEach((method) => {
                    savedData.push({
                        module: module.name,
                        pattern: route.path,
                        httpMethod: method.http,
                    });
                });
            });
        }
        setSelectedData(savedData);
    };

    const handleRouteCheck = (event, module, route) => {
        const checked = event.target.checked;
        const savedData = selectedData.filter((r) => !isPatternMatch(r.pattern, route.path));
        if (checked) {
            route.supportedMethods.forEach((method) => {
                savedData.push({
                    module: module.name,
                    pattern: route.path,
                    httpMethod: method.http,
                });
            });
        }
        setSelectedData(savedData);
    };

    const handleMethodCheck = (event, module, route, method) => {
        const checked = event.target.checked;
        const savedData = selectedData.filter(
            (r) => !(r.module === module.name && r.httpMethod === method.http && isPatternMatch(r.pattern, route.path)),
        );
        if (checked) {
            savedData.push({
                module: module.name,
                pattern: route.path,
                httpMethod: method.http,
            });
        }
        setSelectedData(savedData);
    };

    const renderDefaultMethod = (module, route, method) => {
        const isMarked =
            selectedData.findIndex((r) => r.module === module.name && r.httpMethod === method.http && isPatternMatch(r.pattern, route.path)) >= 0;
        return (
            <div key={module.name + route.path + method.http}>
                <ListItem button className={classes.method}>
                    <ListItemIcon>
                        <Icon color="primary">language</Icon>
                    </ListItemIcon>
                    <ListItemText primary={'[' + method.http.toUpperCase() + '] ' + method.summary} secondary={method.description} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            checked={isMarked}
                            edge="end"
                            color="secondary"
                            onChange={(event) => handleMethodCheck(event, module, route, method)}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    };

    const renderDefaultRoute = (module, route) => {
        const isExpand = expanded.findIndex((x) => x === route.path) >= 0;
        const selectedCount = selectedData.filter((r) => r.module === module.name && isPatternMatch(r.pattern, route.path)).length;
        const isMarked = selectedCount === route.supportedMethods.length;
        const isInterdeminate = selectedCount > 0 && !isMarked;

        return (
            <div key={module.name + route.path}>
                <ListItem button className={classes.route} onClick={() => handleToggleModule(route.path)}>
                    <ListItemIcon>
                        <Icon color="primary">{isExpand ? 'remove_circle' : 'add_circle'}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={route.path} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            color="secondary"
                            onChange={(event) => handleRouteCheck(event, module, route)}
                            checked={isMarked}
                            indeterminate={isInterdeminate}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={isExpand} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {route.supportedMethods.map((method) => renderDefaultMethod(module, route, method))}
                    </List>
                </Collapse>
            </div>
        );
    };

    const renderDefaultModule = (module, index) => {
        const isExpand = expanded.findIndex((x) => x === module.name) >= 0;
        const selectedCount = selectedData.filter((r) => r.module === module.name).length;
        const isMarked = selectedCount === module.count;
        const isInterdeminate = selectedCount > 0 && !isMarked;

        return (
            <div key={module.name + '-' + index}>
                <ListItem className={classes.listItem} button onClick={() => handleToggleModule(module.name)}>
                    <ListItemIcon>
                        <Icon color="primary">{isExpand ? 'remove_circle' : 'add_circle'}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={module.description} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            color="secondary"
                            onChange={(event) => handleModuleCheck(event, module)}
                            checked={isMarked}
                            indeterminate={isInterdeminate}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={isExpand} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {module.routes.map((route) => renderDefaultRoute(module, route))}
                    </List>
                </Collapse>
                <Divider />
            </div>
        );
    };

    return (
        <>
            <AlertDialog onClose={() => setError('')} show={error.length > 0} title="Error" message={error} />
            <LoadingDialog show={loading} />
            <Container component="main" maxWidth="lg">
                <Paper className={classes.paper} elevation={6}>
                    <Avatar className={classes.avatar}>
                        <Icon>code</Icon>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Api Permission
                    </Typography>
                    <Grid alignItems="center" alignContent="space-between" spacing={2} container direction="row">
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <ObjectInput
                                id="role"
                                label="Role"
                                required={true}
                                fields={ROLE_TABLE_FIELDS}
                                onLoadData={handleRoleData}
                                onLoadItem={(item) => item.name}
                                onChange={handleRoleChange}
                                disableRemove={true}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <Button type="button" className={classes.submit} fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                                <Icon>save</Icon> Save
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container>
                        <List className={classes.expansionPanel} component="nav" aria-labelledby="open-api-list">
                            {openApi.map(renderDefaultModule)}
                        </List>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default withRouter(ApiPermission);
