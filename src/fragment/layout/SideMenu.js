import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, Icon, ListItemText, Divider, Collapse, makeStyles, Popover, PopoverProps, Tooltip } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

import SearchInput from '../control/SearchInput';
import { ACTIONS } from './Reducer';

export type MenuProps = {
    id: String | Number,
    label: String,
    icon: String,
    onClick: ?Function,
    path?: String,
    items?: Array<MenuProps>,
    divider?: Boolean,
};

type SideMenuProps = {
    menus: Array<MenuProps>,
    state?: Object,
    dispatch?: Function,
};

type MenuItemProps = {
    ...SideMenuProps,
    hideMenu: Boolean,
    parentCount?: Number,
    onMenuItemClick(menu: MenuProps): ?Function,
};

type ChildMenuGroupProps = {
    ...MenuItemProps,
    open: Boolean,
};

const PopupMenu = (props: { ...ChildMenuGroupProps, ...PopoverProps }) => {
    const { onMenuItemClick, dispatch, state, parentCount, divider, parentId, createdAt, modifiedAt, items, ...popover } = props;

    return (
        <>
            <Divider />
            <Popover
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={props.open}
                {...popover}
            >
                {items.map((menu, index) => (
                    <DefaultMenuItem
                        onMenuItemClick={() => onMenuItemClick(menu)}
                        key={menu.id + '-' + index}
                        parentCount={parentCount}
                        dispatch={dispatch}
                        state={state}
                        {...menu}
                    />
                ))}
            </Popover>
        </>
    );
};

const FolderMenu = (props: ChildMenuGroupProps) => {
    const parent = props.parentCount || 0;
    return (
        <>
            <Collapse in={props.open} timeout="auto" unmountOnExit>
                {props.items.map((menu, index) => (
                    <DefaultMenuItem
                        parentCount={parent + 1}
                        onMenuItemClick={() => props.onMenuItemClick(menu)}
                        key={menu.id + '-' + index}
                        dispatch={props.dispatch}
                        state={props.state}
                        {...menu}
                    />
                ))}
            </Collapse>
            <Divider />
        </>
    );
};

const ItemStyles = makeStyles(theme => ({
    root: props => ({
        paddingLeft: props.hideMenu ? 15 : theme.spacing(2 * (props.parentCount + 1)),
        borderRight: !props.hideMenu && props.selected ? '4px solid ' + theme.palette.secondary.main : null,
    }),
    menuIcon: props => ({
        color: props.selected ? theme.palette.primary.contrastText : theme.palette.primary.dark,
        display: 'inline-flex',
        flexShrink: 0,
        minWidth: theme.spacing(4),
    }),
    menuText: props => ({
        color: props.selected ? theme.palette.primary.contrastText : theme.palette.primary.dark,
    }),
}));

const DefaultMenuItem = (props: MenuItemProps) => {
    const history = useHistory();
    const location = useLocation();
    const {
        state,
        dispatch,
        parentCount,
        onMenuItemClick,
        id,
        label,
        icon,
        onClick,
        path,
        items,
        divider,
        parentId,
        createdAt,
        modifiedAt,
        ...rest
    } = props;

    const isFolder = items && items.length > 0;
    const open = state.openIds.findIndex(x => x === props.id) >= 0;
    const isSelect = location.pathname === path;

    const [anchorEl, setAnchorEl] = useState(null);
    const classes = ItemStyles({ parentCount: props.parentCount, selected: isSelect, hideMenu: state.hideMenu });

    const handleClick = event => {
        if (isFolder) {
            dispatch({
                type: ACTIONS.MODIFIED_OPEN_IDS,
                id: id,
            });
            if (state.hideMenu) {
                setAnchorEl(event.currentTarget);
            }
        } else if (path) {
            history.push(path);
        }

        if (onClick) {
            onClick();
        }
    };

    const renderChildGroup = () => {
        if (!isFolder) {
            return null;
        }

        if (state.hideMenu) {
            return <PopupMenu {...props} id={'popup-menu-' + id} open={open} anchorEl={anchorEl} onClose={handlePopoverClose} disableRestoreFocus />;
        }

        return <FolderMenu {...props} open={open} />;
    };

    const handlePopoverClose = () => {
        dispatch({
            type: ACTIONS.MODIFIED_OPEN_IDS,
            id: id,
        });
        setAnchorEl(null);
    };

    return (
        <>
            <ListItem
                {...rest}
                button
                className={classes.root}
                onClick={handleClick}
                selected={isSelect}
                divider={!isFolder && divider}
                aria-owns={'popup-menu-' + id}
                aria-haspopup="true"
            >
                <Tooltip title={label} aria-label={label}>
                    <ListItemIcon className={classes.menuIcon}>
                        <Icon fontSize={state.hideMenu ? 'large' : 'default'}>{icon}</Icon>
                    </ListItemIcon>
                </Tooltip>
                {state.hideMenu ? null : <ListItemText inset={false} primary={label} className={classes.menuText} />}
                {!state.hideMenu && isFolder ? <Icon fontSize="small">{open ? 'expand_less' : 'chevron_right'}</Icon> : null}
            </ListItem>
            {renderChildGroup()}
        </>
    );
};

const styles = makeStyles(theme => ({
    root: {
        overflowY: 'auto',
        overflowX: 'auto',
    },
    searchBox: {
        padding: theme.spacing(1),
    },
    listMenu: {
        padding: 0,
    },
}));

const SideMenu = (props: SideMenuProps) => {
    const classes = styles();
    const { hideMenu, menus } = props.state;
    const [search, setSearch] = useState('');

    const handleClick = menu => {
        if (props.onItemClick) {
            props.onItemClick(menu);
        }
    };

    let filterMenus = menus;

    const searchMenu = list => {
        list.forEach(item => {
            if (item.label.startsWith(search)) {
                filterMenus = [...filterMenus, item];
            } else if (item.items && item.items.length > 0) {
                searchMenu(item.items);
            }
        });
    };

    if (search.length > 0) {
        filterMenus = [];
        searchMenu(menus);
    }

    return (
        <div className={classes.root}>
            {hideMenu ? null : (
                <>
                    <div className={classes.searchBox}>
                        <SearchInput onSearch={value => setSearch(value)} />
                    </div>
                    <Divider />
                </>
            )}
            <List component="nav" className={classes.listMenu}>
                {filterMenus.map((menu, index) => (
                    <DefaultMenuItem
                        dispatch={props.dispatch}
                        state={props.state}
                        onMenuItemClick={handleClick}
                        key={menu.id + '-' + index}
                        {...menu}
                    />
                ))}
            </List>
        </div>
    );
};

export default SideMenu;
