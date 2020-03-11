import React from 'react';
import { Tooltip, IconButtonProps, IconButton, Icon, Menu, MenuItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';

const styles = makeStyles(theme => ({
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

export type ActionProps = {
    id: String,
    label: String,
    icon: String,
    onClick: ?Function,
};

type DataActionProps = {
    ...IconButtonProps,
    data: Object,
    actions: Array<ActionProps>,
    onMenuItemClick(item: Object): Function,
};

const DataAction = (props: DataActionProps) => {
    const { id, actions, data, onMenuItemClick, ...iconButtonProps } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = styles();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = item => {
        setAnchorEl(null);
        onMenuItemClick(item, data);
    };

    return (
        <>
            <Tooltip title="More Actions" placement="top">
                <IconButton size="small" onClick={event => setAnchorEl(event.currentTarget)} color="primary" aria-label={id} {...iconButtonProps}>
                    <Icon>more_vert</Icon>
                </IconButton>
            </Tooltip>
            <Menu id="actions-menu" marginThreshold={50} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                {actions.map((item, index) => {
                    return (
                        <MenuItem dense key={item.id + '-' + index} onClick={() => handleClick(item)}>
                            <ListItemIcon className={classes.menuIcon}>
                                <Icon>{item.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText inset={false} primary={item.label} className={classes.menuText} />
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default DataAction;
