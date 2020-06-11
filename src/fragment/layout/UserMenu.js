import React, { useState } from 'react';
import { makeStyles, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Icon, ListItemText, Tooltip } from '@material-ui/core';
import FileApi from '../../api/FileApi';
import { USER_PROFILE_MENU } from '../../config/Constant';
import { useHistory } from 'react-router-dom';

type UserMenuProps = {
    name: string,
    image?: string | Object,
};

const styles = makeStyles(theme => ({
    avatar: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    menuIcon: {
        color: theme.palette.primary.dark,
        display: 'inline-flex',
        flexShrink: 0,
        minWidth: theme.spacing(4),
    },
    menuText: {
        color: theme.palette.primary.dark,
    },
}));

const UserMenu = (props: UserMenuProps) => {
    const classes = styles();
    const history = useHistory();
    const { name, image } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const imageUrl = FileApi.downloadLink(image, 'thumb');

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = item => {
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
                <IconButton size="small" onClick={event => setAnchorEl(event.currentTarget)}>
                    {imageUrl ? (
                        <Avatar className={classes.avatar} alt={name} src={imageUrl} />
                    ) : (
                        <Avatar className={classes.avatar}>{name[0]}</Avatar>
                    )}
                </IconButton>
            </Tooltip>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
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
    name: 'Unknown',
};

export default UserMenu;
