import React, { useReducer, useEffect, useRef, useState } from 'react';
import { Route, useHistory, Redirect } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import { IconButton, Icon, Tooltip, makeStyles, AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, Divider, useTheme } from '@material-ui/core';
import { PrivateRoute } from '../../config/Route';
import clsx from 'clsx';
import ScrollBar from '../control/ScrollBar';
import {
    SESSION_TIMEOUT,
    STORAGE_KEYS,
    APP_NAME,
    APP_VERSION,
    DEFAULT_SIDE_MENU,
    USER_PROFILE_MENU,
    FCM_CONFIG,
    VAPID_KEY,
    ADMIN_MENU,
} from '../../config/Constant';
import { Copyright } from '../control';
import SideMenu from './SideMenu';
import NotificationMenu from './NotificationMenu';
import DrawerHeader from './DrawerHeader';
import Reducer, { ACTIONS } from './Reducer';
import FileApi from '../../api/FileApi';
import UserMenu from './UserMenu';
import MenuApi from '../../api/MenuApi';
import { isSafari } from 'react-device-detect';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import ProfileApi from '../../api/ProfileApi';
import NotificationApi from '../../api/NotificationApi';
import { useDispatch, useSelector } from 'react-redux';
import { USER_REDUX_ACTIONS } from '../../util/UserManager';
import type { HTMLProps } from 'react';

let FIREBASE_MESSAGING = null;

if (!isSafari && FCM_CONFIG) {
    const app = initializeApp(FCM_CONFIG);
    FIREBASE_MESSAGING = getMessaging();
}

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
    appBarShift: {
        marginLeft: DRAWER_FULL_SIZE,
        width: `calc(100% - ${DRAWER_FULL_SIZE}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: DRAWER_FULL_SIZE,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    logo: {
        borderRadius: 3,
        // border: '1px solid ' + theme.palette.common.gray,
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.primary.contrastText,
        padding: 2,
    },
    copyRight: {
        marginBottom: theme.spacing(3),
    },
}));

export interface LayoutProps extends HTMLProps {
    onToggleMode: () => void;
    mode: 'LIGHT' | 'DARK';
}

const Layout = (props: LayoutProps) => {
    const { onToggleMode, mode } = props;

    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const granted = user && user.currentToken && user.currentToken.length > 0;
    const userProfileImage = FileApi.downloadLink(user.profileImage, 'small') || './images/logo.png';
    const idleTimer = useRef(null);

    const [badge, setBadge] = useState(0);

    const handleLogout = () => {
        dispatch({
            type: USER_REDUX_ACTIONS.LOGOUT,
        });
        sessionStorage.clear();
        localStorage.clear();
        history.push('/login');
    };

    const logoutMenu = {
        id: 'sys-logout',
        label: 'Logout',
        icon: 'lock',
        divider: true,
        onClick: handleLogout,
    };

    const [state, setState] = useReducer(Reducer, {
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

            setState({
                type: ACTIONS.LOAD,
                payload: {
                    ...state,
                    menus: [...mainMenu, ADMIN_MENU, USER_PROFILE_MENU, logoutMenu],
                },
            });
        }
    };

    const onItemClick = async (item) => {
        console.log('item click', item);
        //Need to Control
    };

    const readAllNotification = () => {
        NotificationApi.readAllMyNotifications();
    };

    const loadMoreNotification = async (paging) => {
        const result = await NotificationApi.getMyNotifications(paging.currentPage + 1, paging.pageSize);
        if (result.data) {
            for (let i = 0; i < result.data.length; i++) {
                result.data[i] = {
                    id: result.data[i].id,
                    image: result.data[i].imageUrl,
                    date: result.data[i].sentAt,
                    title: result.data[i].title,
                    description: result.data[i].description,
                    referenceId: result.data[i].data ? result.data[i].data.referenceId : null,
                    isRead: result.data[i].readAt,
                    ...result.data[i],
                };
            }

            return result;
        }
        return {};
    };

    useEffect(() => {
        loadMenu();
        if (FIREBASE_MESSAGING && !isSafari) {
            if (!localStorage.getItem(STORAGE_KEYS.FCM_TOKEN)) {
                FIREBASE_MESSAGING.getToken({ vapidKey: VAPID_KEY }).then((payload) => {
                    localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, payload);
                    let tkResponse = ProfileApi.refreshToken(payload);
                });
            }

            FIREBASE_MESSAGING.onMessage((payload) => {
                if (payload.notification && payload.notification.badge) {
                    setBadge(payload.notification.badge);
                }
                // ...
            });
        }

        // eslint-disable-next-line
    }, []);

    if (!granted) {
        return <Redirect to="/login" />;
    }

    return (
        <div className={classes.root}>
            <IdleTimer ref={idleTimer} element={document} onIdle={handleLogout} debounce={1000} timeout={SESSION_TIMEOUT} />
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, !state.hideMenu && classes.appBarShift)} elevation={3}>
                <Toolbar className={classes.toolbar}>
                    <img src={`/${'images/logo.png'}`} height={theme.spacing(5)} alt="SUNDEW MYANMAR" className={classes.logo} />
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {APP_NAME} ({APP_VERSION})
                    </Typography>
                    <div />
                    <div>
                        <NotificationMenu
                            name="Notifications"
                            badge={badge}
                            onLoadMore={loadMoreNotification}
                            onItemClick={onItemClick}
                            onReadAll={readAllNotification}
                        />
                        <Tooltip title={mode === 'DARK' ? 'Toggle Light Mode' : 'Toggle Dark Mode'}>
                            <IconButton
                                aria-label="Dark Mode"
                                onClick={() => {
                                    if (onToggleMode) {
                                        onToggleMode(mode === 'DARK' ? 'LIGHT' : 'DARK');
                                    }
                                }}
                            >
                                <Icon color="action">{mode === 'DARK' ? 'brightness_7' : 'brightness_4'}</Icon>
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
                classes={{
                    paper: clsx(classes.drawerPaper, state.hideMenu && classes.drawerPaperClose),
                }}
                open={!state.hideMenu}
            >
                {state.hideMenu ? <div className={classes.appBarSpacer} /> : null}
                <DrawerHeader
                    hideMenu={state.hideMenu}
                    image={userProfileImage}
                    name={user.displayName}
                    onMenuClick={() => setState({ type: ACTIONS.SIZE_CHNGE })}
                />
                <Divider className={classes.divider} />
                <SideMenu state={state} dispatch={setState} />
            </Drawer>
            <main className={classes.content}>
                <ScrollBar>
                    <div className={classes.appBarSpacer} />
                    <div className={classes.container}>
                        {PrivateRoute.map((route, index) => {
                            return (
                                <Route
                                    exact
                                    key={index}
                                    path={route.path}
                                    render={(props) => (granted ? <route.page {...props} /> : <Redirect to="/login" />)}
                                />
                            );
                        })}
                    </div>
                    <Box pt={4} className={classes.copyRight}>
                        <Copyright />
                    </Box>
                </ScrollBar>
            </main>
        </div>
    );
};

export default Layout;
