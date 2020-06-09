import React, { useReducer, useEffect } from 'react';
import { Route, useHistory, Redirect } from 'react-router-dom';
import { makeStyles, AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, Divider, useTheme } from '@material-ui/core';
import { PrivateRoute } from '../../config/Route';
import { STORAGE_KEYS, APP_NAME, APP_VERSION, DEFAULT_SIDE_MENU, USER_PROFILE_MENU } from '../../config/Constant';
import { Copyright } from '../control';
import SideMenu from './SideMenu';
import DrawerHeader from './DrawerHeader';
import Reducer, { ACTIONS } from './Reducer';
import FileApi from '../../api/FileApi';
import UserMenu from './UserMenu';
import MenuApi from '../../api/MenuApi';

const DRAWER_FULL_SIZE: number = window.innerWidth > 1400 ? 300 : 260;
const DRAWER_SMALL_SIZE: number = 64;

const MIN_WIDTH_TO_HIDE = 1060;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    logo: {
        borderRadius: 3,
        border: '1px solid white',
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
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
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        padding: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    copyRight: {
        marginBottom: theme.spacing(3),
    },
}));

const Layout = props => {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const currentUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '';
    const user = currentUser.length ? JSON.parse(currentUser) : {};
    const userProfileImage = FileApi.downloadLink(user.profileImage, 'small') || './images/logo.png';

    const handleLogout = () => {
        sessionStorage.clear();
        history.push('/login');
    };

    const logoutMenu = {
        id: 'sys-logout',
        label: 'Logout',
        icon: 'lock',
        divider: true,
        onClick: handleLogout,
    };

    const [state, dispatch] = useReducer(Reducer, {
        menus: [...DEFAULT_SIDE_MENU, logoutMenu],
        openIds: [],
        hideMenu: window.innerWidth < MIN_WIDTH_TO_HIDE,
    });

    const loadMenu = async () => {
        if (currentUser.length <= 0) return;

        const menus = await MenuApi.getCurrentUserMenu();
        if (menus && menus.data.length > 0) {
            const uniqueMenus = menus.data.reduce((unique, o) => {
                if (!unique.some(obj => obj.id === o.id)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            let mainMenu = uniqueMenus.filter(m => !m.parentId);

            //Recurrsively sort menus
            const sortMenu = items =>
                items.sort((a, b) => {
                    if (a.items && a.items.length > 0) {
                        sortMenu(a.items);
                    }
                    return a.priority - b.priority;
                });

            sortMenu(mainMenu);

            dispatch({
                type: ACTIONS.LOAD,
                payload: {
                    ...state,
                    menus: [...mainMenu, USER_PROFILE_MENU, logoutMenu],
                },
            });
        }
    };

    useEffect(() => {
        loadMenu();
        // eslint-disable-next-line
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <img src="images/logo.png" height={theme.spacing(5)} alt="SUNDEW MYANMAR" className={classes.logo} />
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {APP_NAME} ({APP_VERSION})
                    </Typography>
                    <div className={classes.grow} />
                    <UserMenu image={user.profileImage} name={user.displayName || user.email} />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{ paper: classes.drawerPaper }}
                style={state.hideMenu ? { width: DRAWER_SMALL_SIZE } : { width: DRAWER_FULL_SIZE }}
            >
                <div className={classes.appBarSpacer} />
                <DrawerHeader
                    hideMenu={state.hideMenu}
                    image={userProfileImage}
                    name={user.displayName}
                    onMenuClick={() => dispatch({ type: ACTIONS.SIZE_CHNGE })}
                />
                <Divider className={classes.divider} />
                <SideMenu state={state} dispatch={dispatch} />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <div className={classes.container}>
                    {PrivateRoute.map((route, index) => {
                        return (
                            <Route
                                exact
                                key={index}
                                path={route.path}
                                render={props => (currentUser.length > 0 ? <route.page {...props} /> : <Redirect to="/login" />)}
                            />
                        );
                    })}
                </div>
                <Box pt={4} className={classes.copyRight}>
                    <Copyright />
                </Box>
            </main>
        </div>
    );
};

export default Layout;
