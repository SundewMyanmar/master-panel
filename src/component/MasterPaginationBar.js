import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Icon, TablePagination } from '@material-ui/core';

const styles = theme => ({
    pager: {
        flexShrink: 0,
    },
    root: {
        color: theme.palette.primary.main,
        flex: 1,
    },
    selectRoot: {
        width: 50,
    },
    selectIcon: {
        color: theme.palette.primary.main,
    },
});

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

class MasterPaginationBar extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePaginationAction = button => {
        const pageCount = Math.ceil(this.props.total / this.props.pageSize);
        let currentPage = this.props.currentPage;
        if (button === 'first') {
            currentPage = 0;
        } else if (button === 'last') {
            currentPage = pageCount - 1;
        } else if (button === 'next') {
            currentPage = currentPage < pageCount - 1 ? currentPage + 1 : 0;
        } else if (button === 'previous') {
            currentPage = currentPage > 0 ? currentPage - 1 : pageCount - 1;
        }
        if (this.props.onPageChange) {
            this.props.onPageChange(currentPage);
        }
    };

    handleDisabled = button => {
        const pageCount = Math.ceil(this.props.total / this.props.pageSize);
        if (button === 'first' || button === 'previous') {
            return this.props.currentPage <= 0;
        } else if (button === 'last' || button === 'next') {
            return this.props.currentPage >= pageCount - 1;
        }
        return false;
    };

    handleChangePage = (e, page) => {
        console.log('New Page => ', page);
    };

    handleRowsPerPageChange = e => {
        if (this.props.onPageSizeChange) {
            this.props.onPageSizeChange(parseInt(e.target.value));
        }
    };

    renderActions = () => {
        return (
            <div className={[this.props.classes.pager]}>
                {PAGINATION_BUTTONS.map((item, index) => {
                    return (
                        <IconButton
                            disabled={this.handleDisabled(item.name)}
                            color="primary"
                            key={index}
                            onClick={() => this.handlePaginationAction(item.name)}
                            aria-label={item.label}
                        >
                            <Icon>{item.icon}</Icon>
                        </IconButton>
                    );
                })}
            </div>
        );
    };

    render() {
        return (
            <TablePagination
                rowsPerPageOptions={this.props.rowsPerPage}
                colSpan={10}
                count={this.props.total}
                rowsPerPage={this.props.pageSize}
                labelRowsPerPage="Page Size :"
                page={this.props.currentPage}
                SelectProps={{ native: true }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleRowsPerPageChange}
                ActionsComponent={this.renderActions}
            />
        );
    }
}

MasterPaginationBar.defaultProps = {
    rowsPerPage: [5, 10, 20, 50],
    total: 0,
    pageSize: 5,
    currentPage: 1,
};

MasterPaginationBar.propTypes = {
    rowsPerPage: PropTypes.arrayOf(PropTypes.number),
    total: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(MasterPaginationBar);
