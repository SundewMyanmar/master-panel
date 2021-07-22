import React, { useState, useEffect, useRef } from 'react';
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
import FormatManager from '../../util/FormatManager';
import InfiniteLoading from 'react-simple-infinite-loading';
import ScrollBar from '../../fragment/control/ScrollBar';

type NotificationMenuProps = {
    name: string,
    icon: string,
    anchorVertical: 'top' | 'bottom',
    anchorHorizontal: 'left' | 'right',
    badge: Integer,
    onLoadMore: object,
    onItemClick: Object,
};

/**
 * DATA FIELDS
 * ==========
 * id,image,date,title,description,isRead
 */

const StyledBadge = withStyles(theme => ({
    badge: {
        backgroundColor: theme.palette.error.main,
        padding: '0 4px',
        border: '1px solid ' + theme.palette.error.dark,
    },
}))(Badge);

const styles = makeStyles(theme => ({
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
    menuItem: props => ({
        borderBottom: '1px solid ' + theme.palette.divider,
        backgroundColor: !props.isRead ? theme.palette.primary.highlight : theme.palette.background.paper,
    }),
}));

const NotificationMenuItem = props => {
    const { item, onClick, index } = props;
    const classes = styles({ isRead: item.isRead });

    let imageUrl = item.image;
    let style = {
        style: {},
    };

    return (
        <MenuItem className={classes.menuItem} key={(item ? item.id : 'id') + '-' + index} onClick={() => onClick(item)}>
            <ListItemIcon className={classes.menuIcon}>
                {imageUrl ? (
                    <Avatar className={classes.avatar} alt={item.title} src={imageUrl} />
                ) : (
                    <Avatar className={classes.avatar}>{item.title[0]}</Avatar>
                )}
            </ListItemIcon>
            <ListItemText
                className={classes.menuText}
                primary={<Typography variant="subtitle2" gutterBottom>{`${item.title}`}</Typography>}
                secondary={
                    <Typography variant="caption" display="block" gutterBottom>
                        {`(${FormatManager.formatDate(item.date, 'YYYY-MM-DD hh:mm A')}) : ` + item.description}
                    </Typography>
                }
            ></ListItemText>
        </MenuItem>
    );
};

const NotificationMenu = (props: NotificationMenuProps) => {
    const classes = styles();

    const { name, icon, anchorVertical, anchorHorizontal, badge, onLoadMore, onReadAll, onItemClick } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [paging, setPaging] = useState({
        total: 0,
        currentPage: -1,
        pageSize: 20,
        data: [],
    });

    const resetNotification = useRef(false);
    const [notiBadge, setNotiBadge] = useState('');
    const [showSkeleton, setShowSkeleton] = useState(false);

    const setPagingData = result => {
        if (result.data) {
            console.log('paging data', paging.data);
            setPaging({
                ...result,
                data: [...paging.data, ...result.data],
            });
        }
    };

    useEffect(() => {
        loadMoreNotification(paging);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (resetNotification.current) {
            resetNotification.current = false;

            loadMoreNotification(paging);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paging]);

    useEffect(() => {
        setNotiBadge(badge);

        resetNotification.current = true;
        let initPaging = {
            total: 0,
            currentPage: -1,
            pageSize: 20,
            data: [],
        };
        setPaging(initPaging);
    }, [badge]);

    const loadMoreNotification = async newPaging => {
        if (onLoadMore) {
            setShowSkeleton(true);
            var result = await onLoadMore({
                ...newPaging,
            });

            setPagingData(result);
            setShowSkeleton(false);
        }
    };

    let anchorOrigin = {
        vertical: anchorVertical || 'top',
        horizontal: anchorHorizontal || 'right',
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = item => {
        if (onItemClick) onItemClick(item);
        handleClose();
    };

    const createSkeleton = count => {
        var result = [];
        for (let i = 0; i < count; i++) {
            result.push(
                <MenuItem key={`skeleton-${i}`}>
                    <ListItemIcon className={classes.menuIcon}>
                        <Skeleton variant="circle" width={32} height={32} />
                    </ListItemIcon>
                    <ListItemText>
                        <Skeleton />
                        <Skeleton height={10} width={200} />
                    </ListItemText>
                </MenuItem>,
            );
        }
        return showSkeleton ? result : null;
    };

    let badgeContent = {};
    if (notiBadge)
        badgeContent = {
            badgeContent: notiBadge,
        };

    return (
        <>
            <Tooltip title={name} aria-label={name}>
                <IconButton
                    onClick={event => {
                        setAnchorEl(event.currentTarget);
                        if (onReadAll) onReadAll();
                        setNotiBadge('');
                    }}
                >
                    <StyledBadge anchorOrigin={anchorOrigin} {...badgeContent} color="secondary">
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
                {!paging.data ||
                    (paging.data.length <= 0 && (
                        <MenuItem key={'skeleton-01'}>
                            <ListItemText style={{ textAlign: 'center' }}>No Data.</ListItemText>
                        </MenuItem>
                    ))}
                <ScrollBar style={{ width: 500, height: 500, top: 0 }}>
                    <InfiniteLoading
                        hasMoreItems={paging.data.length < paging.total - 1}
                        itemHeight={60}
                        loadMoreItems={() => {
                            loadMoreNotification(paging);
                        }}
                    >
                        {paging.data.map((item, index) => {
                            return <NotificationMenuItem key={`noti-item-${index}`} item={item} index={index} onClick={handleClick} />;
                        })}
                        {createSkeleton(2)}
                    </InfiniteLoading>
                </ScrollBar>
            </Menu>
        </>
    );
};

NotificationMenu.defaultProps = {
    name: 'Notification',
    icon: 'notifications',
    badge: 0,
};

export default NotificationMenu;
