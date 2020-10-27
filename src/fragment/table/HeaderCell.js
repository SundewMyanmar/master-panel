import React from 'react';
import { TableCell, TableSortLabel, makeStyles } from '@material-ui/core';

export type HeaderCellProps = {
    ...TableSortLabelProps,
    field: TableField,
    sort: string,
    onSortChange?: (field: TableField, sort: 'ASC' | 'DESC') => string,
};

const headerStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText,
        '&$active': {
            color: theme.palette.primary.contrastText,
        },
    },
    active: { color: theme.palette.primary.contrastText },
    icon: {
        fontSize: 15,
        color: theme.palette.primary.contrastText + '!important',
    },
}));

export const HeaderCell = (props: HeaderCellProps) => {
    const { field, sort, onSortChange, ...sortLabelProps } = props;
    const classes = headerStyles();

    if (!field.sortable || !sort) {
        return (
            <TableCell className={classes.root} align={field.align} style={field.minWidth ? { minWidth: field.minWidth } : null}>
                {field.label}
            </TableCell>
        );
    }

    const sortParams = sort.replace(/\s/g, '').split(':', 2);

    const column = sortParams[0];
    let direction = 'asc';
    if (sortParams.length >= 2) {
        direction = sortParams[1].toLowerCase();
    }

    const handleSortChange = () => {
        let newDirection = 'asc';
        if (field.name === column) {
            newDirection = direction === 'asc' ? 'desc' : 'asc';
        }
        if (onSortChange) {
            onSortChange(field.name + ':' + newDirection.toUpperCase());
        }
    };

    return (
        <TableCell className={classes.root} align={field.align} style={field.minWidth ? { minWidth: field.minWidth } : null}>
            <TableSortLabel classes={classes} active={field.name === column} direction={direction} onClick={handleSortChange} {...sortLabelProps}>
                {field.label}
            </TableSortLabel>
        </TableCell>
    );
};
