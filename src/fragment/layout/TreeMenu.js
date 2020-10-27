import React from 'react';
import { Icon, makeStyles, Typography, fade } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MenuProps } from './SideMenu';

export const TreeCollapseIcon = (expand, onClick) => {
    return (
        <Icon onClick={onClick} fontSize="small">
            {expand ? 'arrow_right' : 'arrow_drop_down'}
        </Icon>
    );
};

const useTreeItemStyles = makeStyles(theme => ({
    root: {
        '&:focus > $content $label, &$selected > $content $label': {
            color: theme.palette.primary.contrastText,
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$selected > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    selected: {},
    group: {
        marginLeft: 7,
        paddingLeft: 7,
        borderLeft: `1px dotted ${fade(theme.palette.text.primary, 0.4)}`,
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
        color: theme.palette.text.primary,
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        color: theme.palette.text.primary,
    },
}));

export const DefaultTreeItem = props => {
    const classes = useTreeItemStyles();
    //Unused property need to add for remove in DOM.
    const { nodeId, label, icon, onClick, onCollapseClick, items, divider, parentId, createdBy, modifiedBy, createdAt, modifiedAt, ...other } = props;
    const isCollapseable = items && items.length > 0;

    const handleClick = () => {
        if (onClick) {
            onClick(props);
        }
    };

    return (
        <TreeItem
            nodeId={nodeId}
            expandIcon={TreeCollapseIcon(true, () => onCollapseClick(nodeId))}
            collapseIcon={TreeCollapseIcon(false, () => onCollapseClick(nodeId))}
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
                selected: classes.selected,
                expanded: classes.expanded,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        >
            {isCollapseable
                ? items.map((menu, index) => {
                      return (
                          <DefaultTreeItem
                              onCollapseClick={onCollapseClick}
                              onClick={onClick}
                              nodeId={menu.id + '-' + index}
                              key={menu.id + '-' + index}
                              {...menu}
                          />
                      );
                  })
                : null}
        </TreeItem>
    );
};

type TreeMenuProps = {
    menus: Array<MenuProps>,
    onClickItem?: (item: Object) => void,
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
    const { onClickItem, menus } = props;
    const [expandedNodes, setExpandedNodes] = React.useState([]);

    React.useEffect(() => {
        const expNodes = menus.map((menu, index) => menu.id + '-' + index);
        setExpandedNodes(expNodes);
    }, [menus]);

    const handleCollapseItemClick = nodeId => {
        const existIdx = expandedNodes.findIndex(x => x === nodeId);
        const updateNodes = existIdx < 0 ? [...expandedNodes, nodeId] : expandedNodes.filter(x => x !== nodeId);

        setExpandedNodes(updateNodes);
    };

    return (
        <TreeView
            expanded={expandedNodes}
            className={classes.root}
            defaultCollapseIcon={<Icon>arrow_drop_down</Icon>}
            defaultExpandIcon={<Icon>arrow_right</Icon>}
        >
            {menus.map((menu, index) => {
                return (
                    <DefaultTreeItem
                        onCollapseClick={handleCollapseItemClick}
                        onClick={onClickItem}
                        nodeId={menu.id + '-' + index}
                        key={menu.id + '-' + index}
                        {...menu}
                    />
                );
            })}
        </TreeView>
    );
};

TreeMenu.defaultProps = {
    onClickItem: item => console.warn('Undefined onClickItem => ', item),
};

export default TreeMenu;
