import React, { useState } from 'react';
import {
    makeStyles,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Icon,
    ListItemText,
    Tooltip,
    Divider,
    useTheme,
    Grid,
    Typography,
} from '@material-ui/core';
import FileApi from '../../api/FileApi';
import { USER_PROFILE_MENU } from '../../config/Constant';
import { useHistory } from 'react-router-dom';

type UserMenuProps = {
    name: string,
    image?: string | Object,
};

const styles = makeStyles((theme) => ({
    avatar: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    menuIcon: {
        color: theme.palette.text.primary,
        display: 'inline-flex',
        flexShrink: 0,
        minWidth: theme.spacing(4),
    },
    menuText: {
        color: theme.palette.text.primary,
    },
    headerGrid: {
        padding: theme.spacing(1),
    },
}));

const UserMenu = (props: UserMenuProps) => {
    const classes = styles();
    const history = useHistory();
    const theme = useTheme();
    const { name, role, image } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const imageUrl = FileApi.downloadLink(image, 'thumb');

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item) => {
        if (item.id === 'sys-logout') {
            sessionStorage.clear();
        }
        setAnchorEl(null);
        history.push(item.path);
    };

    const menuItems = [
        ...USER_PROFILE_MENU.items,
        {
            id: 'sys-logout',
            label: 'Logout',
            icon: 'lock',
            path: '/login',
        },
    ];

    return (
        <>
            <Tooltip title={name} aria-label={name}>
                <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
                    {imageUrl ? (
                        <Avatar className={classes.avatar} alt={name} src={imageUrl} />
                    ) : (
                        <Avatar className={classes.avatar}>{name[0]}</Avatar>
                    )}
                </IconButton>
            </Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                elevation={0}
                getContentAnchorEl={null}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Grid className={classes.headerGrid} container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        {imageUrl ? (
                            <Avatar className={classes.avatar} alt={name} src={imageUrl} />
                        ) : (
                            <Avatar className={classes.avatar}>{name[0]}</Avatar>
                        )}
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">{name}</Typography>
                    </Grid>
                    <Grid item style={{ display: !role ? 'none' : 'block' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            {role}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider />
                {menuItems.map((item, index) => {
                    return (
                        <MenuItem key={(item ? item.id : 'id') + '-' + index} onClick={() => handleClick(item)}>
                            <ListItemIcon className={classes.menuIcon}>
                                <Icon>{item ? item.icon : ''}</Icon>
                            </ListItemIcon>
                            <ListItemText inset={false} primary={item ? item.label : ''} className={classes.menuText} />
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

UserMenu.defaultProps = {
    name: 'User',
};

export default UserMenu;
