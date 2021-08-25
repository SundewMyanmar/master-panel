import React, { useState } from 'react';
import { IconButton, Icon, makeStyles, Typography } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { MenuProps } from '../layout/SideMenu';
import { alpha } from '@material-ui/core/styles';

export const TreeCollapseIcon = (expand, onClick) => {
    return (
        <Icon onClick={onClick} fontSize="small">
            {expand ? 'arrow_right' : 'arrow_drop_down'}
        </Icon>
    );
};

const useTreeItemStyles = makeStyles((theme) => ({
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
        borderLeft: `1px dotted ${alpha(theme.palette.text.primary, 0.4)}`,
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
    deleteIcon: {
        color: theme.palette.warning.main,
    },
}));

export const DefaultTreeItem = (props) => {
    const classes = useTreeItemStyles();
    //Unused property need to add for remove in DOM.
    const {
        nodeId,
        label,
        icon,
        color,
        onClick,
        onCollapseClick,
        items,
        divider,
        parentId,
        createdBy,
        modifiedBy,
        createdAt,
        modifiedAt,
        allowCreate,
        onCreate,
        onRemove,
        data,
        ...other
    } = props;
    const isCollapseable = items && items.length > 0;
    const [isHover, setIsHover] = useState(false);
    const handleOnMouseEnter = (e) => {
        setIsHover(true);
    };
    const handleOnMouseLeave = (e) => {
        setIsHover(false);
    };

    const handleClick = () => {
        if (onClick) {
            onClick(props);
        }
    };

    let style = {};
    if (color) style = { style: { color: color } };

    return (
        <TreeItem
            nodeId={nodeId}
            expandIcon={TreeCollapseIcon(true, () => onCollapseClick(nodeId))}
            collapseIcon={TreeCollapseIcon(false, () => onCollapseClick(nodeId))}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            label={
                <div className={classes.labelRoot}>
                    <Icon onClick={handleClick} {...style} className={classes.labelIcon} fontSize="small">
                        {icon}
                    </Icon>
                    <Typography onClick={handleClick} variant="body2" className={classes.labelText}>
                        {label}
                    </Typography>
                    {allowCreate && isHover && (
                        <>
                            <Icon
                                fontSize="small"
                                onClick={() => {
                                    if (onCreate) onCreate({ parentId: data.id });
                                }}
                            >
                                add
                            </Icon>
                            <Icon
                                fontSize="small"
                                onClick={() => {
                                    if (onCreate) onCreate(data);
                                }}
                            >
                                create
                            </Icon>
                            <Icon
                                fontSize="small"
                                onClick={() => {
                                    if (onRemove) onRemove(data);
                                }}
                                className={classes.deleteIcon}
                            >
                                delete
                            </Icon>
                        </>
                    )}
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
                              data={menu}
                              {...menu}
                              allowCreate={allowCreate}
                              onCreate={onCreate}
                              onRemove={onRemove}
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
    showRoot: boolean,
    allowCreate: boolean,
    onCreate: (item) => void,
    onRemove: (item) => void,
};

const styles = makeStyles((theme) => ({
    root: {
        height: 216,
        flexGrow: 1,
        maxWidth: 400,
    },
}));

const TreeMenu = (props: TreeMenuProps) => {
    const classes = styles();
    const { onClickItem, menus, allowCreate, onCreate, onRemove, showRoot } = props;
    const [expandedNodes, setExpandedNodes] = React.useState([]);

    React.useEffect(() => {
        const expNodes = menus.map((menu, index) => menu.id + '-' + index);
        setExpandedNodes(expNodes);
    }, [menus]);

    const handleCollapseItemClick = (nodeId) => {
        const existIdx = expandedNodes.findIndex((x) => x === nodeId);
        const updateNodes = existIdx < 0 ? [...expandedNodes, nodeId] : expandedNodes.filter((x) => x !== nodeId);

        setExpandedNodes(updateNodes);
    };

    return (
        <TreeView
            expanded={expandedNodes}
            className={classes.root}
            defaultCollapseIcon={<Icon>arrow_drop_down</Icon>}
            defaultExpandIcon={<Icon>arrow_right</Icon>}
        >
            {showRoot && (
                <DefaultTreeItem
                    label="... Back"
                    icon="reply"
                    onClick={() => {
                        if (onClickItem) onClickItem({});
                    }}
                    nodeId={'home-tree'}
                    key={'home-tree-0'}
                />
            )}
            {menus.map((menu, index) => {
                return (
                    <DefaultTreeItem
                        onCollapseClick={handleCollapseItemClick}
                        onClick={onClickItem}
                        nodeId={menu.id + '-' + index}
                        key={menu.id + '-' + index}
                        {...menu}
                        data={menu}
                        allowCreate={allowCreate}
                        onCreate={onCreate}
                        onRemove={onRemove}
                    />
                );
            })}
            {allowCreate && (
                <DefaultTreeItem
                    label="Add New"
                    icon="add"
                    onClick={() => {
                        if (onCreate) onCreate({});
                    }}
                    nodeId={'init-tree'}
                    key={'init-tree-0'}
                />
            )}
        </TreeView>
    );
};

TreeMenu.defaultProps = {
    onClickItem: (item) => console.warn('Undefined onClickItem => ', item),
    allowCreate: false,
    onCreate: (item) => console.warn('Undefined onCreateItem => ', item),
    onRemove: (item) => console.warn('Undefined onDeleteItem => ', item),
    showRoot: false,
};

export default TreeMenu;
