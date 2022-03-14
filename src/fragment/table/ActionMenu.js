/* @flow */
import React from 'react';
import { Button, Icon, Menu, MenuItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { BATCH_ACTION_MENU } from '../../config/Constant';
import type { ButtonProps } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    menuIcon: {
        display: 'inline-flex',
        flexShrink: 0,
        minWidth: theme.spacing(4),
    },
}));

export interface ActionMenuProps extends ButtonProps {
    label: string;
    onMenuItemClick: (item: object) => void;
}

const ActionMenu = (props: ActionMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { label, onMenuItemClick, ...buttonProps } = props;
    const classes = styles();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item) => {
        setAnchorEl(null);
        onMenuItemClick(item);
    };

    return (
        <>
            <Button
                onClick={(event) => setAnchorEl(event.currentTarget)}
                variant="contained"
                color="secondary"
                aria-label="Batch Actions"
                {...buttonProps}
            >
                {label ? label : 'Action'}
                <Icon>arrow_drop_down</Icon>
            </Button>
            <Menu id="actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                {BATCH_ACTION_MENU.map((item, index) => {
                    return (
                        <MenuItem key={item.id + '-' + index} onClick={() => handleClick(item)}>
                            <ListItemIcon className={classes.menuIcon}>
                                <Icon style={{ color: item.color }}>{item.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText inset={false} primary={item.label} style={{ color: item.color }} />
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

ActionMenu.defaultProps = {
    onMenuItemClick: (item) => console.warn('Undefined onMenuItemClick => ', item),
};

export default ActionMenu;
