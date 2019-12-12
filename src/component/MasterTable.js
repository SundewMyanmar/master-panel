import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    IconButton,
    Icon,
    Tooltip,
    Button,
    Typography,
    Checkbox,
} from '@material-ui/core';
import MasterPaginationBar from './MasterPaginationBar';

const styles = theme => ({
    pager: {
        flexShrink: 0,
    },
    tableHead: {
        border: '1px solid ' + theme.palette.primary.dark,
    },
});

const StyledPager = withStyles(theme => ({
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
}))(TablePagination);

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
        // color:theme.palette.primary.main
    },
}))(TableCell);

class MasterTable extends React.Component {
    constructor(props) {
        super(props);

        // var fields=this.props.fields;
        // fields.push({
        //     name:"",
        //     align:"right",
        //     display_name:""
        // })

        this.state = {};
    }

    handleSortBy(sortBy) {
        const { items } = this.props;
        var sortOrder = this.state.sortOrder;
        if (this.state.sortBy === sortBy) {
            sortOrder = !this.state.sortOrder;
        } else {
            sortOrder = true;
        }

        const result = !sortOrder ? items.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1)) : items.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1));

        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
            items: result,
        });
    }

    render() {
        const {
            classes,
            items,
            fields,
            editButton,
            deleteButton,
            total,
            pageSize,
            currentPage,
            handleChangePage,
            handleChangeRowsPerPage,
            handleCheckChange,
            handleRowClick,
            _this,
        } = this.props;
        var { editTitle, deleteTitle, editIcon, deleteIcon, hideEdit, hideDelete } = this.props;

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
            <Table className={classes.table} size="small">
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        {fields.map(field => {
                            return (
                                <CustomTableCell key={field.display_name} align={field.align}>
                                    {field.name !== '' ? (
                                        <Button
                                            size="small"
                                            style={{ color: this.props.theme.palette.background.default }}
                                            onClick={() => this.handleSortBy(field.name)}
                                        >
                                            <Icon
                                                style={{
                                                    color: this.props.theme.palette.background.default,
                                                    fontSize: 22,
                                                    display: this.state.sortBy === field.name ? 'block' : 'none',
                                                }}
                                            >
                                                {this.state.sortBy === field.name && this.state.sortOrder ? 'arrow_drop_down' : 'arrow_drop_up'}
                                            </Icon>
                                            {field.display_name}
                                        </Button>
                                    ) : (
                                        <Typography variant="subtitle2" style={{ color: this.props.theme.palette.background.default }}>
                                            {field.display_name}
                                        </Typography>
                                    )}
                                </CustomTableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(row => (
                        <TableRow
                            className={classes.row}
                            key={row.id}
                            onClick={handleRowClick ? () => handleRowClick(row) : console.log('Handle Row Click => ', row)}
                            hover={handleRowClick ? true : false}
                        >
                            {fields.map(field => {
                                if (field.name !== '') {
                                    if (field.type === 'IMAGE') {
                                        return (
                                            <CustomTableCell key={field.name} align={field.align}>
                                                {row[field.name] ? (
                                                    <img alt="" width={40} src={row[field.name].public_url} />
                                                ) : (
                                                    <img alt="Default" width={40} src="/res/default-image.png" />
                                                )}
                                            </CustomTableCell>
                                        );
                                    } else if (field.type === 'CHECK') {
                                        return (
                                            <CustomTableCell key={field.name} align={field.align}>
                                                <Checkbox
                                                    checked={row[field.name] === 'On' ? true : false}
                                                    onChange={() => handleCheckChange(row)}
                                                    value={field.name}
                                                    color="primary"
                                                />
                                            </CustomTableCell>
                                        );
                                    } else
                                        return (
                                            <CustomTableCell style={{ width: field.width ? field.width : '' }} key={field.name} align={field.align}>
                                                {row[field.name]}
                                            </CustomTableCell>
                                        );
                                } else {
                                    return (
                                        <CustomTableCell key="action" align="center">
                                            <Tooltip style={hideEdit ? { display: 'none' } : {}} title={editTitle} placement="top">
                                                <IconButton
                                                    onClick={() => editButton(row.id, _this, row)}
                                                    color="primary"
                                                    className={classes.button}
                                                    aria-label="Edit"
                                                >
                                                    <Icon fontSize="small">{editIcon}</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip style={hideDelete ? { display: 'none' } : {}} title={deleteTitle} placement="top">
                                                <IconButton
                                                    style={{ color: this.props.theme.palette.common.darkRed }}
                                                    onClick={() => deleteButton(row.id, row.name ? row.name : row.display_name, _this, row)}
                                                    className={classes.button}
                                                    aria-label="Delete"
                                                >
                                                    <Icon fontSize="small">{deleteIcon}</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </CustomTableCell>
                                    );
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <MasterPaginationBar
                            total={total}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={event => {
                                handleChangeRowsPerPage(event, _this);
                            }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }
}

MasterTable.propTypes = {
    pageSize: PropTypes.number,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(MasterTable));
