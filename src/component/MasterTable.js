import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

import { Table, TableBody, TableCell, TableHead, TableRow, TableFooter, IconButton, Icon, Tooltip, Button, Checkbox } from '@material-ui/core';
import MasterPaginationBar from './MasterPaginationBar';
import FormatManager from '../util/FormatManager';

const styles = theme => ({
    pager: {
        flexShrink: 0,
    },
    tableHead: {
        border: '1px solid ' + theme.palette.primary.dark,
    },
    markedRow: {
        background: theme.palette.common.marked,
    },
});

const CustomTableCell = withStyles(theme => ({
    head: {
        paddingLeft: 0,
        paddingRight: 5,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
    },
    body: {
        paddingLeft: 0,
        paddingRight: 5,
    },
}))(TableCell);

class MasterTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sortBy: '', sortOrder: 'ASC' };
    }

    componentDidMount() {
        this.prepareSortString();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sortBy !== this.props.sortBy) {
            this.prepareSortString();
        }
    }

    prepareSortString = () => {
        if (!this.props.sortBy) {
            return;
        }
        const sortParams = this.props.sortBy.split(':', 2);

        const sortBy = FormatManager.camelToSnake(sortParams[0]);
        if (sortParams.length >= 2 && sortParams[1].toUpperCase() === 'DESC') {
            this.setState({
                sortBy: sortBy,
                sortOrder: 'DESC',
            });
        } else {
            this.setState({ sortBy: sortBy, sortOrder: 'ASC' });
        }
    };

    handlePageChange = page => {
        this.props.onPageChange({
            page: page,
            pageSize: this.props.pageSize,
            sortBy: this.props.sortParams,
        });
    };

    handlePageSizeChange = pageSize => {
        this.props.onPageChange({
            page: 0,
            pageSize: pageSize,
            sortBy: this.props.sortParams,
        });
    };

    handleSortChange = sortBy => {
        let sortOrder = 'ASC';
        if (this.state.sortBy === sortBy) {
            sortOrder = this.state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
        }

        this.props.onPageChange({
            page: this.props.currentPage,
            pageSize: this.props.pageSize,
            sort: FormatManager.snakeToCamel(sortBy) + ':' + sortOrder,
        });
    };

    renderImageCell = (field, row) => {
        return (
            <CustomTableCell key={field.name + '_' + row.id} align={field.align}>
                {row[field.name] ? (
                    <img alt="" width={40} src={row[field.name].public_url} />
                ) : (
                    <img alt="Default" width={40} src="/res/default-image.png" />
                )}
            </CustomTableCell>
        );
    };

    renderCheckCell = (field, row) => {
        return (
            <CustomTableCell key={field.name + '_' + row.id} align={field.align}>
                <Checkbox
                    checked={row[field.name] === 'On' ? true : false}
                    disabled={field.read_only}
                    onChange={() => {
                        if (this.props.onCheckChange && !field.read_only) this.props.onCheckChange(row);
                    }}
                    value={field.name}
                    color="primary"
                />
            </CustomTableCell>
        );
    };

    renderTextCell = (field, row) => {
        return (
            <CustomTableCell style={{ width: field.width ? field.width : '' }} key={field.name + '_' + row.id} align={field.align}>
                {row[field.name]}
            </CustomTableCell>
        );
    };

    renderActionCell = row => {
        let { classes, editTitle, deleteTitle, editIcon, deleteIcon, hideEdit, hideDelete } = this.props;

        if (!editTitle) {
            editTitle = 'Edit';
        }
        if (!deleteTitle) {
            deleteTitle = 'Delete';
        }
        if (!editIcon) {
            editIcon = 'edit';
        }
        if (!deleteIcon) {
            deleteIcon = 'delete';
        }
        return (
            <CustomTableCell key="action" align="center">
                <Tooltip style={hideEdit ? { display: 'none' } : {}} title={editTitle} placement="top">
                    <IconButton
                        size="small"
                        onClick={() => this.props.onEditButtonClick(row)}
                        className={classes.button}
                        color="primary"
                        aria-label="Edit"
                    >
                        <Icon fontSize="small">{editIcon}</Icon>
                    </IconButton>
                </Tooltip>

                <Tooltip style={hideDelete ? { display: 'none' } : {}} title={deleteTitle} placement="top">
                    <IconButton
                        size="small"
                        style={{ color: this.props.theme.palette.common.darkRed }}
                        onClick={() => this.props.onDeleteButtonClick(row)}
                        className={classes.button}
                        aria-label="Delete"
                    >
                        <Icon fontSize="small">{deleteIcon}</Icon>
                    </IconButton>
                </Tooltip>
            </CustomTableCell>
        );
    };

    renderCell = (field, row) => {
        if (field.type === 'ACTION') {
            return this.renderActionCell(row);
        } else if (field.name !== '') {
            switch (field.type) {
                case 'IMAGE':
                    return this.renderImageCell(field, row);
                case 'CHECK':
                    return this.renderCheckCell(field, row);
                default:
                    return this.renderTextCell(field, row);
            }
        } else {
            return <CustomTableCell>None</CustomTableCell>;
        }
    };

    renderHeaderCell = field => {
        let icon = 'unfold_more';
        if (field.name === FormatManager.camelToSnake(this.state.sortBy)) {
            icon = this.state.sortOrder === 'DESC' ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
        }

        return (
            <CustomTableCell key={field.display_name} align={field.align}>
                <Button
                    size="small"
                    disabled={!field.sortable}
                    style={{ color: this.props.theme.palette.background.default }}
                    onClick={() => this.handleSortChange(field.name)}
                >
                    <Icon
                        style={{
                            color: this.props.theme.palette.background.default,
                            fontSize: 15,
                            display: field.sortable ? 'block' : 'none',
                        }}
                    >
                        {icon}
                    </Icon>
                    {field.display_name}
                </Button>
            </CustomTableCell>
        );
    };

    render() {
        const { classes, items, fields, total, pageSize, currentPage, onRowClick } = this.props;

        return (
            <Table className={classes.table} size="small">
                <TableHead className={classes.tableHead}>
                    <TableRow>{fields.map(field => this.renderHeaderCell(field))}</TableRow>
                </TableHead>
                <TableBody>
                    {items.map(row => {
                        let pointerStyle = {
                            cursor: 'pointer',
                        };

                        return (
                            <TableRow
                                style={onRowClick ? pointerStyle : null}
                                className={row.marked ? classes.markedRow : classes.row}
                                key={row.id}
                                onClick={() => {
                                    if (onRowClick) onRowClick(row);
                                }}
                                hover={true}
                            >
                                {fields.map(field => this.renderCell(field, row))}
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <MasterPaginationBar
                            total={total}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageSizeChange={this.handlePageSizeChange}
                            onPageChange={this.handlePageChange}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }
}

MasterTable.defaultProps = {
    items: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
    onEditButtonClick: () => console.log('Edit button clicked'),
    onDeleteButtonClick: () => console.log('Delete button clicked'),
    onPageChange: () => console.log('Page changed'),
    onRowsPerPageChange: () => console.log('Rows per page changed'),
};

MasterTable.propTypes = {
    fields: PropTypes.array.isRequired,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    sortBy: PropTypes.string,
    items: PropTypes.array,
    onEditButtonClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onPageChange: PropTypes.func,
    onCheckChange: PropTypes.func,
    onRowClick: PropTypes.func,
};

export default withRouter(withStyles(styles, { withTheme: true })(MasterTable));
