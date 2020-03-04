import React from 'react';
import { TablePagination, TablePaginationBaseProps, IconButton, Icon, makeStyles } from '@material-ui/core';

type PaginationBarProps = {
    ...TablePaginationBaseProps,
    rowsPerPage: Array<Number>,
    total: Number,
    pageSize: Number,
    currentPage: Number,
    onPageChange(newPage): Function,
    onPageSizeChange(newPageSize): Function,
};

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

const actionStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));
const PaginationAction = props => {
    const { count, page, rowsPerPage, onChangePage } = props;
    const classes = actionStyles();

    const isDisabled = item => {
        const pageCount = Math.ceil(count / rowsPerPage);
        if (item.name === 'first' || item.name === 'previous') {
            return page <= 0;
        } else if (item.name === 'last' || item.name === 'next') {
            return page >= pageCount - 1;
        }
        return false;
    };

    const handlePaginationAction = action => {
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
        onChangePage(action, currentPage);
    };

    return (
        <div className={classes.root}>
            {PAGINATION_BUTTONS.map((item, index) => {
                return (
                    <IconButton
                        color="primary"
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

const styles = makeStyles(theme => ({
    root: {
        background: theme.palette.common.white,
    },
}));

const PaginationBar = (props: PaginationBarProps) => {
    const { total, pageSize, currentPage, rowsPerPage, onPageChange, onPageSizeChange, ...paginationProps } = props;
    const classes = styles();
    const handleRowsPerPageChange = e => {
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
            onChangeRowsPerPage={handleRowsPerPageChange}
            onChangePage={(event, newPage) => onPageChange(newPage)}
            ActionsComponent={PaginationAction}
            {...paginationProps}
        />
    );
};

PaginationBar.defaultProps = {
    rowsPerPage: [5, 10, 20, 50],
    total: 0,
    pageSize: 5,
    currentPage: 1,
    onPageChange: newPage => console.warn('Undefined onPageChange => ', newPage),
};

export default PaginationBar;
