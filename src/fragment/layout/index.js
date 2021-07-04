import React, { useReducer, useEffect, useRef } from 'react';
import { Route, useHistory, Redirect } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import { IconButton, Icon, Tooltip, makeStyles, AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, Divider, useTheme } from '@material-ui/core';
import { PrivateRoute } from '../../config/Route';
import clsx from 'clsx';
import Scrollbar from '../control/ScrollBar';
import { SESSION_TIMEOUT, STORAGE_KEYS, APP_NAME, APP_VERSION, DEFAULT_SIDE_MENU, USER_PROFILE_MENU } from '../../config/Constant';
import { Copyright } from '../control';
import SideMenu from './SideMenu';
import NotificationMenu from './NotificationMenu';
import DrawerHeader from './DrawerHeader';
import Reducer, { ACTIONS } from './Reducer';
import FileApi from '../../api/FileApi';
import UserMenu from './UserMenu';
import MenuApi from '../../api/MenuApi';
import NotFound from '../../page/NotFound';

const DRAWER_FULL_SIZE: number = window.innerWidth > 1400 ? 300 : 260;
const DRAWER_SMALL_SIZE: number = 64;

const MIN_WIDTH_TO_HIDE = 1060;

const useStyles = makeStyles((theme) => ({
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
        // border: '1px solid ' + theme.palette.common.gray,
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.primary.contrastText,
        padding: 2,
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        width: DRAWER_FULL_SIZE,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: DRAWER_FULL_SIZE,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: DRAWER_SMALL_SIZE,
        [theme.breakpoints.up('sm')]: {
            width: DRAWER_SMALL_SIZE,
        },
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

export type LayoutProps = {
    onToggleMode: () => void,
    mode: 'LIGHT' | 'DARK',
};

const Layout = (props: LayoutProps) => {
    const { onToggleMode, mode } = props;

    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const currentUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '';
    const user = currentUser.length ? JSON.parse(currentUser) : {};
    const granted = currentUser.length && user && user.currentToken && user.currentToken.length > 0;
    const userProfileImage = FileApi.downloadLink(user.profileImage, 'small') || './images/logo.png';
    const idleTimer = useRef(null);

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
        if (!granted) return;

        const menus = await MenuApi.getCurrentUserMenu();
        if (menus && menus.data.length > 0) {
            const uniqueMenus = menus.data.reduce((unique, o) => {
                if (!unique.some((obj) => obj.id === o.id)) {
                    unique.push(o);
                }
                return unique;
            }, []);

            let mainMenu = uniqueMenus.filter((m) => !m.parentId);

            //Recurrsively sort menus
            const sortMenu = (items) =>
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

    if (!granted) {
        return <Redirect to="/login" />;
    }

    return (
        <div className={classes.root}>
            <IdleTimer ref={idleTimer} element={document} onIdle={handleLogout} debounce={1000} timeout={SESSION_TIMEOUT} />
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <img src={`/${'images/logo.png'}`} height={theme.spacing(5)} alt="SUNDEW MYANMAR" className={classes.logo} />
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {APP_NAME} ({APP_VERSION})
                    </Typography>
                    <div />
                    <div>
                        <NotificationMenu name="Notifications" />

                        <Tooltip title={mode === 'DARK' ? 'Toggle Light Mode' : 'Toggle Dark Mode'}>
                            <IconButton
                                aria-label="delete"
                                onClick={() => {
                                    if (onToggleMode) {
                                        onToggleMode(mode === 'DARK' ? 'LIGHT' : 'DARK');
                                    }
                                }}
                            >
                                <Icon>{mode === 'DARK' ? 'brightness_7' : 'brightness_4'}</Icon>
                            </IconButton>
                        </Tooltip>
                        <UserMenu
                            image={user.profileImage}
                            name={user.displayName || user.email}
                            role={
                                user.roles &&
                                user.roles
                                    .map(function (elem) {
                                        return elem.name;
                                    })
                                    .join(', ')
                            }
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: !state.hideMenu,
                    [classes.drawerClose]: state.hideMenu,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: !state.hideMenu,
                        [classes.drawerClose]: state.hideMenu,
                    }),
                }}
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
                <Scrollbar>
                    <div className={classes.appBarSpacer} />
                    <div className={classes.container}>
                        {PrivateRoute.map((route, index) => {
                            return <Route exact key={index} path={route.path} render={(props) => <route.page {...props} />} />;
                        })}
                    </div>
                    <Box pt={4} className={classes.copyRight}>
                        <Copyright />
                    </Box>
                </Scrollbar>
            </main>
        </div>
    );
};

export default Layout;
