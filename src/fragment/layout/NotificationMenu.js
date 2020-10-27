import React, { useState } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import {
    Typography,
    makeStyles,
    withStyles,
    IconButton,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Icon,
    ListItemText,
    Tooltip,
} from '@material-ui/core';
import FileApi from '../../api/FileApi';
import FormatManager from '../../util/FormatManager';
import { useHistory } from 'react-router-dom';

type NotificationMenuProps = {
    name: string,
    icon: string,
    anchorVertical: 'top' | 'bottom',
    anchorHorizontal: 'left' | 'right',
};

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: theme.palette.error.main,
        padding: '0 4px',
        border: '1px solid ' + theme.palette.error.dark,
    },
}))(Badge);

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
        paddingRight: theme.spacing(1),
    },
    menuText: {
        color: theme.palette.text.primary,
    },
    menuDetail: {
        maxWidth: 300,
        wordWrap: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

const NotificationMenu = (props: NotificationMenuProps) => {
    const classes = styles();
    const history = useHistory();
    const { name, icon, anchorVertical, anchorHorizontal } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    let anchorOrigin = {
        vertical: anchorVertical || 'top',
        horizontal: anchorHorizontal || 'right',
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item) => {};

    const createSkeleton = (count) => {
        var result = [];
        for (let i = 0; i < count; i++) {
            result.push(
                <MenuItem key={'skeleton-01'}>
                    <ListItemIcon className={classes.menuIcon}>
                        <Skeleton variant="circle" width={32} height={32} />
                    </ListItemIcon>
                    <ListItemText>
                        <Skeleton />
                        <Skeleton height="10px" width="60%" />
                    </ListItemText>
                </MenuItem>,
            );
        }
        return result;
    };

    const notiItems = [
        {
            id: 1,
            icon: 'face',
            title: 'Order-1',
            date: new Date().getTime(),
            detail1: 'What is Lorem Ipsum?',
            detail2:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        },
        {
            id: 2,
            icon: 'face',
            title: 'Order-2',
            date: new Date().getTime(),
            detail1: 'Why do we use it?',
            detail2:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
        },
    ];

    return (
        <>
            <Tooltip title={name} aria-label={name}>
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <StyledBadge anchorOrigin={anchorOrigin} badgeContent={4} color="secondary">
                        <Icon>{icon || 'notifications'}</Icon>
                    </StyledBadge>
                </IconButton>
            </Tooltip>
            <Menu
                id="simple-menu"
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
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notiItems.map((item, index) => {
                    let imageUrl = FileApi.downloadLink(item.image);
                    return (
                        <MenuItem key={(item ? item.id : 'id') + '-' + index} onClick={() => handleClick(item)}>
                            <ListItemIcon className={classes.menuIcon}>
                                {imageUrl ? (
                                    <Avatar className={classes.avatar} alt={item.title} src={imageUrl} />
                                ) : (
                                    <Avatar className={classes.avatar}>{item.title[0]}</Avatar>
                                )}
                            </ListItemIcon>
                            <ListItemText className={classes.menuText}>
                                <Typography variant="subtitle2" gutterBottom>
                                    {`${FormatManager.formatDate(item.date, 'YYYY-MM-DD')} : ${item.detail1}`}
                                </Typography>
                                <Typography className={classes.menuDetail} variant="caption" display="block" gutterBottom>
                                    {item.detail2}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    );
                })}

                {createSkeleton(5)}
            </Menu>
        </>
    );
};

NotificationMenu.defaultProps = {
    name: 'Notification',
    icon: 'notifications',
};

export default NotificationMenu;
