import React from 'react';
import { Tooltip, IconButton, Icon, Menu, MenuItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';
import type { IconButtonProps } from '@material-ui/core';

const styles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.text.primary,
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
}));

export interface ActionProps {
    id: string;
    label: object;
    icon: object;
    color: object;
    onClick: () => void;
}

export interface DataActionProps extends IconButtonProps {
    data: object;
    actions: Array<ActionProps>;
    rowIndex: Int;
    onMenuItemClick: (item: object) => void;
}

const DataAction = (props: DataActionProps) => {
    const { id, actions, data, rowIndex, onMenuItemClick, ...iconButtonProps } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = styles();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item, index) => {
        setAnchorEl(null);
        onMenuItemClick(item, data);
    };
    return (
        <>
            <Tooltip title="More Actions" placement="top">
                <IconButton
                    size="small"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    className={classes.menuButton}
                    aria-label={id}
                    {...iconButtonProps}
                >
                    <Icon>more_vert</Icon>
                </IconButton>
            </Tooltip>
            <Menu id="actions-menu" marginThreshold={50} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                {actions.map((item, index) => {
                    let colorProps = {};
                    if (item.color) {
                        let customColor = FormatManager.isFunction(item.color) ? item.color(data) : item.color;
                        colorProps = { style: { color: customColor } };
                    }
                    return (
                        <MenuItem dense key={item.id + '-' + index} onClick={() => handleClick(item, index)}>
                            <ListItemIcon className={classes.menuIcon}>
                                <Icon {...colorProps}>{FormatManager.isFunction(item.icon) ? item.icon(data) : item.icon}</Icon>
                            </ListItemIcon>
                            <ListItemText
                                inset={false}
                                primary={FormatManager.isFunction(item.label) ? item.label(data) : item.label}
                                className={classes.menuText}
                                {...colorProps}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default DataAction;
