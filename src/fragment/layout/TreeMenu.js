import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    Divider,
    Menu,
    MenuItem,
    Collapse,
    useTheme,
    makeStyles,
    Typography,
    fade,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MenuProps } from './SideMenu';

type TreeMenuProps = {
    menus: Array<MenuProps>,
    openIds: Array<String>,
};

const useTreeItemStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.secondary,
        '&:focus > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.primary.light})`,
            color: `var(--tree-view-color, ${theme.palette.primary.contrastText})`,
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 12,
        paddingLeft: 12,
        borderLeft: `1px solid ${fade(theme.palette.text.primary, 0.4)}`,
    },
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

export const DefaultTreeItem = props => {
    const classes = useTreeItemStyles();

    const { label, icon, onClick, state, items, ...other } = props;
    const history = useHistory();
    const isCollapseable = items && items.length > 0;

    const handleClick = () => {
        if (state && state.length) {
            history.push(state);
        } else if (onClick) {
            onClick(props);
        }
    };

    return (
        <TreeItem
            onClick={handleClick}
            label={
                <div className={classes.labelRoot}>
                    <Icon className={classes.labelIcon} fontSize="small">
                        {icon}
                    </Icon>
                    <Typography variant="body2" className={classes.labelText}>
                        {label}
                    </Typography>
                </div>
            }
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        >
            {isCollapseable
                ? items.map((menu, index) => {
                      return <DefaultTreeItem nodeId={menu.id + '-' + index} key={menu.id + '-' + index} {...menu} />;
                  })
                : null}
        </TreeItem>
    );
};

const styles = makeStyles(theme => ({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
}));

const TreeMenu = (props: TreeMenuProps) => {
    const classes = styles();
    const [expanded, setExpanded] = React.useState(props.openIds);
    const handleChange = (event, nodes) => {
        setExpanded(nodes);
    };

    return (
        <TreeView
            expanded={expanded}
            onNodeToggle={handleChange}
            className={classes.root}
            defaultCollapseIcon={<Icon>arrow_drop_down</Icon>}
            defaultExpandIcon={<Icon>arrow_right</Icon>}
        >
            {props.menus.map((menu, index) => {
                return <DefaultTreeItem nodeId={menu.id + '-' + index} key={menu.id + '-' + index} {...menu} />;
            })}
        </TreeView>
    );
};

export default TreeMenu;
