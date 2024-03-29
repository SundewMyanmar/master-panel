import React from 'react';
import { TablePagination, IconButton, Icon, makeStyles } from '@material-ui/core';
import type { TablePaginationProps } from '@material-ui/core';

export interface PaginationBarProps extends TablePaginationProps {
    rowsPerPage: Array<number>;
    total: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
}

const PAGINATION_BUTTONS = [
    {
        name: 'first',
        label: 'First Page',
        icon: 'first_page',
    },
    {
        name: 'previous',
        label: 'Previous Page',
        icon: 'chevron_left',
    },
    {
        name: 'next',
        label: 'Next Page',
        icon: 'chevron_right',
    },
    {
        name: 'last',
        label: 'Last Page',
        icon: 'last_page',
    },
];

const actionStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    paginateButton: {
        color: theme.palette.text.primary,
    },
}));
const PaginationAction = (props) => {
    const { count, page, rowsPerPage, onPageChange } = props;
    const classes = actionStyles();

    const isDisabled = (item) => {
        const pageCount = Math.ceil(count / rowsPerPage);
        if (item.name === 'first' || item.name === 'previous') {
            return page <= 0;
        } else if (item.name === 'last' || item.name === 'next') {
            return page >= pageCount - 1;
        }
        return false;
    };

    const handlePaginationAction = (action) => {
        const pageCount = Math.ceil(count / rowsPerPage);
        let currentPage = page;
        if (action.name === 'first') {
            currentPage = 0;
        } else if (action.name === 'last') {
            currentPage = pageCount - 1;
        } else if (action.name === 'next') {
            currentPage = currentPage < pageCount - 1 ? currentPage + 1 : 0;
        } else if (action.name === 'previous') {
            currentPage = currentPage > 0 ? currentPage - 1 : pageCount - 1;
        }
        onPageChange(action, currentPage);
    };

    return (
        <div className={classes.root}>
            {PAGINATION_BUTTONS.map((item, index) => {
                return (
                    <IconButton
                        className={classes.paginateButton}
                        disabled={isDisabled(item)}
                        onClick={() => handlePaginationAction(item)}
                        key={index}
                        aria-label={item.label}
                    >
                        <Icon>{item.icon}</Icon>
                    </IconButton>
                );
            })}
        </div>
    );
};

const styles = makeStyles((theme) => ({
    root: {},
}));

const PaginationBar = (props: PaginationBarProps) => {
    const { total, pageSize, currentPage, rowsPerPage, onPageChange, onPageSizeChange, ...paginationProps } = props;
    const classes = styles();
    const handleRowsPerPageChange = (e) => {
        if (onPageSizeChange) {
            onPageSizeChange(parseInt(e.target.value));
        }
    };

    return (
        <TablePagination
            className={classes.root}
            rowsPerPageOptions={rowsPerPage}
            count={total}
            rowsPerPage={pageSize}
            labelRowsPerPage="Page Size :"
            page={currentPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={(event, newPage) => onPageChange(newPage)}
            ActionsComponent={PaginationAction}
            {...paginationProps}
        />
    );
};

PaginationBar.defaultProps = {
    rowsPerPage: [5, 10, 20, 50, 100, 200],
    total: 0,
    pageSize: 5,
    currentPage: 1,
    onPageChange: (newPage) => console.warn('Undefined onPageChange => ', newPage),
};

export default PaginationBar;
