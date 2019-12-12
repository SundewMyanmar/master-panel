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
        this.state = {};
    }

    renderActions = () => {
        return (
            <div className={[this.props.classes.pager]}>
                {PAGINATION_BUTTONS.map((item, index) => {
                    return (
                        <IconButton key={index} onClick={() => this.props.onChangePage(item.name)} aria-label={item.label}>
                            <Icon color="primary">{item.icon}</Icon>
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
                onChangePage={this.props.onChangePage}
                onChangeRowsPerPage={this.props.onChangeRowsPerPage}
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
    onChangePage: () => console.log('Page Change'),
    onChangeRowsPerPage: () => console.log('Page Change'),
};

MasterPaginationBar.propTypes = {
    rowsPerPage: PropTypes.arrayOf(PropTypes.number),
    total: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(MasterPaginationBar);
