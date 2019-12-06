import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withState from 'recompose/withState';
import toRenderProps from 'recompose/toRenderProps';
import { APP_NAME, STORAGE_KEYS, MAIN_MENU } from '../config/Constant';
import cloneDeep from 'lodash/cloneDeep';

const WithState = toRenderProps(withState('anchorEl', 'updateAnchorEl', null));
const drawerWidth = 255;

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'absolute',
        display: 'flex',
        bottom: 1,
        top: 0,
        left: 0,
        right: 0,
    },
    nestedMenu: {
        paddingLeft: theme.spacing.unit * 4,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 1,
        borderBottom: "1px groove #d4ddea",
    },
    listMenu: {
        padding: 0,
    },
    listLabel: {
        // color:theme.palette.primary.main,
        fontSize: '14px',
        padding: 0
    },
    defaultMenu: {
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 1
    },
    menuContainer: {
        borderBottom: '1px solid ' + theme.palette.background.dark,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        border: '1px solid ' + theme.palette.menu.dark
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarIcon: {
        marginRight: 8,
        // backgroundColor: '#eafffe',
        // padding: 4,
        borderRadius: 8,
        // border: '1px solid ' + theme.palette.primary.main
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        // backgroundColor:theme.palette.background.light,
        position: 'relative',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toggleMenu: {
        backgroundColor: theme.palette.background.light,
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        // backgroundImage:'url(/res/bg.png)',
        backgroundColor: theme.palette.primary.main,
        ...theme.mixins.toolbar,
    },
    scrollMenu: {
        overflowY: 'auto',
        overflowX: 'auto'
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        overflow: 'auto'
    },
    grow: {
        flexGrow: 1,
    },
    menuIcon: {
        color: theme.palette.common.white,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    welcomeImage: {
        // backgroundColor: theme.palette.primary.main,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    welcomeText: {
        color: theme.palette.common.white,
        borderLeft: '3px solid ' + theme.palette.primary.main,
        paddingLeft: theme.spacing.unit,
    },
    welcomeBackground: {
        background: 'rgba(82, 100, 87, 0.61)',
    },
    title: {
        textAlign: "center",
        padding: 12,
        color: theme.palette.primary.main
    },
    searchInput: {
        width: "100%"
    }
});

class MasterTemplate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menus: [],
            administration: [],
            user: '',
            system_menus: [{
                "id": "sys-1",
                "name": "System",
                "state": "/system",
                "icon": "settings",
                "type": "folder",
                "children": [
                    {
                        "id": "sys-2",
                        "parent_id": "sys-1",
                        "name": "Profile",
                        "state": "/profile",
                        "icon": "person",
                        "type": "link",
                    }, {
                        "id": "sys-3",
                        "parent_id": "sys-1",
                        "name": "Change Password",
                        "state": "/changePassword",
                        "icon": "security",
                        "type": "link",
                        // "divider":"true"
                    }, {
                        "id": "sys-4",
                        "parent_id": "sys-1",
                        "name": "Log out",
                        "state": "/logout",
                        "icon": "exit_to_app",
                        "type": "function",
                        "func": this.handleSignoutClick
                    }
                ]
            }]
        }
    }

    handleClick = (menu) => {
        var openObj = { active: menu.id };

        if (menu.type.toLowerCase() === 'link') {
            this.props.history.push(menu.state);
            this.setState(openObj);
            return;
        }

        openObj["open" + menu.id] = !this.state["open" + menu.id];
        this.setState(openObj);

        if (menu.type.toLowerCase() === "function" && menu.func) {
            menu.func();
        }
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
        const menus = JSON.parse(sessionStorage.getItem(MAIN_MENU.MENU));

        this.setState({ user: user, menus: menus });
    }

    handleMenuClick = (path) => {
        this.props.history.push(path);
    }

    toggleSideMenu = () => {
        this.setState({
            hideMenu: !this.state.hideMenu
        })
    }

    handleSignoutClick = () => {
        sessionStorage.clear();
        this.props.history.push('/login');
    }

    clearSearch = () => {
        this.setState({ search: "" });
    }

    handleMouseDown = event => {
        event.preventDefault();
    };

    onChangeText = (value) => {
        this.setState({ search: value });
    }

    getFilter = (stateMenus) => {
        var search = this.state.search;
        var menus = cloneDeep(stateMenus);

        if (!search) {
            return menus;
        }
        else {
            return menus.filter(function (menu) {
                const filterMenu = menu.type === 'link' || menu.type === 'function' ? menu.name.toLowerCase().search(
                    search.toLowerCase()
                ) !== -1 : menu;

                if (filterMenu.type === 'folder') {
                    filterMenu.children = filterMenu.children.filter(function (child) {
                        return child.name.toLowerCase().search(
                            search.toLowerCase()
                        ) !== -1
                    })
                }
                return filterMenu;
            });
        }
    }

    renderMenus = (menus) => {
        return menus.map(menu => {
            return (
                <WithState key={menu.id}>
                    {({ anchorEl, updateAnchorEl }) => {
                        const open = Boolean(anchorEl);
                        const handleClose = () => {
                            updateAnchorEl(null);
                        };
                        return (
                            <List component="nav" className={this.props.classes.listMenu}>
                                {menu.type === 'folder' && menu.children <= 0 ? '' :

                                    <ListItem style={this.state.active === menu.id ? {
                                        borderRight: '4px solid ' + this.props.theme.palette.primary.main,
                                        backgroundColor: this.props.theme.palette.background.light
                                    } : {}}
                                        button key={menu.id} onClick={event => {
                                            if (this.state.hideMenu && menu.type === "folder") {
                                                updateAnchorEl(event.currentTarget);
                                            }
                                            this.handleClick(menu);
                                        }
                                        } className={((menu.type.toLowerCase() === "link" || menu.type.toLowerCase() === "function") && menu.parent_id !== undefined) ? this.props.classes.nestedMenu : this.props.classes.defaultMenu}>

                                        <ListItemIcon>
                                            <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>{menu.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText style={this.state.hideMenu ? { display: "none" } : { display: "block", padding: 0 }} classes={{ primary: this.props.classes.listLabel }} inset={false} primary={menu.name} />
                                        <div style={this.state.hideMenu ? { display: "none" } : { display: "block" }}>
                                            <div style={this.state.active === menu.id ? { marginRight: 0 } : { marginRight: 4 }}>
                                                {
                                                    menu.type.toLowerCase() === "folder" ?
                                                        (this.state["open" + menu.id] ?
                                                            <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>expand_less</Icon> :
                                                            <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>expand_more</Icon>) : ""
                                                }
                                            </div>
                                        </div>
                                    </ListItem>
                                }
                                <Divider style={menu.divider ? { display: "block" } : { display: "none" }} />
                                {
                                    (menu.children && menu.children.length > 0) ?
                                        <Menu id="render-props-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                            {
                                                menu.children.map(childMenu => {
                                                    return (
                                                        <MenuItem key={childMenu.name} className={this.props.classes.defaultMenu} onClick={() => {
                                                            handleClose();
                                                            this.handleClick(childMenu);
                                                        }}>
                                                            <ListItemIcon>
                                                                <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>{childMenu.icon}</Icon>
                                                            </ListItemIcon>
                                                            <ListItemText classes={{ primary: this.props.classes.listLabel }} inset={false} primary={childMenu.name} />
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </Menu> : ""
                                }
                                <Collapse style={this.state.hideMenu ? { display: "none" } : { display: "block" }} in={this.state["open" + menu.id]} timeout="auto" unmountOnExit>
                                    {
                                        (menu.children && menu.children.length > 0) ? this.renderMenus(menu.children) : ""
                                    }
                                </Collapse>
                            </List>
                        )
                    }}
                </WithState>);
        });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="absolute"
                    className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <img src="/res/logo.png" alt="" height="32" className={classes.appBarIcon} />
                        <Typography variant="h6" component="h1" style={{ color: this.props.theme.palette.common.white }} noWrap>
                            {APP_NAME}
                        </Typography>
                        <div className={classes.grow} />
                        <WithState>
                            {({ anchorEl, updateAnchorEl }) => {
                                const open = Boolean(anchorEl);
                                const handleClose = () => {
                                    updateAnchorEl(null);
                                };
                                return (
                                    <div className={classes.sectionDesktop}>
                                        <IconButton onClick={event => {
                                            updateAnchorEl(event.currentTarget);
                                        }}>

                                            {
                                                this.state.user.profile_image && this.state.user.profile_image.public_url ?
                                                    <img src={this.state.user.profile_image.public_url} style={{ width: 30 }} /> :
                                                    <Icon className={classes.menuIcon}>account_circle</Icon>
                                            }
                                        </IconButton>
                                        <Menu id="render-props-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                                            {
                                                this.state.system_menus[0].children.map(childMenu => {
                                                    return (
                                                        <MenuItem key={childMenu.name} className={this.props.classes.defaultMenu} onClick={() => {
                                                            handleClose();
                                                            this.handleClick(childMenu);
                                                        }}>
                                                            <ListItemIcon>
                                                                <Icon style={{ color: this.props.theme.palette.primary.main, fontSize: 22 }}>{childMenu.icon}</Icon>
                                                            </ListItemIcon>
                                                            <ListItemText classes={{ primary: this.props.classes.listLabel }} inset={false} primary={childMenu.name} />
                                                        </MenuItem>
                                                    );
                                                })
                                            }
                                        </Menu>
                                    </div>
                                )
                            }}
                        </WithState>
                    </Toolbar>
                </AppBar>
                <Drawer style={this.state.hideMenu ? { width: 55 } : { width: drawerWidth }} variant="permanent" classes={{
                    paper: classes.drawerPaper,
                }}>
                    <div className={classes.toolbar} />
                    <div className={classes.welcomeImage} style={{ backgroundImage: this.state.user.profile_image && this.state.user.profile_image.public_url ? 'url("' + this.state.user.profile_image.public_url + '")' : 'url("/res/info.png")' }}>
                        <div className={classes.welcomeBackground} style={this.state.hideMenu ? { padding: theme.spacing.unit + 3 } : { padding: theme.spacing.unit * 3 }}>
                            <Grid
                                container
                                spacing={16}
                                alignItems="center"
                                direction="row"
                                justify="space-between">
                                <div style={this.state.hideMenu ? { display: "none" } : { display: "block" }}>
                                    <Typography style={{ color: this.props.theme.palette.common.white }} variant="h6" gutterBottom>
                                        Welcome!
                                    </Typography>
                                    <Typography className={classes.welcomeText} variant="subtitle1">
                                        {this.state.user.display_name}
                                    </Typography>
                                </div>
                                <IconButton onClick={() => this.toggleSideMenu()}>
                                    <Icon className={classes.menuIcon}>menu</Icon>
                                </IconButton>
                            </Grid>
                        </div>
                    </div>
                    <div className={classes.scrollMenu}>
                        <div className={classes.title} style={this.state.hideMenu ? { display: "none" } : { display: "block" }}>
                            <TextField
                                className={classes.searchInput}
                                id="input-with-icon-textfield"

                                value={this.state.search}
                                onChange={(event) => this.onChangeText(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon color="primary">search</Icon>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {
                                                this.state.search ?
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="toggle password visibility"
                                                        onClick={this.clearSearch}
                                                        onMouseDown={this.handleMouseDown}
                                                    >
                                                        <Icon color="primary">close</Icon>
                                                    </IconButton> : ""
                                            }
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        <Divider className={classes.divider} />
                        {
                            this.state.menus ? this.renderMenus(this.getFilter(this.state.menus)) : ''}
                        {
                            //Default Menus
                            this.renderMenus(this.state.system_menus)
                        }
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {this.props.children}
                </main>
            </div>
        );
    }
}

MasterTemplate.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        masterpanel: state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(MasterTemplate)));