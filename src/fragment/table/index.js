import React, { useState, useEffect, Component } from 'react';
import {
    Table,
    TableBaseProps,
    TableHead,
    TableRow,
    TableBody,
    TableFooter,
    makeStyles,
    TableCell,
    TableContainer,
    Checkbox,
} from '@material-ui/core';
import Cell from './Cell';
import PaginationBar from '../PaginationBar';
import { HeaderCell } from './HeaderCell';

export type TableField = {
    name: String,
    type: 'text' | 'image' | 'action' | 'raw',
    align: 'left' | 'center' | 'right',
    label: String,
    minWidth: Number,
    sortable: ?Boolean,
    hidden: ?Boolean,
    onLoad(item: Object): (?Function) => Component | String,
};

export type DataTableProps = {
    ...TableBaseProps,
    fields: Array<Object>,
    items: Array<Object>,
    selectedData: Array<Object> | Object,
    total: Number,
    pageSize: Number,
    currentPage: Number,
    sort: String,
    multi?: Boolean,
    onPageChange(page: Number): ?Function,
    onRowClick(item: Object): ?Function,
    onSelectionChange(result: Object | Array<Object>): ?Function,
    onError(error: Object | String): ?Function,
};

const styles = makeStyles(theme => ({
    root: {
        flex: 1,
    },
    tableHead: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderBottom: theme.palette.divider,
    },
    tableBody: {
        background: theme.palette.background.default,
        borderBottom: theme.palette.primary.dark,
    },
    tableFooter: {
        padding: theme.spacing(1),
    },
}));

const SelectionCheckbox = makeStyles(theme => ({
    root: {
        color: theme.palette.primary.contrastText,
        '&$checked': {
            color: theme.palette.secondary.main,
        },
        '&$indeterminate': {
            color: theme.palette.secondary.main,
        },
    },
    checked: {},
    indeterminate: {},
}));

const DataTable = (props: DataTableProps) => {
    const classes = styles();
    const {
        multi,
        selectedData,
        fields,
        items,
        total,
        pageSize,
        currentPage,
        sort,
        onPageChange,
        onRowClick,
        onSelectionChange,
        ...tableProps
    } = props;
    const [checked, setChecked] = useState(selectedData);
    const [rootState, setRootState] = useState('unchecked');

    useEffect(() => {
        if (!checked || checked.length <= 0 || !items || items.length <= 0) {
            setRootState('unchecked');
            return;
        }

        if (!multi) {
            return;
        }

        let found = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item) {
                continue;
            }
            const existIdx = checked.findIndex(x => x.id === item.id);
            if (existIdx >= 0) {
                found++;
            }
        }

        if (found > 0) {
            setRootState(found === items.length ? 'checked' : 'indeterminate');
        } else {
            setRootState('unchecked');
        }
    }, [items, checked]);

    const handleRootClick = event => {
        if (!multi) {
            return;
        }
        let updateSelection = checked.filter(x => items.findIndex(item => item.id === x.id) < 0);
        if (event.target.checked) {
            updateSelection = [...updateSelection, ...items];
        }
        setChecked(updateSelection);
        onSelectionChange(updateSelection);
    };

    const handleClick = item => {
        if (!multi) {
            onSelectionChange(item);
            return;
        }

        const existIdx = checked.findIndex(x => x.id === item.id);
        const updateSelection = existIdx < 0 ? [...checked, item] : checked.filter(x => x.id !== item.id);

        setChecked(updateSelection);
        onSelectionChange(updateSelection);
    };

    const handlePageChange = page => {
        onPageChange({
            page: page,
            pageSize: pageSize,
            sort: sort,
        });
    };

    const handlePageSizeChange = pageSize => {
        onPageChange({
            page: 0,
            pageSize: pageSize,
            sort: sort,
        });
    };

    const handleSortChange = sortString => {
        onPageChange({
            page: currentPage,
            pageSize: pageSize,
            sort: sortString,
        });
    };

    return (
        <TableContainer>
            <Table size={multi ? 'small' : 'medium'} className={classes.root} {...tableProps}>
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        {multi ? (
                            <TableCell align="center" style={{ width: 64 }}>
                                <Checkbox
                                    classes={SelectionCheckbox()}
                                    indeterminate={rootState === 'indeterminate'}
                                    checked={rootState === 'checked'}
                                    value="root"
                                    onChange={handleRootClick}
                                />
                            </TableCell>
                        ) : null}
                        {fields.map((field, index) => (
                            <HeaderCell key={field.name + '-' + index} sort={sort} onSortChange={handleSortChange} field={field} />
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {items && items.length > 0 ? (
                        items.map((row, dataIdx) => {
                            let pointerStyle = {
                                cursor: 'pointer',
                            };

                            const marked = multi ? checked.findIndex(x => x.id === row.id) >= 0 : checked && checked.id && row.id === checked.id;

                            return (
                                <TableRow
                                    selected={marked}
                                    style={onRowClick ? pointerStyle : null}
                                    key={row.id + '-' + dataIdx}
                                    onClick={() => {
                                        if (onRowClick) onRowClick(row);
                                    }}
                                    hover={true}
                                >
                                    {multi ? (
                                        <TableCell align="center" style={{ width: 64 }}>
                                            <Checkbox
                                                checked={marked}
                                                onChange={() => handleClick(row)}
                                                value={row.id || dataIdx}
                                                color="secondary"
                                            />
                                        </TableCell>
                                    ) : null}
                                    {fields.map((field, index) => (
                                        <Cell key={field.name + '-' + index} field={field} data={row} />
                                    ))}
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell size="medium" colSpan={multi ? fields.length + 1 : fields.length}>
                                There is no data.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter className={classes.tableFooter}>
                    <TableRow>
                        <PaginationBar
                            total={total}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageSizeChange={handlePageSizeChange}
                            onPageChange={handlePageChange}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

DataTable.defaultProps = {
    multi: false,
    items: [],
    selectedData: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
    onPageChange: newPaged => console.warn('Undefined onPageChange => ', newPaged),
    onSelectionChange: result => console.warn('Undefined onSelectionChange => ', result),
};

export default DataTable;
